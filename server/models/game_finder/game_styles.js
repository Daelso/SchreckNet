const Sequelize = require("sequelize");
const db = require("../../database");

const GameStyles = db.sequelize.define(
  "game_styles",
  {
    style_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    style: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
);

module.exports = GameStyles;
