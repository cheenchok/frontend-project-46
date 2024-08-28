import { program } from 'commander';
import path from 'path';
import fs from 'fs';

// console.log(process.cwd());
// console.log(path.resolve(process.cwd(), '/Users/mama.json'));

function getFormat(path) {
  const data = path.split('.');

  return data[data.length - 1];
}

function getDataFromFile(path) {
  const format = getFormat(path);
  const string = fs.readFileSync(path, 'utf8');
  if (format === 'json') {
    const data = JSON.parse(string);
    return data;
  }
  return string;
}

program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version('0.0.1')
  .option('-f, --format [type]', 'output format')
  .arguments('<filepath1> <filepath2>')
  .action((filepath1, filepath2) => {
    const data1 = getDataFromFile(filepath1);
    const data2 = getDataFromFile(filepath2);
    const mergeData = { ...data1, ...data2 };
    const keys = Object.keys(mergeData).sort();
    console.log('{');
    keys.forEach((key) => {
      if (key in data1) {
        if (key in data2) {
          if (data1[key] === data2[key]) {
            console.log(`    ${key}: ${data1[key]}`);
          } else {
            console.log(`  - ${key}: ${data1[key]}`);
            console.log(`  + ${key}: ${data2[key]}`);
          }
        } else {
          console.log(`  - ${key}: ${data1[key]}`);
        }
      } else if (key in data2) {
        console.log(`  + ${key}: ${data2[key]}`);
      }
    });
    console.log('}');
  });

program.parse(process.argv);
