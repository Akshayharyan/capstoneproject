exports.evaluate = (code, rules = {}) => {
  const errors = [];

  rules.mustContain?.forEach((rule) => {
    if (!code.includes(rule)) {
      errors.push(`CSS must include "${rule}"`);
    }
  });

  rules.forbidden?.forEach((rule) => {
    if (code.includes(rule)) {
      errors.push(`"${rule}" is not allowed`);
    }
  });

  return {
    passed: errors.length === 0,
    errors,
  };
};
