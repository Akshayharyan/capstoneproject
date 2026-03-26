const { VM } = require("vm2");

function runInSandbox(userCode, testCases) {
  let passed = 0;
  const results = [];

  for (let tc of testCases) {
    try {
      // Initialize module object and other dependencies
      const moduleObj = { exports: {} };
      
      const vm = new VM({
        timeout: 5000,
        sandbox: {
          console: undefined, // Will be overridden in wrapped code
          module: moduleObj,
          exports: moduleObj.exports,
          Buffer: Buffer,
          input: tc.input,
          INPUT: tc.input,
          testInput: tc.input,
          setTimeout: undefined,
          setInterval: undefined
        }
      });

      const wrappedCode = `
        // Initialize module object at the start
        const module = { exports: {} };
        const exports = module.exports;
        
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

        const userInput = ${JSON.stringify(tc.input)};

        try {
          ${userCode}
        } catch (e) {
          throw new Error("User code error: " + e.message);
        }

        if (typeof solution === "function") {
          __result = solution(userInput);
        } else if (typeof module !== "undefined" && typeof module.exports === "function") {
          __result = module.exports(userInput);
        } else if (typeof module !== "undefined" && module.exports && typeof module.exports === "object") {
          if (typeof module.exports.solution === "function") {
            __result = module.exports.solution(userInput);
          } else if (typeof module.exports.solve === "function") {
            __result = module.exports.solve(userInput);
          }
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
