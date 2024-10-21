import { DIFF_TYPES } from '../consts.js';
import { isObject } from '../utils.js';

const formatValue = (value) => (isObject(value) ? '[complex value]' : value);

const getFullPath = (parentPath, key) =>
  parentPath ? `${parentPath}.${key}` : key;

const makeLine = (key, postfix) => `Property '${key}' was ${postfix}`;

export function plain(data, parentPath) {
  return data
    .map(({ diffType, key, value }, i) => {
      const prevKeyEqual = key === data[i - 1]?.key;
      const nextKeyEqual = key === data[i - 2]?.key;
      const isUpdated = prevKeyEqual || nextKeyEqual;

      if (isUpdated) {
        if (prevKeyEqual) return null;

        return makeLine(
          getFullPath(parentPath, key),
          `updated. From ${formatValue(value)} to ${formatValue(
            data[i - 2].value
          )}`
        );
      }

      switch (diffType) {
        case DIFF_TYPES.EXTRA:
          return makeLine(
            getFullPath(parentPath, key),
            `added with value: ${formatValue(value)}`
          );
        case DIFF_TYPES.ABSENT:
          return makeLine(getFullPath(parentPath, key), `removed`);
        case DIFF_TYPES.NESTED:
          return plain(value, getFullPath(parentPath, key));
        case DIFF_TYPES.EQUALITY:
        default:
          return null;
      }
    })
    .filter(Boolean)
    .flat();
}
