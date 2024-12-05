import fs from 'fs';

export function isObject(value) {
  return value && typeof value === 'object';
}

function getFormat(path) {
  const data = path.split('.');
  return data[data.length - 1];
}

export function readFile(path) {
  const format = getFormat(path);
  const file = fs.readFileSync(path, 'utf8');

  return { file, format };
}
