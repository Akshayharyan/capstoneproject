const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
  generateCertificate,
  listCertificates,
  downloadCertificate,
  getCertificateByCode
} = require("../controllers/certificateController");

router.post("/generate", protect, generateCertificate);
router.get("/mine", protect, listCertificates);
router.get("/download/:certificateId", protect, downloadCertificate);
router.get("/verify/:certificateId", getCertificateByCode);

module.exports = router;
