"use strict";

const TABLES = ["vampires", "hunters", "garou"];

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      for (const table of TABLES) {
        // Step 1: add the column nullable (MySQL 5.7 does not support DEFAULT
        // expressions on JSON columns, so we skip defaultValue here).
        await queryInterface.addColumn(
          table,
          "xp_log",
          { type: Sequelize.JSON, allowNull: true },
          { transaction }
        );

        // Step 2: backfill existing rows so xp_log is never NULL.
        await queryInterface.sequelize.query(
          `UPDATE \`${table}\` SET xp_log = JSON_ARRAY() WHERE xp_log IS NULL`,
          { transaction }
        );

        // Step 3: tighten the column to NOT NULL now that every row has a value.
        await queryInterface.changeColumn(
          table,
          "xp_log",
          { type: Sequelize.JSON, allowNull: false },
          { transaction }
        );
      }
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      for (const table of TABLES) {
        await queryInterface.removeColumn(table, "xp_log", { transaction });
      }
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
