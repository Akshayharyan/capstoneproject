const { VM } = require("vm2");

function runInSandbox(userCode, testCases) {
  const vm = new VM({
    timeout: 1000,
    sandbox: {}
  });

  let passed = 0;
  const results = [];

  for (let tc of testCases) {
    try {
      const wrappedCode = `
  ${userCode}
  solution(${JSON.stringify(tc.input)})
`;

const output = vm.run(wrappedCode);


      const success =
        String(output).trim() === String(tc.output).trim();

      if (success) passed++;

      results.push({
        input: tc.input,
        expected: tc.output,
        received: output,
        success
      });

    } catch (err) {
      results.push({
        input: tc.input,
        error: err.message,
        success: false
      });
    }
  }

  return {
    total: testCases.length,
    passed,
    success: passed === testCases.length,
    results
  };
}

module.exports = runInSandbox;
