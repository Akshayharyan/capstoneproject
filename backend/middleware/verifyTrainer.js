const verifyTrainer = (req, res, next) => {
  try {
    // user is attached by authMiddleware
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access"
      });
    }

    if (req.user.role !== "trainer") {
      return res.status(403).json({
        success: false,
        message: "Trainer access only"
      });
    }

    next();
  } catch (error) {
    console.error("verifyTrainer error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

module.exports = verifyTrainer;