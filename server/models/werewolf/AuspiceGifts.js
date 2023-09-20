const Sequelize = require("sequelize");
const db = require("../../database");

const Auspices = require("./Auspices");

const AuspiceGifts = db.sequelize.define(
  "auspice_gifts",
  {
    gift_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    gift_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    gift_description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    pool: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    cost: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    renown_level: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    auspice_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    page: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    short_desc: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
);

AuspiceGifts.belongsTo(Auspices, {
  foreignKey: "auspice_id",
  as: "auspice",
});

module.exports = AuspiceGifts;
