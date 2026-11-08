"use strict";

// The homepage cards and every search sort characters by createdAt DESC.
// Without an index MySQL reads and sorts the whole table on each request.
// MySQL builds these online (InnoDB, no table lock). DDL can't run inside a
// transaction in MySQL, so each index is added on its own.
const INDEXES = [
  { table: "vampires", name: "vampires_created_at_idx" },
  { table: "hunters", name: "hunters_created_at_idx" },
  { table: "garou", name: "garou_created_at_idx" },
];

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface) {
    for (const { table, name } of INDEXES) {
      await queryInterface.addIndex(table, ["createdAt"], { name });
    }
  },

  async down(queryInterface) {
    for (const { table, name } of INDEXES) {
      await queryInterface.removeIndex(table, name);
    }
  },
};
