const Sequelize = require("sequelize");
const db = require("../database");

const Auspices = db.sequelize.define(
  "auspices",
  {
    auspice_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    auspice_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
);

module.exports = Auspices;
