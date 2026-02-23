const vm = require("vm");

exports.runJS = async (code, testCases) => {
  try {
    const outputs = [];

    for (const tc of testCases) {

      const script = `
        ${code}
        solution(${tc.input})
      `;

      const result = vm.runInNewContext(script, {}, { timeout: 1000 });

      outputs.push(String(result));
    }

    return { output: outputs };

  } catch (err) {
    return { error: err.message };
  }
};