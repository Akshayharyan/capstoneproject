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

      const script = `
        ${code}
        solution(${tc.input})
      `;

      console.log("Executing Script:\n", script);

      const result = vm.runInNewContext(script, {}, { timeout: 1000 });

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