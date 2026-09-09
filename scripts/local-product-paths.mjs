import fs from 'node:fs';
import { validateCatalog } from './workspace.mjs';

const catalog = validateCatalog(JSON.parse(fs.readFileSync(new URL('../workspace/repos.json', import.meta.url), 'utf8')));
const paths = catalog.repositories.map(repo => repo.path);

// Used only for local filesystem walks; tracked Git files must still be scanned.
export function isLocalProductPath(file) {
  const normalized = file.replaceAll('\\', '/');
  return paths.some(base => normalized === base || normalized.startsWith(`${base}/`));
}
