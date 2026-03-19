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
        let __result;
        let __consoleHistory = [];
        const console = {
          log: (...args) => {
            const msg = args.map(arg =>
              typeof arg === "string" ? arg : JSON.stringify(arg)
            ).join(" ");
            __consoleHistory.push(args.length === 1 ? args[0] : msg);
            return msg;
          },
          error: (...args) => console.log(...args),
          warn: (...args) => console.log(...args)
        };

        const input = ${JSON.stringify(tc.input)};
        const INPUT = input;

        ${userCode}

        if (typeof solution === "function") {
          __result = solution(input);
        } else if (typeof module !== "undefined" && typeof module.exports === "function") {
          __result = module.exports(input);
        }

        if (typeof __result === "undefined" && typeof result !== "undefined") {
          __result = result;
        }

        if (typeof __result === "undefined" && __consoleHistory.length) {
          __result = __consoleHistory[__consoleHistory.length - 1];
        }

        __result;
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
