const Sequelize = require("sequelize");
const db = require("../../database");

const Editions = db.sequelize.define(
  "editions",
  {
    edition_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    edition_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  { timestamps: false, underscored: true }
);

module.exports = Editions;
