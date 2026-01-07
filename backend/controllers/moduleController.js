const Module = require("../models/module");
const Progress = require("../models/progress");


// ===============================
// 📌 CREATE NEW MODULE (Admin)
// ===============================
exports.createModule = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || title.trim() === "")
      return res.status(400).json({ message: "Module title is required" });

    const module = await Module.create({
      title,
      description: description || "",
      topics: [] // trainer will add topics + levels later
    });

    res.json({ success: true, message: "Module created", module });
  } catch (err) {
    console.error("Create module error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ===============================
// 📌 GET QUESTS OF MODULE (Existing)
// ===============================
exports.getModuleQuests = async (req, res) => {
  try {
    const userId = req.user._id;
    const { moduleId } = req.params;

    const module = await Module.findById(moduleId).lean();
    if (!module) return res.status(404).json({ message: "Module not found" });

    const progress = await Progress.findOne({ userId }).lean();

    const completedIds =
      progress?.completedQuests
        .filter((cq) => String(cq.moduleId) === String(moduleId))
        .map((cq) => String(cq.questId)) || [];

    const quests = module.quests
      .sort((a, b) => a.order - b.order)
      .map((q, index) => {
        const isCompleted = completedIds.includes(String(q._id));
        const isCurrent = index === completedIds.length;
        const isLocked = index > completedIds.length;

        return {
          id: q._id,
          title: q.title,
          xp: q.xp,
          order: q.order,
          status: isCompleted ? "Completed" : isCurrent ? "Current" : "Locked",
        };
      });

    res.json({
      moduleTitle: module.title,
      quests,
    });
  } catch (error) {
    console.error("Get module quests error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// ===============================
// 📌 GET TOPICS OF MODULE (EMPLOYEE)
// ===============================
exports.getModuleTopics = async (req, res) => {
  try {
    const { moduleId } = req.params;

    const module = await Module.findById(moduleId).lean();
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    res.json({
      moduleTitle: module.title,
      topics: module.topics.map((t, index) => ({
        index,
        title: t.title,
        videoUrl: t.videoUrl,   // ✅ CRITICAL
        videoDuration: t.videoDuration || "",
        xp: t.xp || 0,
        tasksCount: t.tasks?.length || 0
      }))
    });
  } catch (error) {
    console.error("Get module topics error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
