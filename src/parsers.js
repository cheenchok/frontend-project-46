import yaml from 'js-yaml';
import fs from 'fs';

function getFormat(path) {
  const data = path.split('.');
  return data[data.length - 1];
}

export function getDataFromFile(path) {
  const format = getFormat(path);
  const string = fs.readFileSync(path, 'utf8');

  if (format === 'json') {
    const data = JSON.parse(string);
    return data;
  }
  if (format === 'yml') {
    const data = yaml.load(string);
    return data;
  }
  return string;
}
