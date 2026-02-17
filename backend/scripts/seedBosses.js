const mongoose = require("mongoose");
const Boss = require("../models/Boss");
require("dotenv").config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  await Boss.deleteMany();

  await Boss.insertMany([
    { name: "Shadow Wyrm", image: "/bosses/shadow-wyrm.png", hp: 1000, xpReward: 500, difficulty: "hard" },
    { name: "Flame Titan", image: "/bosses/flame-titan.png", hp: 700, xpReward: 350, difficulty: "medium" },
    { name: "Ice Queen", image: "/bosses/ice-queen.png", hp: 600, xpReward: 300, difficulty: "medium" },
    { name: "Stone Golem", image: "/bosses/stone-golem.png", hp: 450, xpReward: 200, difficulty: "easy" },
    { name: "Storm Lord", image: "/bosses/storm-lord.png", hp: 850, xpReward: 450, difficulty: "hard" }
  ]);

  console.log("🔥 Bosses seeded successfully");
  process.exit();
}

seed();
