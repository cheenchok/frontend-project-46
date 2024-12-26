import yaml from 'js-yaml';

export default function parser({ file, format }) {
  if (format === 'json') {
    const data = JSON.parse(file);
    return data;
  }
  if (format === 'yml') {
    const data = yaml.load(file);
    return data;
  }
  return file;
}
