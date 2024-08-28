import { genDiff } from '../src/gendiff';

const data1 = {
  host: 'hexlet.io',
  timeout: 50,
  proxy: '123.234.53.22',
  follow: false,
};

const data2 = {
  timeout: 20,
  verbose: true,
  host: 'hexlet.io',
};

test('genDiff', () => {
  expect(genDiff(data1, data2)).toEqual(
    '{\n  - follow: false\n    host: hexlet.io\n  - proxy: 123.234.53.22\n  - timeout: 50\n  + timeout: 20\n  + verbose: true\n}'
  );
});
