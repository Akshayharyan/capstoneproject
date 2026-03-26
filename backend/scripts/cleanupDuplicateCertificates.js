const mongoose = require("mongoose");
const Certificate = require("../models/Certificate");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/gamified-training";

async function cleanupDuplicates() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Find all certificates
    const allCerts = await Certificate.find().sort({ userId: 1, moduleId: 1, createdAt: -1 });
    console.log(`📊 Total certificates in DB: ${allCerts.length}`);

    // Group by userId + moduleId to find duplicates
    const grouped = {};
    allCerts.forEach((cert) => {
      const key = `${cert.userId}_${cert.moduleId}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(cert);
    });

    // Find duplicates and delete extras
    let deletedCount = 0;
    const keysWithDuplicates = Object.keys(grouped).filter((key) => grouped[key].length > 1);

    console.log(`\n⚠️  Found ${keysWithDuplicates.length} users with duplicate certificates`);

    for (const key of keysWithDuplicates) {
      const certs = grouped[key];
      console.log(
        `\n🔍 User ${key}: Has ${certs.length} certificates for same module`
      );

      // Keep the first one (most recent), delete the rest
      const toKeep = certs[0];
      const toDelete = certs.slice(1);

      console.log(`  ✅ Keeping: ${toKeep.certificateId} (issued ${toKeep.issuedAt})`);

      for (const cert of toDelete) {
        console.log(`  ❌ Deleting: ${cert.certificateId} (issued ${cert.issuedAt})`);
        await Certificate.deleteOne({ _id: cert._id });
        deletedCount++;
      }
    }

    console.log(`\n✨ Cleanup complete!`);
    console.log(`   Total certificates deleted: ${deletedCount}`);
    console.log(`   Remaining certificates: ${allCerts.length - deletedCount}`);

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB\n");
  } catch (error) {
    console.error("❌ Cleanup failed:", error.message);
    process.exit(1);
  }
}

cleanupDuplicates();
