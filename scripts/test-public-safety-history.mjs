import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';

const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'naia-comm-public-safety-'));
const scanner = path.join(import.meta.dirname, 'public-safety-scan.mjs');
const realGit = execFileSync('which', ['git'], { encoding: 'utf8' }).trim();

try {
  execFileSync('git', ['init', '--quiet', '--initial-branch=main'], { cwd: fixture });
  execFileSync('git', ['config', 'user.name', 'public-safety-fixture'], { cwd: fixture });
  execFileSync('git', ['config', 'user.email', 'fixture@example.invalid'], { cwd: fixture });
  const commitFixture = (message) => {
    execFileSync('git', ['-c', 'commit.gpgsign=false', '-c', 'core.hooksPath=/dev/null', '-c', 'commit.template=/dev/null', 'commit', '--quiet', '-m', message], { cwd: fixture });
  };
  const safeContent = 'safe fixture content\n';
  fs.writeFileSync(path.join(fixture, '한국어-파일.txt'), safeContent);
  fs.writeFileSync(path.join(fixture, 'duplicate-content.txt'), safeContent);
  execFileSync('git', ['add', '--', '한국어-파일.txt', 'duplicate-content.txt'], { cwd: fixture });
  commitFixture('fixture');
  fs.writeFileSync(path.join(fixture, 'notes.txt'), 'second safe fixture commit\n');
  execFileSync('git', ['add', '--', 'notes.txt'], { cwd: fixture });
  commitFixture('second fixture');

  const scannerSource = fs.readFileSync(scanner, 'utf8');
  assert.match(scannerSource, /\['rev-list', '--all', '--objects', '-z'\]/);
  assert.match(scannerSource, /\['cat-file', '--batch'\]/);
  assert.match(scannerSource, /Git 2\.50\.0 or newer is required/);
  assert.match(scannerSource, /https:\/\/git-scm\.com\/downloads/);
  assert.match(scannerSource, /enumerateHistoricalAddedPaths/);
  assert.doesNotMatch(scannerSource, /\['show',/);

  const result = spawnSync(process.execPath, [scanner], {
    cwd: path.dirname(scanner),
    env: { ...process.env, PUBLIC_SAFETY_SCAN_ROOT: fixture },
    encoding: 'utf8'
  });
  assert.equal(result.status, 0, `history scan failed: ${result.stderr}`);
  assert.match(result.stdout, /public-safety scan passed/);
  console.log('public-safety history regression passed: unique blobs and Korean filename survive reachable-history scan');

  fs.writeFileSync(path.join(fixture, 'symlink-target.txt'), safeContent);
  fs.symlinkSync('symlink-target.txt', path.join(fixture, 'tracked-link.txt'));
  execFileSync('git', ['add', '--', 'symlink-target.txt', 'tracked-link.txt'], { cwd: fixture });
  commitFixture('tracked symlink fixture');
  const symlinkResult = spawnSync(process.execPath, [scanner], {
    cwd: path.dirname(scanner),
    env: { ...process.env, PUBLIC_SAFETY_SCAN_ROOT: fixture },
    encoding: 'utf8'
  });
  assert.equal(symlinkResult.status, 1, 'tracked symlinks must fail closed');
  assert.match(symlinkResult.stderr, /tracked-link\.txt: symlink not allowed/);
  console.log('public-safety history regression passed: tracked symlink is rejected');
  fs.rmSync(path.join(fixture, 'tracked-link.txt'));
  execFileSync('git', ['add', '-u', '--', 'tracked-link.txt'], { cwd: fixture });
  commitFixture('remove tracked symlink fixture');

  fs.writeFileSync(path.join(fixture, '.env'), safeContent);
  execFileSync('git', ['add', '--', '.env'], { cwd: fixture });
  commitFixture('forbidden duplicate blob fixture');
  fs.rmSync(path.join(fixture, '.env'));
  execFileSync('git', ['add', '-u', '--', '.env'], { cwd: fixture });
  commitFixture('remove forbidden duplicate blob fixture');
  const duplicateForbidden = spawnSync(process.execPath, [scanner], {
    cwd: path.dirname(scanner),
    env: { ...process.env, PUBLIC_SAFETY_SCAN_ROOT: fixture },
    encoding: 'utf8'
  });
  assert.equal(duplicateForbidden.status, 1, 'historical forbidden filename must fail closed even when its blob is duplicated');
  assert.match(duplicateForbidden.stderr, /history .*\.env: forbidden filename/);
  console.log('public-safety history regression passed: duplicate blob under forbidden historical filename is detected');

  const fakeBin = path.join(fixture, 'fake-bin');
  fs.mkdirSync(fakeBin);
  const fakeGit = path.join(fakeBin, 'git');
  fs.writeFileSync(fakeGit, `#!/usr/bin/env node
const { spawnSync } = require('node:child_process');

if (process.argv[2] === '--version') {
  process.stdout.write(process.env.FAKE_GIT_VERSION || 'git version 2.50.0\\n');
  process.exit(0);
}
if (process.argv[2] === 'rev-list') {
  process.stdout.write('deadbeef path-without-nul\\n');
  process.exit(0);
}
const result = spawnSync(${JSON.stringify(realGit)}, process.argv.slice(2), { stdio: 'inherit' });
process.exit(result.status ?? 1);
`);
  fs.chmodSync(fakeGit, 0o755);
  const unsupportedOutput = spawnSync(process.execPath, [scanner], {
    cwd: path.dirname(scanner),
    env: { ...process.env, PATH: `${fakeBin}${path.delimiter}${process.env.PATH}`, PUBLIC_SAFETY_SCAN_ROOT: fixture },
    encoding: 'utf8'
  });
  assert.equal(unsupportedOutput.status, 1, 'newline-delimited history output must fail closed');
  assert.match(unsupportedOutput.stderr, /not NUL-delimited/);
  console.log('public-safety history regression passed: unsupported newline output fails closed');

  const unsupportedVersion = spawnSync(process.execPath, [scanner], {
    cwd: path.dirname(scanner),
    env: {
      ...process.env,
      PATH: `${fakeBin}${path.delimiter}${process.env.PATH}`,
      FAKE_GIT_VERSION: 'git version 2.49.5',
      PUBLIC_SAFETY_SCAN_ROOT: fixture
    },
    encoding: 'utf8'
  });
  assert.equal(unsupportedVersion.status, 1, 'unsupported Git version must fail closed');
  assert.match(unsupportedVersion.stderr, /Git 2\.50\.0 or newer is required/);
  console.log('public-safety history regression passed: unsupported Git version fails closed');
} finally {
  fs.rmSync(fixture, { recursive: true, force: true });
}
