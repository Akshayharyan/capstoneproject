const BossChallenge = require("../models/BossChallenge");

/* =========================================
   HELPER — RANDOM PICK (Weighted)
========================================= */
function weightedRandom(pool) {
  const totalWeight = pool.reduce((sum, item) => sum + (item.weight || 1), 0);
  const random = Math.random() * totalWeight;

  let cumulative = 0;
  for (const item of pool) {
    cumulative += item.weight || 1;
    if (random <= cumulative) return item;
  }

  return pool[0];
}

/* =========================================
   GENERATE HYBRID CHALLENGE
========================================= */
async function generateChallenge(boss, moduleTasks, phase, isSpecial = false) {

  // 1️⃣ Fetch signature challenges for this phase
  const signatureChallenges = await BossChallenge.find({
    bossId: boss._id,
    phase
  }).lean();

  let pool = [];

  // Phase-based ratio
  let moduleWeight = 1;
  let signatureWeight = 1;

  if (phase === 1) {
    moduleWeight = 3;
    signatureWeight = 1;
  } else if (phase === 2) {
    moduleWeight = 2;
    signatureWeight = 2;
  } else if (phase === 3) {
    moduleWeight = 1;
    signatureWeight = 3;
  }

  // Add module tasks
  moduleTasks.forEach(task => {
    pool.push({
      ...task,
      weight: moduleWeight
    });
  });

  // Add signature challenges
  signatureChallenges.forEach(ch => {
    pool.push({
      ...ch,
      weight: signatureWeight * (ch.weight || 1)
    });
  });

  if (pool.length === 0) return null;

  // Special skill forces coding/bugfix
  if (isSpecial) {
    pool = pool.filter(
      c => c.type === "coding" || c.type === "bugfix"
    );
  }

  return weightedRandom(pool);
}

/* =========================================
   CALCULATE PLAYER DAMAGE
========================================= */
function calculateDamage(results, boss, phase, isSpecial = false) {
  const passed = results.filter(r => r.pass).length;
  const total = results.length;

  if (total === 0) return 0;

  let damage = passed * 15;

  // Perfect bonus
  if (passed === total) {
    damage += 20;
  }

  // Phase multiplier
  const phaseConfig = boss.phases?.find(p => p.name === `Phase ${phase}`);
  const playerMultiplier = phaseConfig?.playerDamageMultiplier || 1;

  damage *= playerMultiplier;

  if (isSpecial) {
    damage *= 2;
  }

  return Math.round(damage);
}

/* =========================================
   CALCULATE BOSS DAMAGE
========================================= */
function calculateBossDamage(boss, phase, playerFailed = false) {

  const phaseConfig = boss.phases?.find(p => p.name === `Phase ${phase}`);
  const bossMultiplier = phaseConfig?.bossDamageMultiplier || 1;

  let damage = boss.baseAttackPower * bossMultiplier;

  if (playerFailed) {
    damage *= 1.3; // punishment
  }

  return Math.round(damage);
}

/* =========================================
   CHECK PHASE TRANSITION
========================================= */
function updatePhase(battle, boss) {
  const hpPercent = (battle.bossHp / battle.bossMaxHp) * 100;

  let newPhase = 1;

  boss.phases?.forEach((phaseObj, index) => {
    if (hpPercent <= phaseObj.hpThresholdPercent) {
      newPhase = index + 1;
    }
  });

  battle.phase = newPhase;
}

/* =========================================
   PROCESS ATTACK TURN
========================================= */
async function processTurn({
  battle,
  boss,
  moduleTasks,
  graderResults,
  isSpecial
}) {
  if (battle.status !== "active") {
    return battle;
  }

  battle.turnCount += 1;

  /* ========= PLAYER DAMAGE ========= */
  const playerDamage = calculateDamage(
    graderResults,
    boss,
    battle.phase,
    isSpecial
  );

  battle.bossHp -= playerDamage;
  if (battle.bossHp < 0) battle.bossHp = 0;

  if (battle.bossHp <= 0) {
    battle.status = "victory";
    return battle;
  }

  /* ========= PHASE UPDATE ========= */
  updatePhase(battle, boss);

  /* ========= BOSS COUNTER ========= */
  const playerFailed =
    graderResults.filter(r => r.pass).length === 0;

  const bossDamage = calculateBossDamage(
    boss,
    battle.phase,
    playerFailed
  );

  battle.playerHp -= bossDamage;
  if (battle.playerHp < 0) battle.playerHp = 0;

  /* ========= SPECIAL COOLDOWN ========= */
  if (battle.specialCooldown > 0) {
    battle.specialCooldown -= 1;
  }

  if (isSpecial) {
    battle.specialCooldown = 3;
  }

  if (battle.playerHp <= 0) {
    battle.status = "defeat";
  }

  return battle;
}

/* =========================================
   START NEW BATTLE
========================================= */
function initializeBattle(boss, userId) {
  return {
    userId,
    bossId: boss._id,
    moduleId: boss.moduleId,
    playerHp: 100,
    playerMaxHp: 100,
    bossHp: boss.maxHp,
    bossMaxHp: boss.maxHp,
    phase: 1,
    turnCount: 0,
    specialCooldown: 0,
    status: "active"
  };
}

module.exports = {
  generateChallenge,
  processTurn,
  initializeBattle
};w