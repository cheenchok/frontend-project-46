import yaml from 'js-yaml';

const parser = ({ file, format }) => {
  switch (format) {
    case 'json': {
      const data = JSON.parse(file);
      return data;
    }
    case 'yml':
    case 'yaml': {
      const data = yaml.load(file);
      return data;
    }
    default:
      return file;
  }
};

export default parser;
