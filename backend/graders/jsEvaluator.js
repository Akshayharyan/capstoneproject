exports.evaluate = (code, rules = {}) => {
  const errors = [];

  rules.mustUse?.forEach((keyword) => {
    if (!code.includes(keyword)) {
      errors.push(`Must use "${keyword}"`);
    }
  });

  rules.forbidden?.forEach((keyword) => {
    if (code.includes(keyword)) {
      errors.push(`"${keyword}" is not allowed`);
    }
  });

  return {
    passed: errors.length === 0,
    errors,
  };
};
