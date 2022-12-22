const Sequelize = require("sequelize");
const db = require("../database");

const Hunters = db.sequelize.define("hunters", {
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
  cell: {
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
  drive: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  spentXp: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  remaining_specialties: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  redemption: {
    type: Sequelize.STRING,
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
  creed: {
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
  edges: {
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
});

module.exports = Hunters;
