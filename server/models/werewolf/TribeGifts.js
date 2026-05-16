const Sequelize = require("sequelize");
const db = require("../../database");

const Tribes = require("./Tribes");

const TribeGifts = db.sequelize.define(
  "tribe_gifts",
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
    tribe_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  { timestamps: false }
);

TribeGifts.belongsTo(Tribes, {
  foreignKey: "tribe_id",
  as: "tribe",
});

module.exports = TribeGifts;
