import { program } from 'commander';
import { genDiff } from './src/gendiff.js';

// console.log(process.cwd());
// console.log(path.resolve(process.cwd(), '/Users/mama.json'));

program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version('0.0.1')
  .option('-f, --format [type]', 'output format')
  .arguments('<filepath1> <filepath2>')
  .action((filepath1, filepath2, options) => {
    console.log(genDiff(filepath1, filepath2, options.format));
  });

program.parse();
