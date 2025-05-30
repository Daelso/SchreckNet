const Sequelize = require("sequelize");
const db = require("../../database");
const GameStyles = require("./game_styles");
const Editions = require("./editions");
const GameLines = require("./game_lines");

const Games = db.sequelize.define(
  "games",
  {
    game_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    game_title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    game_style: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: GameStyles,
        key: "style_id",
      },
    },
    game_line: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    edition: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    minimum_players: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    maximum_players: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    created_by: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    updated_by: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    new_player: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    paid_game: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    optional_link: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    active: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  { timestamps: true, underscored: true }
);

Games.belongsTo(GameStyles, {
  foreignKey: "game_style",
  targetKey: "style_id",
  as: "style",
});

Games.belongsTo(Editions, {
  foreignKey: "edition",
  targetKey: "edition_id",
  as: "edition_type",
});

Games.belongsTo(GameLines, {
  foreignKey: "game_line",
  targetKey: "line_id",
  as: "game_line_type",
});

module.exports = Games;
