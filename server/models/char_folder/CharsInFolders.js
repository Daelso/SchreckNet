const Sequelize = require("sequelize");
const db = require("../database");
const CharFolders = require("./CharFolders");

const CharsInFolders = db.sequelize.define(
  "chars_in_folders",
  {
    entry_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    char_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    parent_folder: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: CharFolders,
        key: "folder_id",
      },
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

module.exports = CharsInFolders;
