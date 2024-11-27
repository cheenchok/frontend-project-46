import { DIFF_TYPES } from '../consts.js';
import { isObject } from '../utils.js';

const formatValue = (value) =>
  isObject(value) ? '[complex value]' : `${value}`;

const getFullPath = (parentPath, key) =>
  parentPath ? `${parentPath}.${key}` : key;

const makeLine = (key, postfix) => `Property '${key}' was ${postfix}`;

export function plain(data, parentPath, nested) {
  const result = data
    .map(({ diffType, key, value }, i) => {
      const prevItem = data[i - 1];
      const nextItem = data[i + 1];
      if (prevItem?.key === key) {
        return null;
      }

      switch (diffType) {
        case DIFF_TYPES.EXTRA:
          return makeLine(
            getFullPath(parentPath, key),
            `added with value: ${formatValue(value)}`
          );
        case DIFF_TYPES.ABSENT:
          return nextItem?.key === key
            ? makeLine(
                getFullPath(parentPath, key),
                `updated. From ${formatValue(value)} to ${formatValue(
                  nextItem.value
                )}`
              )
            : makeLine(getFullPath(parentPath, key), `removed`);
        case DIFF_TYPES.NESTED:
          return plain(value, getFullPath(parentPath, key), true);
        case DIFF_TYPES.EQUALITY:
        default:
          return null;
      }
    })
    .filter(Boolean)
    .flat();

  return nested ? result : result.join('\n');
}
