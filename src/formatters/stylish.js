import DIFF from '../consts.js';
import isObject from '../utils.js';

const SPACES_COUNT = 4;

const getSpaces = (level) => {
  return ' '.repeat(level * SPACES_COUNT);
};

const customStringify = (obj, level) => {
  return `{\n${Object.entries(obj)
    .map(
      ([key, value]) => `${getSpaces(level + 1)}${key}: ${isObject(value) ? customStringify(value, level + 1) : value}`,
    )
    .join('\n')}\n${getSpaces(level)}}`;
};

const makeLine = (key, value, level, prefix) => {
  return `${getSpaces(level - 1)}  ${prefix || ' '} ${key}: ${
    isObject(value) ? customStringify(value, level) : value
  }\n`;
};

const stylish = (data, level = 1) => {
  return `${data.reduce((str, item) => {
    switch (item.diff) {
      case DIFF.ADDED:
        return `${str}${makeLine(item.key, item.value, level, '+')}`;
      case DIFF.REMOVED:
        return `${str}${makeLine(item.key, item.value, level, '-')}`;
      case DIFF.NESTED:
        return `${str}${makeLine(item.key, stylish(item.value, level + 1), level)}`;
      case DIFF.CHANGED:
        return `${str}${makeLine(item.key, item.oldValue, level, '-')}${makeLine(item.key, item.newValue, level, '+')}`;
      case DIFF.UNCHANGED:
      default:
        return `${str}${makeLine(item.key, item.value, level)}`;
    }
  }, '{\n')}${getSpaces(level - 1)}}`;
};

export default stylish;
