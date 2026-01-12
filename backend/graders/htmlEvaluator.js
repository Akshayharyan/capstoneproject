const cheerio = require("cheerio");

exports.evaluate = (code, rules = {}) => {
  const errors = [];
  const $ = cheerio.load(code || "");

  /* ================= REQUIRED TAGS ================= */
  if (rules.requiredTags) {
    for (const tag of rules.requiredTags) {
      if ($(tag).length === 0) {
        errors.push(`Missing <${tag}> tag`);
      }
    }
  }

  /* ================= REQUIRED TEXT ================= */
  if (rules.textIncludes) {
    const text = $.text().toLowerCase();
    for (const word of rules.textIncludes) {
      if (!text.includes(word.toLowerCase())) {
        errors.push(`Text must include "${word}"`);
      }
    }
  }

  /* ================= FORBIDDEN TAGS ================= */
  if (rules.forbiddenTags) {
    for (const tag of rules.forbiddenTags) {
      if ($(tag).length > 0) {
        errors.push(`<${tag}> tag is not allowed`);
      }
    }
  }

  return {
    passed: errors.length === 0,
    errors,
  };
};
