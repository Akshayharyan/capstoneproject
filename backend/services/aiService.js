const axios = require("axios");

/* ================= TRY CLOUD AI ================= */
async function tryOpenAI(prompt) {
  if (!process.env.AI_KEY) return null;

  try {
    const res = await axios.post(
      process.env.AI_URL,
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a software testing expert." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AI_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const text = res.data.choices[0].message.content;

    return parseTestCases(text);

  } catch (err) {
    console.log("☁ AI unavailable → using smart fallback");
    return null;
  }
}

/* ================= SMART OFFLINE GENERATOR ================= */
function smartGenerate(prompt) {

  // detect factorial
  if (prompt.toLowerCase().includes("factorial")) {
    return [
      { input: 1, expected: 1 },
      { input: 3, expected: 6 },
      { input: 5, expected: 120 },
      { input: 7, expected: 5040 },
    ];
  }

  // detect sum
  if (prompt.toLowerCase().includes("sum")) {
    return [
      { input: [1,2], expected: 3 },
      { input: [5,7], expected: 12 },
      { input: [10,20], expected: 30 }
    ];
  }

  // detect palindrome
  if (prompt.toLowerCase().includes("palindrome")) {
    return [
      { input: "madam", expected: true },
      { input: "racecar", expected: true },
      { input: "hello", expected: false }
    ];
  }

  // default safe tests
  return [
    { input: 2, expected: 4 },
    { input: 5, expected: 25 },
    { input: 10, expected: 100 }
  ];
}

/* ================= PARSER ================= */
function parseTestCases(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/* ================= MAIN ================= */
exports.generateTestCases = async (prompt) => {

  // 1️⃣ Try real AI
  const aiResult = await tryOpenAI(prompt);
  if (aiResult) return aiResult;

  // 2️⃣ Fallback smart generator
  return smartGenerate(prompt);
};