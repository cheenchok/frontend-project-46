export const program = (callback) => {
  const muInput = process.argv[2];

  if (typeof callback === 'function') {
    callback(muInput);
  }
};
