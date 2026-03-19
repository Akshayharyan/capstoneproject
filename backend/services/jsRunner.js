const vm = require("vm");

exports.runJS = async (code, testCases) => {
  try {
    console.log("====== JS RUNNER START ======");
    console.log("User Code:\n", code);
    console.log("Test Cases:", testCases);

    const outputs = [];

    for (const tc of testCases) {
      console.log("---- Running Test Case ----");
      console.log("Input:", tc.input);

      const wrappedScript = `
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

        ${code}

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

      console.log("Executing Script:\n", wrappedScript);

      const result = vm.runInNewContext(wrappedScript, {}, { timeout: 1000 });

      console.log("Raw Result:", result);

      outputs.push(String(result));
    }

    console.log("All Outputs:", outputs);
    console.log("====== JS RUNNER END ======");

    return { output: outputs };

  } catch (err) {
    console.log("❌ VM ERROR:", err.message);
    return { error: err.message };
  }
};