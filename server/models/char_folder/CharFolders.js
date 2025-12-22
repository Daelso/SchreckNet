const Sequelize = require("sequelize");
const db = require("../../database");
const Vampires = require("../vampires");

const CharFolders = db.sequelize.define(
  "char_folders",
  {
    folder_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    game_line: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    folder_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    owner: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Date.now(),
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Date.now(),
    },
  },
  { timestamps: true, underscored: true }
);

module.exports = CharFolders;
