const Sequelize = require("sequelize");
const db = require("../database");

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
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    deleted: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
  },
  { timestamps: true, underscored: true }
);

module.exports = CharFolders;
