import fs from 'fs';
// eslint is not configured correctly in hexlet workflow, jest is not added to env
import { describe, expect, test } from '@jest/globals';
import genDiff from '../src/gendiff.js';

const pathPrefix = '__fixtures__/';

const file1JsonPath = `${pathPrefix}file1.json`;
const file1YmlPath = `${pathPrefix}file1.yml`;
const file2JsonPath = `${pathPrefix}file2.json`;
const file2YmlPath = `${pathPrefix}file2.yml`;
const resultPlain = fs.readFileSync(`${pathPrefix}result_plain.txt`, 'utf8');
const resultStylish = fs.readFileSync(`${pathPrefix}result_stylish.txt`, 'utf8');

describe('gendiff', () => {
  test('plain with yml', () => {
    expect(genDiff(file1YmlPath, file2YmlPath, 'plain')).toEqual(resultPlain);
  });

  test('plain with json', () => {
    expect(genDiff(file1JsonPath, file2JsonPath, 'plain')).toEqual(resultPlain);
  });

  test('stylish with yml', () => {
    expect(genDiff(file1YmlPath, file2YmlPath, 'stylish')).toEqual(resultStylish);
  });

  test('stylish with json', () => {
    expect(genDiff(file1JsonPath, file2JsonPath, 'stylish')).toEqual(resultStylish);
  });
});
