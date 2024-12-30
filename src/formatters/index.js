import plain from './plain.js';
import stylish from './stylish.js';

const formatter = (data, type) => {
  switch (type) {
    case 'plain': {
      return plain(data);
    }
    case 'json': {
      return JSON.stringify(data, null, 2);
    }
    case 'stylish':
    default: {
      return stylish(data);
    }
  }
};

export default formatter;
