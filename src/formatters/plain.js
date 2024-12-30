import DIFF from '../consts.js';
import isObject from '../utils.js';

const formatValue = (value) =>
  isObject(value) ? '[complex value]' : `${typeof value === 'string' ? `'${value}'` : value}`;

const getFullPath = (parentPath, key) => {
  return parentPath ? `${parentPath}.${key}` : key;
};

const makeLine = (key, postfix) => {
  return `Property '${key}' was ${postfix}`;
};

const plain = (data, parentPath) => {
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
};

export default plain;
