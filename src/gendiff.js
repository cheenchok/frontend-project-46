import { getDataFromFile } from './parsers.js';
import { isObject } from './utils.js';
import { DIFF_TYPES } from './consts.js';
import { formatter } from './formatters/index.js';

function getSortedKeys(...objList) {
  const merged = objList.reduce((acc, item) => Object.assign(acc, item), {});
  return Object.keys(merged).sort();
}

function makeDiffItem(key, value, diffType) {
  return {
    key,
    value,
    diffType,
  };
}

function genDiffFromObj(data1, data2, isNested = false) {
  const keys = getSortedKeys(data1, data2);

  return keys
    .map((key) => {
      if (key in data1 && key in data2) {
        if (data1[key] === data2[key])
          return makeDiffItem(key, data1[key], DIFF_TYPES.EQUALITY);

        if (isObject(data1[key]) && isObject(data2[key]))
          return makeDiffItem(
            key,
            genDiffFromObj(data1[key], data2[key], isNested),
            DIFF_TYPES.NESTED
          );

        return [
          makeDiffItem(
            key,
            isObject(data1[key])
              ? genDiffFromObj(data1[key], {}, true)
              : data1[key],
            isNested ? DIFF_TYPES.NESTED : DIFF_TYPES.ABSENT
          ),
          makeDiffItem(
            key,
            isObject(data2[key])
              ? genDiffFromObj(data2[key], {}, true)
              : data2[key],
            isNested ? DIFF_TYPES.NESTED : DIFF_TYPES.EXTRA
          ),
        ];
      }

      if (key in data1)
        return makeDiffItem(
          key,
          isObject(data1[key])
            ? genDiffFromObj(data1[key], {}, true)
            : data1[key],
          isNested ? DIFF_TYPES.NESTED : DIFF_TYPES.ABSENT
        );

      if (key in data2)
        return makeDiffItem(
          key,
          isObject(data2[key])
            ? genDiffFromObj(data2[key], {}, true)
            : data2[key],
          isNested ? DIFF_TYPES.NESTED : DIFF_TYPES.EXTRA
        );
    })
    .flat();
}

export default function genDiff(filepath1, filepath2, formatType) {
  const data1 = getDataFromFile(filepath1);
  const data2 = getDataFromFile(filepath2);
  const diff = genDiffFromObj(data1, data2);

  return formatter(diff, formatType);
}
