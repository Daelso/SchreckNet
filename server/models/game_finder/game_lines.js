import { INTEGER, STRING } from "sequelize";
import { sequelize } from "../../database";

const GameLines = sequelize.define(
  "game_lines",
  {
    line_id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    game_line: {
      type: STRING,
      allowNull: false,
    },
  },
  { timestamps: false, underscored: true }
);

export default GameLines;
