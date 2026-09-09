import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sha = /^[a-f0-9]{40}$/;

export function validateCatalog(catalog) {
  if (catalog.schemaVersion !== 1 || !Array.isArray(catalog.repositories) ||
      !catalog.profiles || typeof catalog.profiles !== 'object' || Array.isArray(catalog.profiles)) {
    throw new Error('Invalid repository catalog');
  }
  const ids = new Set();
  for (const repo of catalog.repositories) {
    if (!/^naia-[a-z0-9-]+$/.test(repo.id) || repo.id === 'naia-comm' || ids.has(repo.id) ||
        repo.repository !== `nextain/${repo.id}` || repo.path !== `projects/${repo.id}` ||
        repo.branch !== 'main') throw new Error('Unsafe or duplicate repository entry');
    ids.add(repo.id);
  }
  for (const members of Object.values(catalog.profiles)) {
    if (!Array.isArray(members) || new Set(members).size !== members.length ||
        members.some(id => !ids.has(id))) throw new Error('Invalid profile members');
  }
  return catalog;
}

export function selectRepositories(catalog, profile) {
  validateCatalog(catalog);
  if (!Object.hasOwn(catalog.profiles, profile)) throw new Error(`Unknown profile: ${profile}`);
  return catalog.profiles[profile].map(id => catalog.repositories.find(repo => repo.id === id));
}

export function plan(catalog, profile) {
  const repos = selectRepositories(catalog, profile);
  return [
    '# Run from the naia-comm root in a POSIX shell. Inspect each repository before building.',
    '# Exploration only: main moves. Follow Shell agent-pairing.json for Agent/Memory SHAs.',
    '# git clone refuses an occupied destination. No existing checkout is changed by this plan.',
    ...repos.map(repo => `git clone --branch main https://github.com/${repo.repository}.git ${repo.path}`),
    ...(repos.length ? [] : ['# Community contributions need no product clones.']),
    '# These commands do not install dependencies, run builds, or prove compatibility.'
  ].join('\n');
}

export function pairingFindings(pairing, heads) {
  const findings = [];
  for (const [field, id] of [['agentCommit', 'naia-agent'], ['memoryCommit', 'naia-memory']]) {
    if (!sha.test(pairing?.[field] ?? '')) findings.push(`Invalid Shell pairing field: ${field}`);
    else if (heads[id] !== pairing[field]) findings.push(`${id}: expected ${pairing[field]}, got ${heads[id] ?? 'MISSING'}`);
  }
  return findings;
}

export async function doctor(catalog, profile, workspaceRoot = root, git = defaultGit) {
  const repos = selectRepositories(catalog, profile);
  // The caller's workspace may itself use a platform alias (macOS /var -> /private/var).
  // Resolve that boundary once; symlinks inside the workspace remain invalid.
  const base = await fs.realpath(workspaceRoot);
  const heads = {};
  const findings = [];
  for (const repo of repos) {
    const directory = path.join(base, repo.path);
    try {
      // realpath/root checks reject symlinked clones and accidental parent-repo discovery.
      const stat = await fs.lstat(directory);
      if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error('not a local directory');
      if (await fs.realpath(directory) !== path.resolve(directory)) throw new Error('symlinked workspace path');
      const top = await git(directory, ['rev-parse', '--show-toplevel']);
      if (path.resolve(top) !== path.resolve(directory)) throw new Error('not an independent Git root');
      const head = await git(directory, ['rev-parse', '--verify', 'HEAD']);
      if (!sha.test(head)) throw new Error('invalid HEAD');
      heads[repo.id] = head;
      const dirty = await git(directory, ['status', '--porcelain', '--untracked-files=normal']);
      if (dirty) findings.push(`${repo.id}: dirty checkout; evidence requires a clean commit`);
    } catch {
      findings.push(`${repo.id}: missing or unreadable independent checkout`);
    }
  }
  if (repos.some(repo => repo.id === 'naia-shell')) {
    try {
      const pairingFile = path.join(base, 'projects/naia-shell/packages/shell/agent-pairing.json');
      if (await fs.realpath(pairingFile) !== path.resolve(pairingFile)) throw new Error('symlinked pairing');
      const pairing = JSON.parse(await fs.readFile(pairingFile, 'utf8'));
      findings.push(...pairingFindings(pairing, heads));
    } catch {
      findings.push('Shell pairing file missing, unreadable or malformed');
    }
  }
  return { profile, heads, findings, checkoutChecks: findings.length ? 'FAIL' : 'PASS',
    productBuildAndRuntime: 'NOT_RUN', protoAndMemoryVersionAndKbCompatibility: 'NOT_RUN' };
}

async function defaultGit(cwd, args) {
  const { stdout } = await exec('git', ['--no-optional-locks', ...args], {
    cwd, encoding: 'utf8', timeout: 15000, maxBuffer: 1024 * 1024
  });
  return stdout.trim();
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const [command, profile = 'community', ...extra] = process.argv.slice(2);
    if (!['plan', 'doctor'].includes(command) || extra.length) {
      throw new Error('Usage: node scripts/workspace.mjs <plan|doctor> [community|shell|os]');
    }
    const catalog = JSON.parse(await fs.readFile(path.join(root, 'workspace/repos.json'), 'utf8'));
    if (command === 'plan') console.log(plan(catalog, profile));
    else {
      const result = await doctor(catalog, profile);
      console.log(JSON.stringify(result, null, 2));
      if (result.findings.length) process.exitCode = 1;
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
