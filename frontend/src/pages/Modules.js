import React from "react";
import { useNavigate } from "react-router-dom";

// Modules data
const modules = [
  {
    id: 1,
    title: "HTML Basics",
    description: "Learn HTML fundamentals and build simple web pages.",
    difficulty: "Beginner",
    progress: 100,
    status: "Completed",
    quests: ["Introduction to HTML", "Forms & Inputs", "Links & Images"],
  },
  {
    id: 2,
    title: "CSS Styling",
    description: "Learn how to style web pages with CSS and layouts.",
    difficulty: "Intermediate",
    progress: 70,
    status: "In Progress",
    quests: ["Selectors & Properties", "Flexbox Layout", "Colors & Fonts"],
  },
  {
    id: 3,
    title: "JavaScript Essentials",
    description: "Understand basic JavaScript programming and DOM manipulation.",
    difficulty: "Intermediate",
    progress: 30,
    status: "In Progress",
    quests: ["Variables & Loops", "Functions", "DOM Manipulation"],
  },
];

const Modules = () => {
  const navigate = useNavigate();

  return React.createElement(
    "div",
    { className: "min-h-screen bg-gray-900 text-white px-8 py-10" },
    // Header
    React.createElement(
      "h1",
      { className: "text-3xl font-semibold mb-6 text-blue-400" },
      "Learning Modules"
    ),
    React.createElement(
      "p",
      { className: "mb-8 text-gray-300" },
      "Explore structured modules to enhance your technical skills. Complete modules to earn XP and unlock new challenges!"
    ),
    // Modules grid
    React.createElement(
      "div",
      { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" },
      modules.map((mod) =>
        React.createElement(
          "div",
          {
            key: mod.id,
            onClick: () => {
              if (mod.status !== "Locked") {
                navigate(`/modules/${mod.id}/quests`);
              }
            },
            className: `relative rounded-2xl p-6 shadow-lg transition-all duration-300 border transform cursor-pointer hover:scale-105 bg-gradient-to-r ${
              mod.status === "In Progress"
                ? "from-blue-500 to-indigo-600 border-blue-600"
                : mod.status === "Completed"
                ? "from-green-500 to-green-600 border-green-500"
                : "from-gray-700 to-gray-800 border-gray-700 opacity-70 cursor-not-allowed"
            }`,
          },
          // XP Badge
          React.createElement(
            "span",
            {
              className:
                "absolute top-4 right-4 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded-full shadow-md",
            },
            `★ ${mod.quests.length * 10} XP`
          ),
          // Module title
          React.createElement(
            "h2",
            { className: "text-xl font-semibold mb-2" },
            mod.title
          ),
          // Module description
          React.createElement(
            "p",
            { className: "text-gray-200 text-sm mb-4" },
            mod.description
          ),
          // Difficulty
          React.createElement(
            "p",
            { className: "text-sm mb-2" },
            "Difficulty: ",
            React.createElement(
              "span",
              { className: "text-yellow-400" },
              mod.difficulty
            )
          ),
          // Progress bar
          React.createElement(
            "div",
            { className: "w-full bg-gray-700 rounded-full h-2 mb-3" },
            React.createElement("div", {
              className: "bg-green-500 h-2 rounded-full",
              style: { width: `${mod.progress}%` },
            })
          ),
          // Quests list
          React.createElement(
            "ul",
            { className: "list-disc list-inside mb-3 text-gray-100" },
            mod.quests.map((quest, index) =>
              React.createElement(
                "li",
                { key: index, className: "hover:text-yellow-300 transition-colors" },
                quest
              )
            )
          ),
          // Status and button
          React.createElement(
            "div",
            { className: "flex justify-between items-center mt-2" },
            React.createElement(
              "span",
              { className: "text-sm text-gray-200" },
              mod.status
            ),
            React.createElement(
              "button",
              {
                className: `px-4 py-2 rounded-lg text-sm font-medium ${
                  mod.status === "In Progress"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : mod.status === "Completed"
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-gray-700 cursor-not-allowed text-gray-500"
                }`,
              },
              mod.status === "Completed"
                ? "Review"
                : mod.status === "In Progress"
                ? "Continue"
                : "Locked"
            )
          )
        )
      )
    )
  );
};

export default Modules;
