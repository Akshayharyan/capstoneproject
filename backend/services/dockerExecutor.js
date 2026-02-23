const vm = require("vm");

exports.runJS = async (code, testCases) => {
  const outputs = [];

  try {
    for (const tc of testCases) {
      const context = {
        input: tc.input,
        result: null,
      };

      const wrapped = `
        ${code}
        result = solution(${JSON.stringify(tc.input)});
      `;

      vm.createContext(context);
      vm.runInContext(wrapped, context, { timeout: 1000 });

      outputs.push(String(context.result));
    }

    return { output: outputs };

  } catch (err) {
    return { error: err.message };
  }
};