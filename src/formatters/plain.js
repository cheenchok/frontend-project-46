import DIFF from '../consts.js';
import { isObject } from '../utils.js';

function formatValue(value) {
  return isObject(value) ? '[complex value]' : `${typeof value === 'string' ? `'${value}'` : value}`;
}

function getFullPath(parentPath, key) {
  return parentPath ? `${parentPath}.${key}` : key;
}

function makeLine(key, postfix) {
  return `Property '${key}' was ${postfix}`;
}

export default function plain(data, parentPath) {
  const result = data
    .flatMap((item) => {
      const fullPath = getFullPath(parentPath, item.key);

      switch (item.diff) {
        case DIFF.ADDED:
          return makeLine(fullPath, `added with value: ${formatValue(item.value)}`);
        case DIFF.REMOVED:
          return makeLine(fullPath, 'removed');
        case DIFF.NESTED:
          return plain(item.value, fullPath);
        case DIFF.CHANGED:
          return makeLine(fullPath, `updated. From ${formatValue(item.oldValue)} to ${formatValue(item.newValue)}`);
        case DIFF.UNCHANGED:
        default:
          return null;
      }
    })
    .filter(Boolean)
    .join('\n');

  return result;
}
