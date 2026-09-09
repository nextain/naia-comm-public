import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { validateCatalog, selectRepositories, plan, pairingFindings, doctor } from './workspace.mjs';
import { isLocalProductPath } from './local-product-paths.mjs';

const catalog = JSON.parse(await fs.readFile(new URL('../workspace/repos.json', import.meta.url), 'utf8'));
validateCatalog(catalog);
const ignoreRules = (await fs.readFile(new URL('../.gitignore', import.meta.url), 'utf8')).split(/\r?\n/);
for (const repo of catalog.repositories) assert.ok(ignoreRules.includes(`/${repo.path}/`), `${repo.id} must remain an ignored local clone`);
assert.equal(isLocalProductPath('projects/naia-shell/README.md'), true);
assert.equal(isLocalProductPath('projects\\naia-agent\\.env'), true);
assert.equal(isLocalProductPath('projects/naia-comm/site/index.html'), false);
assert.equal(isLocalProductPath('projects/naia-shell-copy/file'), false);
assert.equal(selectRepositories(catalog, 'shell').length, 4);
assert.equal(selectRepositories(catalog, 'community').length, 0);
assert.throws(() => selectRepositories(catalog, '__proto__'), /Unknown profile/);
assert.throws(() => selectRepositories(catalog, 'missing'), /Unknown profile/);
for (const change of [
  c => c.repositories[0].path = '../outside',
  c => c.repositories[0].repository = 'untrusted/naia-shell',
  c => c.repositories[0].id = 'naia-shell;touch bad',
  c => c.repositories[0] = { id: 'naia-comm', repository: 'nextain/naia-comm', path: 'projects/naia-comm', branch: 'main' },
  c => c.repositories.push(c.repositories[0]),
  c => c.profiles.shell.push('missing')
]) {
  const copy = structuredClone(catalog); change(copy);
  assert.throws(() => validateCatalog(copy), /Unsafe or duplicate repository entry|Invalid profile members/);
}
assert.equal(plan(catalog, 'community').includes('git clone --branch'), false);
assert.equal(plan(catalog, 'shell').split('\n').filter(line => line.startsWith('git clone')).length, 4);
const commit = 'a'.repeat(40), other = 'b'.repeat(40);
const pairing = { agentCommit: commit, memoryCommit: commit };
assert.deepEqual(pairingFindings(pairing, { 'naia-agent': commit, 'naia-memory': commit }), []);
assert.equal(pairingFindings(pairing, { 'naia-agent': other }).length, 2);
assert.equal(pairingFindings({}, {}).length, 2);

// Deterministic filesystem fixtures; Git responses are injected, no product code or network.
const root = await fs.mkdtemp(path.join(os.tmpdir(), 'naia-workspace-'));
try {
  const missing = await doctor(catalog, 'shell', root);
  assert.equal(missing.checkoutChecks, 'FAIL');
  assert.equal(missing.findings.length, 5);
  for (const repo of selectRepositories(catalog, 'shell')) await fs.mkdir(path.join(root, repo.path), { recursive: true });
  const pairingDir = path.join(root, 'projects/naia-shell/packages/shell');
  await fs.mkdir(pairingDir, { recursive: true });
  await fs.writeFile(path.join(pairingDir, 'agent-pairing.json'), JSON.stringify(pairing));
  const cleanGit = async (cwd, args) => args.includes('--show-toplevel') ? cwd : args.includes('HEAD') ? commit : '';
  const clean = await doctor(catalog, 'shell', root, cleanGit);
  assert.equal(clean.checkoutChecks, 'PASS');
  assert.equal(clean.productBuildAndRuntime, 'NOT_RUN');
  // Reproduce macOS-style ancestor aliases on every host without relaxing child boundaries.
  const alias = path.join(root, 'workspace-alias');
  await fs.symlink(await fs.realpath(root), alias, 'dir');
  assert.deepEqual(await doctor(catalog, 'shell', alias, cleanGit), clean);
  await fs.unlink(alias);
  const pairingFile = path.join(pairingDir, 'agent-pairing.json');
  const pairingTarget = path.join(root, 'pairing-target.json');
  await fs.rename(pairingFile, pairingTarget);
  await fs.symlink(pairingTarget, pairingFile, 'file');
  assert.equal((await doctor(catalog, 'shell', root, cleanGit)).checkoutChecks, 'FAIL');
  await fs.unlink(pairingFile);
  await fs.rename(pairingTarget, pairingFile);
  const projects = path.join(root, 'projects');
  const projectsTarget = path.join(root, 'projects-target');
  await fs.rename(projects, projectsTarget);
  await fs.symlink(projectsTarget, projects, 'dir');
  const linkedProjects = await doctor(catalog, 'shell', root, cleanGit);
  assert.equal(linkedProjects.checkoutChecks, 'FAIL');
  assert.equal(linkedProjects.findings.length, 5);
  await fs.unlink(projects);
  await fs.rename(projectsTarget, projects);
  const dirty = await doctor(catalog, 'shell', root, async (cwd, args) => args.includes('status') ? ' M file' : cleanGit(cwd, args));
  assert.equal(dirty.findings.length, 4);
  const parent = await doctor(catalog, 'shell', root, async (cwd, args) => args.includes('--show-toplevel') ? root : cleanGit(cwd, args));
  assert.equal(parent.checkoutChecks, 'FAIL');
  await fs.writeFile(path.join(pairingDir, 'agent-pairing.json'), '{invalid');
  assert.equal((await doctor(catalog, 'shell', root, cleanGit)).checkoutChecks, 'FAIL');
  const community = await doctor(catalog, 'community', root);
  assert.deepEqual(community.heads, {});
  assert.equal(community.productBuildAndRuntime, 'NOT_RUN');
  const agentPath = path.join(root, 'projects/naia-agent');
  await fs.rmdir(agentPath);
  await fs.symlink(path.join(root, 'projects/naia-memory'), agentPath, 'dir');
  const linked = await doctor(catalog, 'shell', root, cleanGit);
  assert.ok(linked.findings.includes('naia-agent: missing or unreadable independent checkout'));
} finally {
  await fs.rm(root, { recursive: true, force: true });
}
// Exercise the production Git adapter as well as injected failures. Local fixtures only.
const realRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'naia-real-git-'));
try {
  const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  const commitFixture = cwd => {
    git(cwd, 'add', '.');
    git(cwd, '-c', 'user.name=Fixture', '-c', 'user.email=fixture@localhost',
      '-c', 'commit.gpgsign=false', '-c', 'core.hooksPath=/dev/null', 'commit', '-qm', 'fixture');
    return git(cwd, 'rev-parse', 'HEAD');
  };
  const heads = {};
  for (const repo of selectRepositories(catalog, 'shell')) {
    const directory = path.join(realRoot, repo.path);
    await fs.mkdir(directory, { recursive: true });
    git(directory, 'init', '-q', '--initial-branch=main', '--object-format=sha1');
    await fs.writeFile(path.join(directory, 'README.md'), 'Synthetic fixture.\n');
    heads[repo.id] = commitFixture(directory);
  }
  const shell = path.join(realRoot, 'projects/naia-shell');
  const pairingFile = path.join(shell, 'packages/shell/agent-pairing.json');
  await fs.mkdir(path.dirname(pairingFile), { recursive: true });
  const pair = { agentCommit: heads['naia-agent'], memoryCommit: heads['naia-memory'] };
  await fs.writeFile(pairingFile, JSON.stringify(pair));
  heads['naia-shell'] = commitFixture(shell);
  const alias = path.join(realRoot, 'alias');
  await fs.symlink(await fs.realpath(realRoot), alias, 'dir');
  const result = await doctor(catalog, 'shell', alias);
  assert.equal(result.checkoutChecks, 'PASS');
  assert.deepEqual(result.heads, heads);
  assert.equal(result.productBuildAndRuntime, 'NOT_RUN');
  const dirtyFile = path.join(realRoot, 'projects/naia-agent/untracked.txt');
  await fs.writeFile(dirtyFile, 'dirty fixture\n');
  assert.ok((await doctor(catalog, 'shell', alias)).findings.some(f => f.startsWith('naia-agent: dirty checkout')));
  await fs.unlink(dirtyFile);
  await fs.writeFile(pairingFile, JSON.stringify({ ...pair, agentCommit: '0'.repeat(40) }));
  commitFixture(shell);
  assert.ok((await doctor(catalog, 'shell', alias)).findings.some(f => f.startsWith('naia-agent: expected')));
} finally {
  await fs.rm(realRoot, { recursive: true, force: true });
}
console.log('workspace tests passed: safe plans, root aliases, child symlink rejection, real Git roots/dirty/pairing checks and evidence limits');
