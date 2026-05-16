const mysql = require("mysql2/promise");
require("dotenv").config();

let pool;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 4,
    });
  }
  return pool;
}

/**
 * Clone a template character into a new row owned by the supplied user, with
 * a fresh XP bank and empty xp_log so the test starts from a known baseline.
 *
 * Returns the new character's id. Caller is responsible for cleanup
 * (use deleteCharacter or the returned cleanup() callback).
 */
async function seedVampire({
  ownerId,
  templateId = 103,
  charName = "E2E VtM",
  xp = 50,
  advantagesRemaining = 7,
  flawsRemaining = 2,
} = {}) {
  const conn = await getPool().getConnection();
  try {
    const [result] = await conn.query(
      `INSERT INTO vampires (
        charName, clan, concept, ambition, desire, archetype, humanity,
        remaining_specialties, sect, chronicle, sireName, convictions,
        touchstones, attributes, skills, age, generation, image_link,
        predator_type, cult, health, willpower, potency, max_potency,
        disciplines, discipline_skills, xp, xp_log, specialties, advantages,
        advantages_remaining, flaws_remaining, alt_bane, alt_ancilla,
        created_by, createdAt, updatedAt, dark_discipline
      )
      SELECT ?, clan, concept, ambition, desire, archetype, humanity,
        remaining_specialties, sect, chronicle, sireName, convictions,
        touchstones, attributes, skills, age, generation, image_link,
        predator_type, cult, health, willpower, potency, max_potency,
        disciplines, discipline_skills, ?, JSON_ARRAY(), specialties, advantages,
        ?, ?, alt_bane, alt_ancilla,
        ?, NOW(), NOW(), dark_discipline
      FROM vampires WHERE id = ?`,
      [charName, xp, advantagesRemaining, flawsRemaining, ownerId, templateId]
    );
    return result.insertId;
  } finally {
    conn.release();
  }
}

async function seedGarou({
  ownerId,
  templateId = 5,
  charName = "E2E Garou",
  xp = 50,
  advantagesRemaining = 7,
  flawsRemaining = 2,
} = {}) {
  const conn = await getPool().getConnection();
  try {
    const [result] = await conn.query(
      `INSERT INTO garou (
        charName, tribe, auspice, bonus_renown, concept, chronicle,
        touchstones, attributes, skills, health, willpower, tribe_gifts,
        purchased_gifts, tribe_renown, purchased_renown, xp, spent_xp,
        specialties, advantages_remaining, flaws_remaining,
        remaining_specialties, advantages, created_by, createdAt, updatedAt,
        xp_log
      )
      SELECT ?, tribe, auspice, bonus_renown, concept, chronicle,
        touchstones, attributes, skills, health, willpower, tribe_gifts,
        purchased_gifts, tribe_renown, purchased_renown, ?, 0,
        specialties, ?, ?,
        0, advantages, ?, NOW(), NOW(),
        JSON_ARRAY()
      FROM garou WHERE id = ?`,
      [charName, xp, advantagesRemaining, flawsRemaining, ownerId, templateId]
    );
    return result.insertId;
  } finally {
    conn.release();
  }
}

async function seedHunter({
  ownerId,
  templateId = 48,
  charName = "E2E Hunter",
  xp = 50,
  advantagesRemaining = 7,
  flawsRemaining = 2,
} = {}) {
  const conn = await getPool().getConnection();
  try {
    const [result] = await conn.query(
      `INSERT INTO hunters (
        charName, cell, concept, ambition, desire, chronicle, creed, drive,
        redemption, touchstones, attributes, skills, health, willpower,
        edges, xp, spentXp, specialties, advantages_remaining,
        flaws_remaining, remaining_specialties, advantages, created_by,
        createdAt, updatedAt, xp_log
      )
      SELECT ?, cell, concept, ambition, desire, chronicle, creed, drive,
        redemption, touchstones, attributes, skills, health, willpower,
        edges, ?, 0, specialties, ?,
        ?, 0, advantages, ?,
        NOW(), NOW(), JSON_ARRAY()
      FROM hunters WHERE id = ?`,
      [charName, xp, advantagesRemaining, flawsRemaining, ownerId, templateId]
    );
    return result.insertId;
  } finally {
    conn.release();
  }
}

async function deleteCharacter(table, id) {
  if (!["vampires", "garou", "hunters"].includes(table)) {
    throw new Error(`deleteCharacter: refusing unknown table "${table}"`);
  }
  const conn = await getPool().getConnection();
  try {
    await conn.query(`DELETE FROM ${table} WHERE id = ?`, [id]);
  } finally {
    conn.release();
  }
}

async function closePool() {
  if (pool) {
    await pool.end();
    pool = undefined;
  }
}

module.exports = {
  seedVampire,
  seedGarou,
  seedHunter,
  deleteCharacter,
  closePool,
};
