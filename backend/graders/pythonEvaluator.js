exports.evaluate = (code, rules = {}) => {
  const errors = [];

  rules.requiredFunctions?.forEach((fn) => {
    if (!code.includes(`def ${fn}`)) {
      errors.push(`Function "${fn}" is required`);
    }
  });

  rules.forbidden?.forEach((word) => {
    if (code.includes(word)) {
      errors.push(`"${word}" is not allowed`);
    }
  });

  return {
    passed: errors.length === 0,
    errors,
  };
};
