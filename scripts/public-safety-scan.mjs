import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';

const root = path.resolve(process.env.PUBLIC_SAFETY_SCAN_ROOT || path.resolve(import.meta.dirname, '..'));
const excluded = new Set(['.git', 'node_modules', '.runtime', '.secrets', 'coverage']);
const forbiddenNames = new Set(['id_rsa', 'id_ed25519']);
const GIT_DOWNLOAD_URL = 'https://git-scm.com/downloads';
const suspicious = [
  /-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----/,
  /(?:discord(?:_bot)?_token|github_token|password)[ \t]*[:=][ \t]*[^\s"']{8,}/i,
  /https?:\/\/[^\s/@]+:[^\s/@]+@/,
  /\b(?:\d{1,3}\.){3}\d{1,3}\b/
];
const findings = [];

function pathParts(file) {
  return file.split(/[\\/]+/).filter(Boolean);
}

function isEnvFilename(name) {
  return name === '.env' || (name.startsWith('.env.') && name !== '.env.example');
}

function isForbiddenFilename(file) {
  return pathParts(file).some((part) => isEnvFilename(part) || forbiddenNames.has(part));
}

function isIgnoredLocalPath(file) {
  const parts = pathParts(file);
  return parts.some((part) => excluded.has(part) || isEnvFilename(part));
}

function inspectCandidateFile(relativeFile) {
  const rel = relativeFile.split(path.sep).join('/');
  if (isForbiddenFilename(rel)) {
    findings.push(`${rel}: forbidden filename`);
    return;
  }

  const full = path.resolve(root, rel);
  if (full !== root && !full.startsWith(`${root}${path.sep}`)) {
    findings.push(`${rel}: path escapes repository`);
    return;
  }

  let stat;
  try {
    stat = fs.lstatSync(full);
  } catch {
    findings.push(`${rel}: unable to inspect`);
    return;
  }
  if (stat.isSymbolicLink()) {
    findings.push(`${rel}: symlink not allowed`);
    return;
  }
  if (!stat.isFile()) return;

  let data;
  try {
    data = fs.readFileSync(full);
  } catch {
    findings.push(`${rel}: unable to inspect`);
    return;
  }
  if (data.includes(0)) return;
  inspectText(rel, data.toString('utf8'));
}

function walkPublicTree(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(root, full);
    if (isIgnoredLocalPath(rel)) continue;
    if (entry.isDirectory()) walkPublicTree(full);
    else inspectCandidateFile(rel);
  }
}

function scanWorkingTree() {
  if (!fs.existsSync(path.join(root, '.git'))) {
    walkPublicTree(root);
    return;
  }

  let output;
  try {
    output = execFileSync('git', ['ls-files', '-co', '--exclude-standard', '-z'], {
      cwd: root,
      encoding: 'buffer'
    });
  } catch {
    findings.push('working tree: unable to enumerate public files');
    return;
  }

  for (const file of output.toString('utf8').split('\0').filter(Boolean)) {
    inspectCandidateFile(file);
  }
}

function inspectText(label, text) {
  suspicious.forEach((pattern, index) => {
    if (pattern.test(text)) findings.push(`${label}: pattern ${index + 1}`);
  });
}

function supportsNulDelimitedHistory() {
  let versionOutput;
  try {
    versionOutput = execFileSync('git', ['--version'], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    });
  } catch {
    findings.push(`git history: unable to determine Git version; Git 2.50.0 or newer is required. Upgrade: ${GIT_DOWNLOAD_URL}`);
    return false;
  }

  const match = /git version (\d+)\.(\d+)(?:\.(\d+))?/.exec(versionOutput);
  if (!match) {
    findings.push(`git history: unrecognized Git version; Git 2.50.0 or newer is required. Upgrade: ${GIT_DOWNLOAD_URL}`);
    return false;
  }
  const version = [Number(match[1]), Number(match[2]), Number(match[3] || 0)];
  if (version[0] < 2 || (version[0] === 2 && version[1] < 50)) {
    findings.push(`git history: Git 2.50.0 or newer is required for NUL-delimited rev-list output (detected ${match[0]}). Upgrade: ${GIT_DOWNLOAD_URL}`);
    return false;
  }
  return true;
}

const reportedHistoricalForbiddenFiles = new Set();

function reportHistoricalForbiddenFilename(file, objectId = '') {
  if (!isForbiddenFilename(file) || reportedHistoricalForbiddenFiles.has(file)) return;
  reportedHistoricalForbiddenFiles.add(file);
  const prefix = objectId ? `${objectId.slice(0, 12)} ` : '';
  findings.push(`history ${prefix}${file}: forbidden filename`);
}

function enumerateHistoricalAddedPaths() {
  let output;
  try {
    output = execFileSync('git', [
      'log', '--all', '--no-renames', '--diff-filter=A', '--name-only',
      '--format=', '-z', '--'
    ], {
      cwd: root,
      encoding: 'buffer',
      stdio: ['ignore', 'pipe', 'ignore']
    });
  } catch {
    findings.push('git history: unable to enumerate historical filenames');
    return;
  }

  if (output.length > 0 && !output.includes(0)) {
    findings.push(`git history: historical filename output was not NUL-delimited; Git 2.50.0 or newer is required. Upgrade: ${GIT_DOWNLOAD_URL}`);
    return;
  }

  for (const file of output.toString('utf8').split('\0').filter(Boolean)) {
    reportHistoricalForbiddenFilename(file);
  }
}

function scanReachableHistory() {
  if (!fs.existsSync(path.join(root, '.git'))) return;
  if (!supportsNulDelimitedHistory()) return;

  let output;
  try {
    output = execFileSync('git', ['rev-list', '--all', '--objects', '-z'], {
      cwd: root,
      encoding: 'buffer',
      stdio: ['ignore', 'pipe', 'ignore']
    });
  } catch {
    findings.push('git history: unable to enumerate reachable revisions');
    return;
  }

  if (output.length > 0 && !output.includes(0)) {
    findings.push(`git history: rev-list output was not NUL-delimited; Git 2.50.0 or newer is required. Upgrade: ${GIT_DOWNLOAD_URL}`);
    return;
  }

  const pathsByBlob = new Map();
  const records = output.toString('utf8').split('\0').filter(Boolean);
  for (let index = 0; index < records.length; index += 1) {
    const objectId = records[index];
    if (!/^[0-9a-f]{40,64}$/.test(objectId)) continue;
    const pathRecord = records[index + 1];
    if (!pathRecord?.startsWith('path=')) continue;
    index += 1;
    const file = pathRecord.slice('path='.length);
    const files = pathsByBlob.get(objectId) || new Set();
    files.add(file);
    pathsByBlob.set(objectId, files);
  }

  enumerateHistoricalAddedPaths();

  const objectIds = [...pathsByBlob.keys()];
  if (!objectIds.length) return;
  const objectTypes = spawnSync('git', ['cat-file', '--batch-check'], {
    cwd: root,
    input: `${objectIds.join('\n')}\n`,
    encoding: null,
    maxBuffer: 16 * 1024 * 1024,
    stdio: ['pipe', 'pipe', 'pipe']
  });
  if (objectTypes.error || objectTypes.status !== 0) {
    findings.push('git history: unable to classify reachable objects');
    return;
  }
  const blobIds = [];
  for (const line of Buffer.from(objectTypes.stdout || []).toString('ascii').split('\n')) {
    const [objectId, type] = line.split(' ');
    if (type === 'blob' && pathsByBlob.has(objectId)) blobIds.push(objectId);
  }
  if (!blobIds.length) return;
  const batch = spawnSync('git', ['cat-file', '--batch'], {
    cwd: root,
    input: `${blobIds.join('\n')}\n`,
    encoding: null,
    maxBuffer: 256 * 1024 * 1024,
    stdio: ['pipe', 'pipe', 'pipe']
  });
  if (batch.error || batch.status !== 0) {
    findings.push('git history: unable to inspect unique reachable blobs');
    return;
  }

  const data = Buffer.from(batch.stdout || []);
  let offset = 0;
  for (const objectId of blobIds) {
    const headerEnd = data.indexOf(0x0a, offset);
    if (headerEnd < 0) {
      findings.push(`history ${objectId.slice(0, 12)}: malformed cat-file header`);
      return;
    }
    const [returnedId, type, sizeText] = data.subarray(offset, headerEnd).toString('ascii').split(' ');
    const size = Number(sizeText);
    const contentStart = headerEnd + 1;
    const contentEnd = contentStart + size;
    if (returnedId !== objectId || !Number.isSafeInteger(size) || contentEnd > data.length || data[contentEnd] !== 0x0a) {
      findings.push(`history ${objectId.slice(0, 12)}: malformed cat-file response`);
      return;
    }
    const content = data.subarray(contentStart, contentEnd);
    offset = contentEnd + 1;
    if (type !== 'blob') continue;
    for (const file of pathsByBlob.get(objectId)) {
      reportHistoricalForbiddenFilename(file, objectId);
      if (!content.includes(0)) inspectText(`history ${objectId.slice(0, 12)} ${file}`, content.toString('utf8'));
    }
  }
}

scanWorkingTree();
scanReachableHistory();
if (findings.length) {
  console.error('public-safety scan failed (values intentionally omitted):');
  findings.forEach((item) => console.error(`- ${item}`));
  process.exit(1);
}
console.log('public-safety scan passed');
