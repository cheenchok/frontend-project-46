import { genDiff } from '../src/gendiff';

test('genDiffJson', () => {
  expect(genDiff('file1.json', 'file2.json')).toEqual(
    '{\n  - follow: false\n    host: hexlet.io\n  - proxy: 123.234.53.22\n  - timeout: 50\n  + timeout: 20\n  + verbose: true\n}'
  );
});

test('genDiffYml', () => {
  expect(genDiff('file1.yml', 'file2.yml')).toEqual(
    '{\n  - follow: false\n    host: hexlet.io\n  - proxy: 123.234.53.22\n  - timeout: 50\n  + timeout: 20\n  + verbose: true\n}'
  );
});
