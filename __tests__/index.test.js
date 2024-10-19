import { genDiff } from '../src/gendiff';

test('genDiffJsonFlat', () => {
  expect(genDiff('file1-flat.json', 'file2-flat.json')).toEqual(
    '{\n  - follow: false\n    host: hexlet.io\n  - proxy: 123.234.53.22\n  - timeout: 50\n  + timeout: 20\n  + verbose: true\n}'
  );
});

test('genDiffYmlFlat', () => {
  expect(genDiff('file1-flat.yml', 'file2-flat.yml')).toEqual(
    '{\n  - follow: false\n    host: hexlet.io\n  - proxy: 123.234.53.22\n  - timeout: 50\n  + timeout: 20\n  + verbose: true\n}'
  );
});

const noFlatResult = `{
    common: {
      + follow: false
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: null
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
        setting6: {
            doge: {
              - wow: 
              + wow: so much
            }
            key: value
          + ops: vops
        }
    }
    group1: {
      - baz: bas
      + baz: bars
        foo: bar
      - nest: {
            key: value
        }
      + nest: str
    }
  - group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
  + group3: {
        deep: {
            id: {
                number: 45
            }
        }
        fee: 100500
    }
}`;

test('genDiffJson', () => {
  expect(genDiff('file1.json', 'file2.json')).toEqual(noFlatResult);
});

// test('genDiffYml', () => {
//   expect(genDiff('file1.yml', 'file2.yml')).toEqual(noFlatResult);
// });
