const Sequelize = require("sequelize");
const db = require("../database");

const Rites = db.sequelize.define(
  "rites",
  {
    rite_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    rite_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    rite_description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    pool: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    social: {
      type: Sequelize.TINYINT,
      allowNull: false,
    },
  },
  { timestamps: false }
);

module.exports = Rites;
