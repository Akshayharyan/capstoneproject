const graderSystem = require("../graders");

exports.runJS = async (code, testCases) => {
  try {
    console.log("====== JS RUNNER START (Using New Grader System) ======");
    console.log("User Code:\n", code);
    console.log("Test Cases:", testCases);

    // Use the new multi-language grader system
    const task = {
      language: "js",
      testCases: testCases,
      options: { timeout: 5000 }
    };

    const result = await graderSystem.executeCode(code, task);

    console.log("\n📊 TEST RESULTS:");
    console.log("Total:", result.total);
    console.log("Passed:", result.passed);
    console.log("Success:", result.success);
    console.log("\nDetailed Results:");
    result.results.forEach((r, idx) => {
      console.log(`  Test ${idx + 1}: Input=${r.input}, Expected=${r.expected}, Received=${r.received}, Status=${r.success ? '✅' : '❌'}`);
    });

    console.log("====== JS RUNNER END ======\n");

    // Format output to match old API for backward compatibility
    return {
      output: result.results.map(r => r.received),
      results: result.results,
      passed: result.passed,
      total: result.total,
      success: result.success
    };

  } catch (err) {
    console.log("❌ JS RUNNER ERROR:", err.message);
    console.log("Stack:", err.stack);
    return { error: err.message };
  }
};