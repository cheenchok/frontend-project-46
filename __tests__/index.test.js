import fs from 'fs';
import genDiff from '../src/gendiff.js';

const makeFileNames = (format, isFlat) =>
  Array.from(
    Array(2),
    (_, i) =>
      `__fixtures__/${isFlat ? 'flat' : 'nested'}-file${i + 1}.${format}`
  );

describe('gendiff', () => {
  const result = {
    flat: {
      stylish:
        '{\n  - follow: false\n    host: hexlet.io\n  - proxy: 123.234.53.22\n  - timeout: 50\n  + timeout: 20\n  + verbose: true\n}',
      plain:
        "Property 'follow' was removed\nProperty 'proxy' was removed\nProperty 'timeout' was updated. From 50 to 20\nProperty 'verbose' was added with value: true",
      json: fs.readFileSync('__fixtures__/diff/flat-json', 'utf8'),
    },
    nested: {
      stylish: fs.readFileSync('__fixtures__/diff/nested-stylish', 'utf8'),
      plain: fs.readFileSync('__fixtures__/diff/nested-plain', 'utf8'),
      json: fs.readFileSync('__fixtures__/diff/nested-json', 'utf8'),
    },
  };

  ['stylish', 'plain', 'json']
    .flatMap((formatter) => [
      { formatter, isFlat: false },
      { formatter, isFlat: true },
    ])
    .flatMap((item) => [
      { ...item, format: 'json' },
      { ...item, format: 'yml' },
    ])
    .forEach(({ formatter, format, isFlat }) =>
      test(`${formatter} formatter for ${
        isFlat ? 'flat' : 'nested'
      } ${format}`, () => {
        expect(genDiff(...makeFileNames(format, isFlat), formatter)).toEqual(
          result[isFlat ? 'flat' : 'nested'][formatter]
        );
      })
    );
});
