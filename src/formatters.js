export function stylish(param, level = 1) {
  let result = '{\n';
  param.forEach(({ key, value, prefix }) => {
    result += `${' '.repeat(level * 4 - 2)}${prefix || ' '} ${key}: ${
      value && typeof value === 'object' ? stylish(value, level + 1) : value
    }\n`;
  });
  result += `${' '.repeat((level - 1) * 4)}}`;
  return result;
}
