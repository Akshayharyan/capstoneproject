// backend/seedModules.js
console.log(">>> RUNNING SEED FILE: seedModules.js");

const mongoose = require("mongoose");
const Module = require("./models/module");
require("dotenv").config();

const createQuizTask = (title, question, options, correctIndex, xp = 15) => ({
  type: "quiz",
  title,
  xp,
  content: {
    quiz: { question, options, correctIndex }
  }
});

const modules = [
    {
      title: "HTML Foundations",
      description: "Master the building blocks of accessible web pages.",
      topics: [
        {
          title: "Document Skeleton",
          videoUrl: "https://learn.skillquest.dev/html-structure",
          xp: 90,
          tasks: [
            createQuizTask(
              "Choose the root element",
              "Which HTML tag must wrap all other markup on the page?",
              ["<html>", "<head>", "<main>", "<body>"],
              0
            ),
            createQuizTask(
              "Head metadata",
              "Which element declares the document character encoding?",
              [
                "<meta charset=\"UTF-8\">",
                "<link rel=\"stylesheet\">",
                "<script>",
                "<title>"
              ],
              0
            )
          ]
        },
        {
          title: "Semantic Layout",
          videoUrl: "https://learn.skillquest.dev/html-semantic",
          xp: 90,
          tasks: [
            createQuizTask(
              "Article vs div",
              "Which element represents independent, self-contained content such as a blog post?",
              ["<article>", "<span>", "<b>", "<div>"],
              0
            ),
            createQuizTask(
              "Meaningful emphasis",
              "Which inline tag conveys emphasis to screen readers and browsers?",
              ["<em>", "<i>", "<b>", "<u>"],
              0
            )
          ]
        },
        {
          title: "Media & Links",
          videoUrl: "https://learn.skillquest.dev/html-media",
          xp: 90,
          tasks: [
            createQuizTask(
              "Image accessibility",
              "Which attribute is required so images convey meaning when they fail to load?",
              ["alt", "title", "data-role", "srcset"],
              0
            ),
            createQuizTask(
              "Safe external links",
              "When using target=\"_blank\", which rel value prevents tab-napping?",
              ["noopener", "nofollow", "external", "sponsored"],
              0
            )
          ]
        }
      ]
    },
    {
      title: "CSS Styling",
      description: "Control layout, spacing, and visual polish with modern CSS.",
      topics: [
        {
          title: "Selectors & Specificity",
          videoUrl: "https://learn.skillquest.dev/css-selectors",
          xp: 90,
          tasks: [
            createQuizTask(
              "Class vs ID",
              "Which selector targets an element with id hero inside any section?",
              ["section #hero", "#hero .section", "section.hero", "section > hero"],
              0
            ),
            createQuizTask(
              "Specificity math",
              "Which selector has the highest specificity score?",
              ["#promo .cta", ".card[data-state=\"active\"]", "main nav a", "header > h1"],
              0
            )
          ]
        },
        {
          title: "Layout Systems",
          videoUrl: "https://learn.skillquest.dev/css-layout",
          xp: 90,
          tasks: [
            createQuizTask(
              "Flex main axis",
              "In flexbox, which property distributes items along the main axis?",
              ["justify-content", "align-items", "flex-basis", "gap"],
              0
            ),
            createQuizTask(
              "Grid tracks",
              "Which declaration creates three equal CSS Grid columns?",
              [
                "grid-template-columns: repeat(3, 1fr)",
                "grid-columns: 3 auto",
                "columns: 3",
                "grid-template: 1fr 1fr 1fr"
              ],
              0
            )
          ]
        },
        {
          title: "Visual Design",
          videoUrl: "https://learn.skillquest.dev/css-visuals",
          xp: 90,
          tasks: [
            createQuizTask(
              "Layered shadows",
              "Which value slot inside box-shadow controls blur radius?",
              ["third", "first", "second", "fourth"],
              2
            ),
            createQuizTask(
              "Typeface fallbacks",
              "What is the best practice ordering for font-family values?",
              [
                "Primary, branded fallback, generic family",
                "Generic family, system, primary",
                "System, emoji, generic",
                "Random order"
              ],
              0
            )
          ]
        }
      ]
    },
    {
      title: "React Fundamentals",
      description: "Build interactive UI components with React and modern patterns.",
      topics: [
        {
          title: "JSX Essentials",
          videoUrl: "https://learn.skillquest.dev/react-jsx",
          xp: 100,
          tasks: [
            createQuizTask(
              "Adjacent elements",
              "How do you return multiple sibling elements from a component?",
              [
                "Wrap them in a parent element or <> fragment",
                "Use two return statements",
                "Separate them with commas",
                "Export them individually"
              ],
              0
            ),
            createQuizTask(
              "Expressions in JSX",
              "How do you inject a JavaScript value into JSX output?",
              ["Wrap it in {}", "Use double quotes", "Call eval()", "Place it in ()"],
              0
            )
          ]
        },
        {
          title: "Props & State",
          videoUrl: "https://learn.skillquest.dev/react-state",
          xp: 100,
          tasks: [
            createQuizTask(
              "Local updates",
              "Where should you store interactive data that changes inside a component?",
              ["State", "Props", "Context", "Static file"],
              0
            ),
            createQuizTask(
              "Passing data down",
              "How do parents send values to child components?",
              ["Via props", "Via setState", "Via DOM queries", "Via CSS"],
              0
            )
          ]
        },
        {
          title: "Hooks & Effects",
          videoUrl: "https://learn.skillquest.dev/react-hooks",
          xp: 100,
          tasks: [
            createQuizTask(
              "useEffect timing",
              "When does a useEffect callback run by default?",
              [
                "After the render commits to the DOM",
                "Before render",
                "Only once at build time",
                "Right before unmount"
              ],
              0
            ),
            createQuizTask(
              "Hook rules",
              "Where may custom hooks or built-in hooks be called?",
              [
                "Only at the top level of React function components",
                "Inside loops",
                "Inside conditions",
                "Inside any JS function"
              ],
              0
            )
          ]
        }
      ]
    },
    {
      title: "Node & Express APIs",
      description: "Design reliable backend services with Node.js and Express.",
      topics: [
        {
          title: "Runtime Basics",
          videoUrl: "https://learn.skillquest.dev/node-runtime",
          xp: 100,
          tasks: [
            createQuizTask(
              "Node definition",
              "Which statement best describes Node.js?",
              [
                "A JavaScript runtime built on Chrome's V8 engine",
                "A CSS preprocessor",
                "A JSON database",
                "A static site generator"
              ],
              0
            ),
            createQuizTask(
              "Export syntax",
              "How do you export a function using CommonJS modules?",
              [
                "module.exports = myFn",
                "export default myFn",
                "exports: myFn",
                "require(myFn)"
              ],
              0
            )
          ]
        },
        {
          title: "Routing & Middleware",
          videoUrl: "https://learn.skillquest.dev/express-routing",
          xp: 100,
          tasks: [
            createQuizTask(
              "JSON parsing",
              "What does app.use(express.json()) enable?",
              [
                "Automatic parsing of JSON request bodies",
                "Static file hosting",
                "HTTPS support",
                "Template rendering"
              ],
              0
            ),
            createQuizTask(
              "Route verbs",
              "Which HTTP verb is most appropriate for partially updating a resource?",
              ["PATCH", "GET", "PUT", "DELETE"],
              0
            )
          ]
        },
        {
          title: "Security Fundamentals",
          videoUrl: "https://learn.skillquest.dev/node-security",
          xp: 100,
          tasks: [
            createQuizTask(
              "Secrets handling",
              "Where should API keys or database passwords be stored?",
              ["Environment variables", "Hard-coded constants", "Client localStorage", "README files"],
              0
            ),
            createQuizTask(
              "Password storage",
              "What is the correct approach for storing user passwords?",
              [
                "Hash them with a slow hashing algorithm like bcrypt",
                "Encrypt with base64",
                "Store in plain text",
                "Hash once with MD5"
              ],
              0
            )
          ]
        }
      ]
    },
    {
      title: "Database & MongoDB",
      description: "Store and query application data with MongoDB collections.",
      topics: [
        {
          title: "Document Model",
          videoUrl: "https://learn.skillquest.dev/mongo-documents",
          xp: 90,
          tasks: [
            createQuizTask(
              "Collections vs tables",
              "What does a MongoDB collection most closely resemble in relational databases?",
              ["A table", "A column", "A foreign key", "An index"],
              0
            ),
            createQuizTask(
              "ObjectId nature",
              "What type of data is MongoDB's default _id field?",
              ["A 12-byte ObjectId", "An auto-incrementing integer", "A UUID string", "A random float"],
              0
            )
          ]
        },
        {
          title: "Query Operators",
          videoUrl: "https://learn.skillquest.dev/mongo-queries",
          xp: 90,
          tasks: [
            createQuizTask(
              "Matching ranges",
              "Which operator returns documents where score is greater than or equal to 80?",
              ["$gte", "$lte", "$in", "$regex"],
              0
            ),
            createQuizTask(
              "Projection",
              "How do you exclude the _id field from a find() result?",
              ["use .select('-_id')", "pass {_id: 0} to find", "it is automatic", "call dropId()"],
              1
            )
          ]
        },
        {
          title: "Aggregation",
          videoUrl: "https://learn.skillquest.dev/mongo-aggregation",
          xp: 90,
          tasks: [
            createQuizTask(
              "Pipeline stage order",
              "Which stage filters documents early in an aggregation pipeline?",
              ["$match", "$group", "$project", "$sort"],
              0
            ),
            createQuizTask(
              "Grouping",
              "Which accumulator calculates the total number of documents per group?",
              ["$sum: 1", "$avg", "$first", "$push"],
              0
            )
          ]
        }
      ]
    }
  ];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");

  const titlesToReplace = modules.map(m => m.title);
  await Module.deleteMany({ title: { $in: titlesToReplace } });

  await Module.insertMany(modules);
  console.log("Modules seeded!");

  process.exit(0);
}

seed();
