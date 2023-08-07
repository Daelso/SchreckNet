const Sequelize = require("sequelize");
const db = require("../../database");

const Garou = db.sequelize.define(
  "garou",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    charName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tribe: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    auspice: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    tribe_gifts: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    purchased_gifts: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    tribe_renown: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    purchased_renown: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    bonus_renown: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    concept: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    auspice: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    remaining_specialties: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    chronicle: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    touchstones: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    attributes: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    skills: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    health: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    willpower: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    xp: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    specialties: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    advantages: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    advantages_remaining: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    flaws_remaining: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    created_by: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    tableName: "garou",
  }
);

module.exports = Garou;
