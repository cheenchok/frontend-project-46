import DIFF_TYPES from '../consts.js';
import { isObject } from '../utils.js';

function formatValue(value) {
  return isObject(value)
    ? '[complex value]'
    : `${typeof value === 'string' ? `'${value}'` : value}`;
}

function getFullPath(parentPath, key) {
  return parentPath ? `${parentPath}.${key}` : key;
}

const makeLine = (key, postfix) => `Property '${key}' was ${postfix}`;

export default function plain(data, parentPath, nested) {
  function mapper({ diffType, key, value }, i) {
    const fullPath = getFullPath(parentPath, key);

    const prevItem = data[i - 1];
    const nextItem = data[i + 1];
    if (prevItem?.key === key) {
      return null;
    }

    switch (diffType) {
      case DIFF_TYPES.EXTRA: {
        return makeLine(fullPath, `added with value: ${formatValue(value)}`);
      }
      case DIFF_TYPES.ABSENT: {
        return nextItem?.key === key
          ? makeLine(
              fullPath,
              `updated. From ${formatValue(value)} to ${formatValue(
                nextItem.value,
              )}`,
            )
          : makeLine(fullPath, `removed`);
      }
      case DIFF_TYPES.NESTED: {
        return plain(value, fullPath, true);
      }
      case DIFF_TYPES.EQUALITY:
      default: {
        return null;
      }
    }
  }

  const result = data.map(mapper).filter(Boolean).flat();

  return nested ? result : result.join('\n');
}
