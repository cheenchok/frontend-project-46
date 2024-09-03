import { getDataFromFile } from './parsers.js';

function getDiffRow(prefix, key, value) {
  return `\n  ${prefix} ${key}: ${value}`;
}

export function genDiff(filepath1, filepath2) {
  const data1 = getDataFromFile(filepath1);
  const data2 = getDataFromFile(filepath2);
  const mergeData = { ...data1, ...data2 };
  const keys = Object.keys(mergeData).sort();

  let result = '';
  result += '{';

  keys.forEach((key) => {
    if (key in data1) {
      if (key in data2) {
        if (data1[key] === data2[key]) {
          result += getDiffRow(' ', key, data1[key]);
        } else {
          result += getDiffRow('-', key, data1[key]);
          result += getDiffRow('+', key, data2[key]);
        }
      } else {
        result += getDiffRow('-', key, data1[key]);
      }
    } else if (key in data2) {
      result += getDiffRow('+', key, data2[key]);
    }
  });
  result += '\n}';

  return result;
}
