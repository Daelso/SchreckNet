const Sequelize = require("sequelize");
const db = require("../database");

const Favorites = db.sequelize.define("favorites", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  game_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  sheet_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  favorited_by: {
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

module.exports = Favorites;
