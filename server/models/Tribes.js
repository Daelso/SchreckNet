const Sequelize = require("sequelize");
const db = require("../database");

const RenownTypes = require("./RenownTypes");

const Tribes = db.sequelize.define(
  "tribes",
  {
    tribe_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    tribe_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    patron: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    favor: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    ban: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    renown_type: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  { timestamps: false }
);

Tribes.belongsTo(RenownTypes, {
  foreignKey: "renown_type",
  as: "renownTypeId",
});

module.exports = Tribes;
