const Sequelize = require("sequelize");
const db = require("../../database");

const GameLines = db.sequelize.define(
  "game_lines",
  {
    line_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    game_line: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  { timestamps: false, underscored: true }
);

module.exports = GameLines;
