const vm = require("vm");

exports.runJavaScript = async (code, testCases) => {
  const results = [];

  for (let tc of testCases) {
    try {
      const script = new vm.Script(`
        ${code}
        solution(${tc.input})
      `);

      const output = script.runInNewContext({}, { timeout: 1000 });

      results.push({
        input: tc.input,
        expected: tc.output,
        actual: output,
        pass: String(output) === String(tc.output),
      });

    } catch (err) {
      return { error: "Runtime error" };
    }
  }

  return results;
};