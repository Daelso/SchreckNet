const Sequelize = require("sequelize");
const db = require("../database");

const Vampires = db.sequelize.define("vampires", {
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
  clan: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  concept: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  ambition: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  desire: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  archetype: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  sect: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  chronicle: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  sireName: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  convictions: {
    type: Sequelize.JSON,
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
  age: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  generation: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  predator_type: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  cult: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  health: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  willpower: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  potency: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  max_potency: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  disciplines: {
    type: Sequelize.JSON,
    allowNull: false,
  },
  discipline_skills: {
    type: Sequelize.JSON,
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
  created_by: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});

module.exports = Vampires;
