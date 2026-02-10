const Module = require("../models/module");


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
      status: "active",
      topics: []
    });

    res.json({ success: true, message: "Module created", module });
  } catch (err) {
    console.error("Create module error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ===============================
// 📌 GET SINGLE MODULE (Admin Edit)
// ===============================
exports.getSingleModule = async (req, res) => {
  try {
    const module = await Module.findById(req.params.moduleId);

    if (!module)
      return res.status(404).json({ message: "Module not found" });

    res.json({
      _id: module._id,
      title: module.title,
      description: module.description,
      status: module.status || "active"
    });
  } catch (err) {
    console.error("Fetch single module error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ===============================
// 📌 UPDATE MODULE (Admin)
// ===============================
exports.updateModule = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    const module = await Module.findById(req.params.moduleId);
    if (!module)
      return res.status(404).json({ message: "Module not found" });

    if (title) module.title = title;
    if (description !== undefined) module.description = description;
    if (status) module.status = status;

    await module.save();

    res.json({ success: true, message: "Module updated", module });
  } catch (err) {
    console.error("Update module error:", err);
    res.status(500).json({ message: "Server error" });
  }
};