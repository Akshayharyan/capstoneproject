const mongoose = require("mongoose");
const Module = require("./models/module");
require("dotenv").config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");

  await Module.deleteMany({ title: "HTML" });

  const htmlModule = {
    title: "HTML",
    description: "Learn HTML step-by-step through levels and challenges.",
    topics: [
      {
        title: "Introduction to HTML",
        levels: [
          { number: 1, title: "What is HTML?", taskType: "quiz" },
          { number: 2, title: "Tags & Attributes", taskType: "quiz" },
          { number: 3, title: "Basic Structure", taskType: "coding" },
          { number: 4, title: "Mini Website Build", taskType: "quiz" },
        ],
      },
      {
        title: "Text & Page Structure",
        levels: [
          { number: 1, title: "Headings & Paragraphs", taskType: "quiz" },
          { number: 2, title: "Lists", taskType: "quiz" },
          { number: 3, title: "Tables", taskType: "quiz" },
          { number: 4, title: "Article Page Challenge", taskType: "coding" },
        ],
      },
      {
        title: "Multimedia & Links",
        levels: [
          { number: 1, title: "Images", taskType: "quiz" },
          { number: 2, title: "Videos", taskType: "quiz" },
          { number: 3, title: "Navigation Links", taskType: "coding" },
          { number: 4, title: "Portfolio Section", taskType: "quiz" },
        ],
      },
      {
        title: "Forms & Inputs",
        levels: [
          { number: 1, title: "Input Types", taskType: "quiz" },
          { number: 2, title: "Select & Textarea", taskType: "coding" },
          { number: 3, title: "Labels", taskType: "quiz" },
          { number: 4, title: "Registration Form", taskType: "coding" },
        ],
      },
      {
        title: "Semantic HTML",
        levels: [
          { number: 1, title: "Semantic Tags", taskType: "quiz" },
          { number: 2, title: "Page Layout", taskType: "quiz" },
          { number: 3, title: "Accessibility", taskType: "quiz" },
          { number: 4, title: "Landing Page Final Challenge", taskType: "coding" },
        ],
      },
    ],
  };

  await Module.create(htmlModule);
  console.log("HTML Module Seeded Successfully!");
  process.exit(0);
}

seed();
