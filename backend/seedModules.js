// backend/seedModules.js
console.log(">>> RUNNING SEED FILE: seedModules.js");

const mongoose = require("mongoose");
const Module = require("./models/module");
require("dotenv").config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");

  await Module.deleteMany();

  const modules = [
 {
  title: "HTML Basics",
  description: "Learn HTML fundamentals.",
  xp: 120,
  quests: [
    { title: "Introduction to HTML", xp: 10, order: 1 },
    { title: "HTML Tags Deep Dive", xp: 10, order: 2 },
    { title: "Forms & Inputs", xp: 10, order: 3 },
    { title: "Lists & Tables", xp: 10, order: 4 },
    { title: "Links & Images", xp: 10, order: 5 },
    { title: "Semantic HTML", xp: 10, order: 6 },
    { title: "Audio & Video Embed", xp: 15, order: 7 },
    { title: "Iframes & Embedding", xp: 15, order: 8 },
    { title: "Accessibility Basics", xp: 15, order: 9 },
    {
      title: "💻 Final Coding Challenge — Build an HTML Portfolio",
      xp: 40,
      order: 10
    }
  ]
},

    {
      title: "CSS Styling",
      description: "Learn CSS styling and layouts.",
      xp: 30,
      quests: [
        { title: "Selectors & Properties", xp: 10, order: 1 },
        { title: "Flexbox Layout", xp: 10, order: 2 },
        { title: "Colors & Fonts", xp: 10, order: 3 },
      ]
    },
    {
      title: "JavaScript Essentials",
      description: "Master basic JavaScript concepts.",
      xp: 30,
      quests: [
        { title: "Variables & Loops", xp: 10, order: 1 },
        { title: "Functions", xp: 10, order: 2 },
        { title: "DOM Manipulation", xp: 10, order: 3 },
      ]
    }
  ];

  await Module.insertMany(modules);
  console.log("Modules seeded!");

  process.exit(0);
}

seed();
