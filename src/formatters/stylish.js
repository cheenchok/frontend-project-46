import { DIFF_TYPES } from '../consts.js';

const LINE_PREFIX_FROM_DIFF_TYPE = {
  [DIFF_TYPES.NESTED]: '',
  [DIFF_TYPES.EQUALITY]: '',
  [DIFF_TYPES.ABSENT]: '-',
  [DIFF_TYPES.EXTRA]: '+',
};

const SPACES_COUNT = 4;
const SPECES_COUNT_WITH_PREFIX = 2;

export function stylish(data, level = 1) {
  let result = '{\n';

  data.forEach(({ key, value, diffType }) => {
    result += `${' '.repeat(level * SPACES_COUNT - SPECES_COUNT_WITH_PREFIX)}${
      LINE_PREFIX_FROM_DIFF_TYPE[diffType]
    } ${key}: ${
      value && typeof value === 'object' ? stylish(value, level + 1) : value
    }\n`;
  });

  result += `${' '.repeat((level - 1) * SPACES_COUNT)}}`;
  return result;
}
