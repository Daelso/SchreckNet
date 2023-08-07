const Sequelize = require("sequelize");
const db = require("../../database");

const MeritCategories = db.sequelize.define(
  "merit_categories",
  {
    category_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    category_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
);

module.exports = MeritCategories;
