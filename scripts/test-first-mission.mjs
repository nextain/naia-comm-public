import { isLocalProductPath } from './local-product-paths.mjs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  rmSync,
  writeFileSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ignoredTopLevel = new Set(['.git', 'node_modules', '.runtime', '.secrets', 'coverage']);

function isIgnoredPath(relativePath) {
  if (isLocalProductPath(relativePath)) return true;
  const parts = relativePath.split(/[\\/]+/).filter(Boolean);
  return parts.some((part) => ignoredTopLevel.has(part)) || parts.some((part) => (
    part === '.env' || (part.startsWith('.env.') && part !== '.env.example')
  ));
}

function hash(data) {
  return createHash('sha256').update(data).digest('hex');
}

function snapshotTree(root) {
  const snapshot = new Map();

  function visit(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const fullPath = join(directory, entry.name);
      const relativePath = relative(root, fullPath).split(sep).join('/');
      if (isIgnoredPath(relativePath)) continue;
      if (entry.isDirectory()) {
        visit(fullPath);
      } else if (entry.isSymbolicLink()) {
        snapshot.set(relativePath, `symlink:${readlinkSync(fullPath)}`);
      } else {
        const data = readFileSync(fullPath);
        snapshot.set(relativePath, `${data.length}:${hash(data)}`);
      }
    }
  }

  visit(root);
  return snapshot;
}

function changedPaths(before, after) {
  const paths = new Set([...before.keys(), ...after.keys()]);
  return [...paths].filter((path) => before.get(path) !== after.get(path)).sort();
}

function copyWorkingTree(destination) {
  cpSync(sourceRoot, destination, {
    recursive: true,
    filter(source) {
      const relativePath = relative(sourceRoot, source);
      if (!relativePath) return true;
      return !isIgnoredPath(relativePath);
    }
  });
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  return {
    status: result.status ?? -1,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
    error: result.error
  };
}

function resultText(result) {
  const output = `${result.stdout}${result.stderr}`.trim();
  const suffix = result.error ? ` (${result.error.message})` : '';
  return `${output.slice(-2000)}${suffix}`;
}

function extractMission() {
  const guide = readFileSync(join(sourceRoot, 'CONTRIBUTING.ko.md'), 'utf8');
  const heading = '## 실행 가능한 첫 문서 미션';
  const start = guide.indexOf(heading);
  assert.notEqual(start, -1, `missing guide section: ${heading}`);
  const nextHeading = guide.indexOf('\n## ', start + heading.length);
  const section = guide.slice(start, nextHeading === -1 ? guide.length : nextHeading);
  const bashMatches = [...section.matchAll(/```bash\r?\n([\s\S]*?)\r?\n```/g)];
  const bashMatch = bashMatches.find((match) => match[1].includes("python3 - <<'PY'"));
  assert.ok(bashMatch, 'first mission must contain an executable bash block');
  const pythonMatch = bashMatch[1].match(/python3 - <<'PY'\r?\n([\s\S]*?)\r?\nPY/);
  assert.ok(pythonMatch, 'first mission must contain the documented python3 block');
  const python = pythonMatch[1];
  const assignment = (name) => {
    const match = python.match(new RegExp(`^${name} = "([^"\\r\\n]*)"$`, 'm'));
    assert.ok(match, `first mission python block must define ${name}`);
    return match[1];
  };
  return { python, anchor: assignment('anchor'), addition: assignment('addition') };
}

function runMission(fixture, python) {
  return run('python3', ['-c', python], fixture);
}

function assertSuccessfulMission(result) {
  assert.equal(result.status, 0, `documented mission failed:\n${resultText(result)}`);
}

function assertFailedMission(result, expectedMessage) {
  assert.notEqual(result.status, 0, `documented mission unexpectedly succeeded; expected ${expectedMessage}`);
  assert.match(resultText(result), new RegExp(expectedMessage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
}

function assertOnlyReadmeChanged(before, after) {
  assert.deepEqual(changedPaths(before, after), ['README.md']);
}

function assertNpmTestPassed(fixture) {
  const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const result = run(npmCommand, ['test'], fixture);
  assert.equal(result.status, 0, `fixture npm test failed:\n${resultText(result)}`);
  assert.match(resultText(result), /structure validation passed/);
  assert.match(resultText(result), /public-safety scan passed/);
}

function main() {
  const mission = extractMission();
  const sourceBefore = snapshotTree(sourceRoot);
  const workRoot = mkdtempSync(join(tmpdir(), 'naia-comm-first-mission-'));
  const fixture = join(workRoot, 'fixture');

  try {
    copyWorkingTree(fixture);
    assert.equal(existsSync(join(fixture, '.git')), false, 'fixture must exclude .git');
    mkdirSync(join(fixture, '.runtime'), { recursive: true });
    writeFileSync(join(fixture, '.env'), 'LOCAL_SECRET=fixture-only-placeholder\n');
    writeFileSync(join(fixture, '.runtime', 'participants.json'), '{"participants":[]}\n');
    const fixtureBefore = snapshotTree(fixture);
    assert.equal(fixtureBefore.has('.env'), false, 'ignored fixture .env must not be observed');
    assert.equal(fixtureBefore.has('.runtime/participants.json'), false, 'ignored fixture runtime must not be observed');
    const readmePath = join(fixture, 'README.md');
    const readmeBefore = readFileSync(readmePath);
    const readmeText = readmeBefore.toString('utf8');
    assert.ok(readmeText.includes(mission.anchor), 'fixture README must contain the documented anchor; keep CONTRIBUTING.ko.md:84 in sync');

    const first = runMission(fixture, mission.python);
    assertSuccessfulMission(first);
    const readmeAfter = readFileSync(readmePath).toString('utf8');
    assert.equal(readmeAfter, readmeText.replace(mission.anchor, mission.anchor + mission.addition, 1));
    assertOnlyReadmeChanged(fixtureBefore, snapshotTree(fixture));
    const beforeFixtureTest = snapshotTree(fixture);
    assertNpmTestPassed(fixture);
    assert.deepEqual(changedPaths(beforeFixtureTest, snapshotTree(fixture)), [], 'npm test must not add or modify fixture files');
    const afterFirst = snapshotTree(fixture);

    const duplicate = runMission(fixture, mission.python);
    assertFailedMission(duplicate, 'this practice change is already present');
    assert.deepEqual(changedPaths(afterFirst, snapshotTree(fixture)), []);

    writeFileSync(readmePath, readmeBefore);
    const missingBefore = snapshotTree(fixture);
    const missingReadme = readFileSync(readmePath, 'utf8');
    assert.deepEqual(missingBefore, fixtureBefore, 'fixture reset must restore the original bytes before failure checks');
    assert.ok(missingReadme.includes(mission.anchor), 'missing-anchor fixture setup requires the anchor');
    const sentinel = '문서 미션 검증용 anchor 제거 상태입니다.';
    writeFileSync(readmePath, missingReadme.replace(mission.anchor, sentinel, 1));
    const missingSetup = snapshotTree(fixture);
    const missing = runMission(fixture, mission.python);
    assertFailedMission(missing, 'expected README anchor was not found');
    assert.deepEqual(changedPaths(missingSetup, snapshotTree(fixture)), []);

    writeFileSync(readmePath, readmeBefore);
    assert.deepEqual(snapshotTree(fixture), fixtureBefore, 'rollback must restore the fixture byte-for-byte');
    assert.deepEqual(snapshotTree(sourceRoot), sourceBefore, 'source working tree changed during smoke test');

    console.log('first mission smoke passed: documented transform, duplicate/missing-anchor rejection, npm test, README-only diff, and byte-identical rollback');
    console.log('fixture excludes .git; this validates a working tree only and provides no history or public-release proof');
  } finally {
    rmSync(workRoot, { recursive: true, force: true });
  }
}

try {
  main();
} catch (error) {
  console.error(`first mission smoke failed: ${error.message}`);
  process.exitCode = 1;
}
