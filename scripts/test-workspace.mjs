import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
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
  assert.throws(() => validateCatalog(copy));
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
console.log('workspace tests passed: safe plans, missing/dirty/wrong-root rejection, pairing drift and evidence limits');
