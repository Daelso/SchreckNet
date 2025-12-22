const Sequelize = require("sequelize");
const db = require("../../database");
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
      defaultValue: Date.now(),
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Date.now(),
    },
  },

  {
    timestamps: false,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["parent_folder", "char_id"],
      },
    ],
  }
);

CharsInFolders.belongsTo(CharFolders, {
  foreignKey: "parent_folder",
});

CharFolders.hasMany(CharsInFolders, {
  foreignKey: "parent_folder",
});

module.exports = CharsInFolders;
