const Sequelize = require("sequelize");
const db = require("../../database");

const RenownTypes = db.sequelize.define(
  "renown_types",
  {
    renown_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    renown_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
);

module.exports = RenownTypes;
