"use strict";

const TABLES = ["vampires", "hunters", "garou"];

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    for (const table of TABLES) {
      await queryInterface.addColumn(table, "xp_log", {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: [],
      });
    }
  },

  async down(queryInterface) {
    for (const table of TABLES) {
      await queryInterface.removeColumn(table, "xp_log");
    }
  },
};
