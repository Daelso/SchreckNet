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
  humanity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  remaining_specialties: {
    type: Sequelize.INTEGER,
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
  image_link: {
    type: Sequelize.STRING,
    allowNull: true,
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
  advantages_remaining: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  flaws_remaining: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  alt_bane: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  alt_ancilla: {
    type: Sequelize.INTEGER,
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
  dark_discipline: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
  },
});

module.exports = Vampires;
