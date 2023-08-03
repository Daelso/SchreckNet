const Sequelize = require("sequelize");
const db = require("../database");

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
  },
  { timestamps: false }
);

module.exports = Tribes;
