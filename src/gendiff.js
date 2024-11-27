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

const empty = {};

function getDiffWithEmpty(value) {
  return isObject(value) ? genDiffFromObj(value, empty, true) : value;
}

function genDiffFromObj(data1, data2, isNested = false) {
  return getSortedKeys(data1, data2)
    .map((key) => {
      if (!Object.hasOwn(data1, key))
        return makeDiffItem(
          key,
          getDiffWithEmpty(data2[key]),
          isNested ? DIFF_TYPES.NESTED : DIFF_TYPES.EXTRA
        );

      if (!Object.hasOwn(data2, key))
        return makeDiffItem(
          key,
          getDiffWithEmpty(data1[key]),
          isNested ? DIFF_TYPES.NESTED : DIFF_TYPES.ABSENT
        );

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
          getDiffWithEmpty(data1[key]),
          isNested ? DIFF_TYPES.NESTED : DIFF_TYPES.ABSENT
        ),
        makeDiffItem(
          key,
          getDiffWithEmpty(data2[key]),
          isNested ? DIFF_TYPES.NESTED : DIFF_TYPES.EXTRA
        ),
      ];
    })
    .flat();
}

console.log(genDiffFromObj({ mama: { s: 1 } }, { mama: { a: 2 } }));

export default function genDiff(filepath1, filepath2, formatType) {
  const data1 = getDataFromFile(filepath1);
  const data2 = getDataFromFile(filepath2);
  const diff = genDiffFromObj(data1, data2);

  return formatter(diff, formatType);
}
