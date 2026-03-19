const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");

const Certificate = require("../models/Certificate");
const Module = require("../models/module");
const User = require("../models/User");

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date);

const buildCertificateId = () => `SQ-${uuidv4().split("-")[0].toUpperCase()}-${Date.now().toString().slice(-4)}`;

const getTotalModuleXp = (moduleDoc) =>
  moduleDoc?.topics?.reduce((sum, topic) => sum + (topic?.xp || 0), 0) || 0;

exports.generateCertificate = async (req, res) => {
  try {
    const userId = req.user._id;
    const { moduleId } = req.body;

    if (!moduleId) {
      return res.status(400).json({ success: false, message: "moduleId is required" });
    }

    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ success: false, message: "Module not found" });
    }

    let certificate = await Certificate.findOne({ userId, moduleId });
    if (certificate) {
      return res.json({ success: true, certificate });
    }

    const earnedXp = getTotalModuleXp(module);

    certificate = await Certificate.create({
      userId,
      moduleId,
      moduleTitle: module.title,
      certificateId: buildCertificateId(),
      earnedXp
    });

    res.json({ success: true, certificate });
  } catch (err) {
    console.error("Certificate generation failed", err);
    res.status(500).json({ success: false, message: "Unable to generate certificate" });
  }
};

exports.listCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, certificates });
  } catch (err) {
    console.error("Load certificates failed", err);
    res.status(500).json({ success: false, message: "Unable to load certificates" });
  }
};

exports.getCertificateByCode = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const certificate = await Certificate.findOne({ certificateId })
      .populate("userId", "name email")
      .populate("moduleId", "title")
      .lean();

    if (!certificate) {
      return res.status(404).json({ success: false, message: "Certificate not found" });
    }

    res.json({ success: true, certificate });
  } catch (err) {
    console.error("Verify certificate failed", err);
    res.status(500).json({ success: false, message: "Unable to verify certificate" });
  }
};

exports.downloadCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const certificate = await Certificate.findOne({ certificateId })
      .populate("userId", "name email")
      .populate("moduleId", "title")
      .lean();

    if (!certificate) {
      return res.status(404).json({ success: false, message: "Certificate not found" });
    }

    await streamCertificatePdf({
      certificate,
      user: certificate.userId,
      module: certificate.moduleId || { title: certificate.moduleTitle }
    }, res);
  } catch (err) {
    console.error("Download certificate failed", err);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Unable to download certificate" });
    }
  }
};

async function streamCertificatePdf({ certificate, user, module }, res) {
  const doc = new PDFDocument({ size: "A4", margin: 0 });
  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  const inset = 42;
  const innerWidth = pageWidth - inset * 2;

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${certificate.certificateId}.pdf`
  );

  doc.pipe(res);

  // Background + frame
  doc.rect(0, 0, pageWidth, pageHeight).fill("#fafdff");
  doc.rect(inset, inset, innerWidth, pageHeight - inset * 2)
    .lineWidth(3)
    .stroke("#111c44");

  // Vertical ribbon accent
  const ribbonGradient = doc.linearGradient(inset - 8, inset, inset - 8, pageHeight - inset);
  ribbonGradient.stop(0, "#fde047").stop(1, "#f97316");
  doc.rect(inset - 20, inset - 10, 12, pageHeight - inset * 1.2).fill(ribbonGradient);

  // Top & bottom accent bars
  doc.moveTo(70, 90).lineTo(pageWidth - 70, 90).lineWidth(10).stroke("#0f172a");
  doc.moveTo(160, 90).lineTo(240, 90).lineWidth(6).stroke("#fbbf24");
  doc.moveTo(pageWidth - 160, 90).lineTo(pageWidth - 240, 90).lineWidth(6).stroke("#fbbf24");
  doc.moveTo(70, pageHeight - 80).lineTo(pageWidth - 70, pageHeight - 80).lineWidth(10).stroke("#0f172a");

  // Watermark
  doc.save();
  doc.rotate(-18, { origin: [pageWidth / 2, pageHeight / 2] });
  doc.opacity(0.04);
  doc.font("Helvetica-Bold").fontSize(150).fillColor("#1c2a5c");
  doc.text("SKILLQUEST", pageWidth / 2 - 340, pageHeight / 2 - 80, {
    width: 680,
    align: "center"
  });
  doc.restore();
  doc.opacity(1);

  const textStart = inset + 20;
  const headerWidth = innerWidth - 40;

  doc.font("Helvetica-Bold")
    .fontSize(11)
    .fillColor("#0f172a")
    .text("SKILLQUEST - CERTIFIED TRAINING PLATFORM", textStart, 120, {
      align: "center",
      width: headerWidth
    });

  doc.font("Times-Bold")
    .fontSize(46)
    .fillColor("#0f172a")
    .text("CERTIFICATE", textStart, 150, {
      align: "center",
      width: headerWidth
    });

  doc.font("Helvetica")
    .fontSize(16)
    .fillColor("#1d4ed8")
    .text("OF COMPLETION", textStart, 194, { align: "center", width: headerWidth });

  doc.font("Helvetica")
    .fontSize(12)
    .fillColor("#6b7280")
    .text("Awarded to", textStart, 235, { align: "center", width: headerWidth });

  doc.font("Times-Bold")
    .fontSize(32)
    .fillColor("#0f172a")
    .text(user.name || "Valiant Employee", textStart, 256, {
      align: "center",
      width: headerWidth
    });

  const description = `has successfully completed the official training module "${module.title}" and conquered the SkillQuest boss challenge with excellence.`;
  doc.font("Helvetica")
    .fontSize(12)
    .fillColor("#4b5563")
    .text(description, textStart + 40, 300, {
      align: "center",
      width: headerWidth - 80
    });

  doc.font("Helvetica-Bold")
    .fontSize(13)
    .fillColor("#0f172a")
    .text("Training Module", textStart, 360, { align: "center", width: headerWidth });
  doc.font("Times-Bold")
    .fontSize(20)
    .fillColor("#1c2a5c")
    .text(module.title || "Module", textStart, 382, {
      align: "center",
      width: headerWidth
    });

  const statusY = 430;
  const statusBoxes = [
    { label: "Certificate", value: "Verified" },
    { label: "Track", value: "Employee Training" },
    { label: "Status", value: "Completed" }
  ];
  const cardWidth = 165;
  const cardGap = 26;
  const totalCardWidth = statusBoxes.length * cardWidth + (statusBoxes.length - 1) * cardGap;
  const startX = textStart + (headerWidth - totalCardWidth) / 2;

  statusBoxes.forEach((box, idx) => {
    const x = startX + idx * (cardWidth + cardGap);
    doc.save();
    const gradient = doc.linearGradient(x, statusY, x, statusY + 72);
    gradient.stop(0, "#ffffff").stop(1, "#e7ecff");
    doc.roundedRect(x, statusY, cardWidth, 72, 16).fill(gradient);
    doc.roundedRect(x, statusY, cardWidth, 72, 16)
      .lineWidth(1.6)
      .stroke("#c3cbff");
    doc.font("Helvetica")
      .fontSize(10)
      .fillColor("#6b7280")
      .text(box.label.toUpperCase(), x + 18, statusY + 14);
    doc.font("Helvetica-Bold")
      .fontSize(15)
      .fillColor("#0f172a")
      .text(box.value, x + 18, statusY + 36);
    doc.restore();
  });

  const qrCardWidth = 165;
  const qrCardGap = 24;
  const infoPanelWidth = headerWidth - qrCardWidth - qrCardGap - 60;
  const infoPanelX = textStart + 30;
  const infoPanelY = statusY + 115;
  const infoPanelHeight = 150;
  const qrCardX = infoPanelX + infoPanelWidth + qrCardGap;
  const qrCardY = infoPanelY;
  const qrCardHeight = infoPanelHeight;
  const infoPanelBottom = infoPanelY + infoPanelHeight;

  const infoGradient = doc.linearGradient(infoPanelX, infoPanelY, infoPanelX, infoPanelY + infoPanelHeight);
  infoGradient.stop(0, "#ffffff").stop(1, "#eef2ff");
  doc.roundedRect(infoPanelX, infoPanelY, infoPanelWidth, infoPanelHeight, 24).fill(infoGradient);
  doc.roundedRect(infoPanelX, infoPanelY, infoPanelWidth, infoPanelHeight, 24)
    .lineWidth(1.1)
    .stroke("#c9d4fb");

  const columnWidth = (infoPanelWidth - 80) / 2;
  const columnY = infoPanelY + 26;

  const drawColumn = (label, value, index) => {
    const columnX = infoPanelX + 40 + index * columnWidth;
    doc.font("Helvetica")
      .fontSize(9.5)
      .fillColor("#6b7280")
      .text(label.toUpperCase(), columnX, columnY);
    doc.font("Helvetica-Bold")
      .fontSize(16.5)
      .fillColor("#0f172a")
      .text(value, columnX, columnY + 16, {
        width: columnWidth - 20,
        lineGap: 1
      });
  };

  drawColumn("XP Earned", `${certificate.earnedXp} XP`, 0);
  drawColumn("Issued On", formatDate(certificate.issuedAt), 1);

  doc.moveTo(infoPanelX + 32, columnY + 60)
    .lineTo(infoPanelX + infoPanelWidth - 32, columnY + 60)
    .lineWidth(0.7)
    .stroke("#dce3fb");

  doc.font("Helvetica")
    .fontSize(9.5)
    .fillColor("#6b7280")
    .text("Certificate ID", infoPanelX + 40, columnY + 70);
  doc.font("Helvetica-Bold")
    .fontSize(14)
    .fillColor("#1d4ed8")
    .text(certificate.certificateId, infoPanelX + 40, columnY + 86, {
      width: infoPanelWidth - 110
    });

  doc.font("Helvetica")
    .fontSize(9.5)
    .fillColor("#6b7280")
    .text("Authorized Training Team", infoPanelX + 40, columnY + 110, {
      width: infoPanelWidth - 80
    });
  doc.font("Times-Bold")
    .fontSize(13)
    .fillColor("#0f172a")
    .text("SkillQuest Academy", infoPanelX + 40, columnY + 126, {
      width: infoPanelWidth - 80
    });

  doc.roundedRect(qrCardX, qrCardY, qrCardWidth, qrCardHeight, 22)
    .fillAndStroke("#ffffff", "#cdd5fa");
  doc.font("Helvetica")
    .fontSize(10)
    .fillColor("#0f172a")
    .text("Verification", qrCardX + 24, qrCardY + 18);
  doc.font("Helvetica")
    .fontSize(9)
    .fillColor("#64748b")
    .text("Scan QR to confirm", qrCardX + 24, qrCardY + 32);

  const signatureY = Math.max(pageHeight - 210, infoPanelBottom + 60);
  doc.moveTo(inset + 80, signatureY)
    .lineTo(inset + 320, signatureY)
    .lineWidth(3)
    .stroke("#fbbf24");

  doc.font("Times-Bold")
    .fontSize(16)
    .fillColor("#0f172a")
    .text("SkillQuest Academy", inset + 60, signatureY + 10, {
      width: 300,
      align: "center"
    });
  doc.font("Helvetica")
    .fontSize(11)
    .fillColor("#475569")
    .text("Authorized Training Team", inset + 60, signatureY + 30, {
      width: 300,
      align: "center"
    });

  // Premium seal near signature
  const sealCenterX = inset + 190;
  const sealCenterY = signatureY - 35;
  doc.save();
  doc.circle(sealCenterX, sealCenterY, 38)
    .lineWidth(5)
    .stroke("#fbbf24");
  doc.circle(sealCenterX, sealCenterY, 30)
    .lineWidth(2)
    .stroke("#fde68a");
  const sealGradient = doc.linearGradient(sealCenterX - 26, sealCenterY - 26, sealCenterX + 26, sealCenterY + 26);
  sealGradient.stop(0, "#fff7d0").stop(1, "#fcd34d");
  doc.circle(sealCenterX, sealCenterY, 22).fill(sealGradient);
  doc.font("Helvetica-Bold")
    .fontSize(9)
    .fillColor("#92400e")
    .text("SKILL", sealCenterX - 18, sealCenterY - 10, { width: 36, align: "center" });
  doc.font("Helvetica-Bold")
    .fontSize(8)
    .fillColor("#92400e")
    .text("QUEST", sealCenterX - 18, sealCenterY + 1, { width: 36, align: "center" });
  doc.font("Helvetica")
    .fontSize(6)
    .fillColor("#b45309")
    .text("ACADEMY", sealCenterX - 20, sealCenterY + 12, { width: 40, align: "center" });
  doc.restore();

  const detailsX = pageWidth - inset - 200;
  doc.font("Helvetica-Bold")
    .fontSize(13)
    .fillColor("#0f172a")
    .text("Certificate Details", detailsX, signatureY - 10, { width: 180 });
  doc.font("Helvetica")
    .fontSize(11)
    .fillColor("#475569")
    .text(`Date: ${formatDate(certificate.issuedAt)}`, detailsX, signatureY + 10, {
      width: 180
    });
  doc.text(`ID: ${certificate.certificateId}`, detailsX, signatureY + 30, {
    width: 180
  });

  try {
    const baseUrl = process.env.CLIENT_URL || "http://localhost:3000";
    const qrPayload = `${baseUrl}/verify/${certificate.certificateId}`;
    const qrDataUrl = await QRCode.toDataURL(qrPayload);
    const qrBuffer = Buffer.from(qrDataUrl.replace(/^data:image\/png;base64,/, ""), "base64");
    const qrSize = qrCardWidth - 40;
    const qrX = qrCardX + (qrCardWidth - qrSize) / 2;
    const qrY = qrCardY + 44;
    doc.image(qrBuffer, qrX, qrY, { width: qrSize });
    doc.font("Helvetica")
      .fontSize(9)
      .fillColor("#475569")
      .text("Scan to verify", qrCardX, qrY + qrSize + 14, {
        width: qrCardWidth,
        align: "center"
      });
  } catch (qrErr) {
    console.error("QR generation failed", qrErr);
  }

  doc.end();
}
