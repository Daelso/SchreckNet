const express = require("express");
const cookieParser = require("cookie-parser");
const sequelize = require("../database");
require("dotenv").config();
const app = express();

let router = express.Router();
router.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const GameStyles = require("../models/game_finder/game_styles.js");
const lib = require("../lib");
const Games = require("../models/game_finder/games.js");
const { Sequelize } = require("sequelize");
const GameLines = require("../models/game_finder/game_lines");
const Editions = require("../models/game_finder/editions");

//Route is base/game_finder/
router.route("/game_lines").get(lib.getLimiter, async (req, res) => {
  try {
    const game_lines = await GameLines.findAll();

    return res.status(200).json(game_lines);
  } catch (err) {
    console.error(err);
    return res.status(403).send("forbidden");
  }
});

router.route("/editions").get(lib.getLimiter, async (req, res) => {
  try {
    const editions = await Editions.findAll();

    return res.status(200).json(editions);
  } catch (err) {
    console.error(err);
    return res.status(403).send("forbidden");
  }
});

router.route("/styles").get(lib.getLimiter, async (req, res) => {
  try {
    const styles = await GameStyles.findAll();

    return res.status(200).json(styles);
  } catch (err) {
    console.error(err);
    return res.status(403).send("forbidden");
  }
});

router.route("/all_games").get(lib.getLimiter, async (req, res) => {
  try {
    const { game_line, page = 1, edition } = req.query;

    const where = {
      active: 1,
    };

    assignIfValid(where, "game_line", game_line);
    assignIfValid(where, "edition", edition);

    const limit = 25;
    const offset = (parseInt(page) - 1) * limit;

    const { count, rows } = await Games.findAndCountAll({
      where,
      include: [
        {
          model: GameStyles,
          as: "style",
          attributes: ["style_id", "style"],
        },
        {
          model: Editions,
          as: "edition_type",
          attributes: ["edition_id", "edition_name"],
        },
        {
          model: GameLines,
          as: "game_line_type",
          attributes: ["line_id", "game_line"],
        },
      ],

      limit,
      offset,
      order: [["updated_at", "DESC"]],
    });

    return res.status(200).json({
      total: count,
      page: parseInt(page),
      total_pages: Math.ceil(count / limit),
      games: rows,
    });
  } catch (err) {
    console.error(err);
    return res.status(403).send("forbidden");
  }
});

router.route("/all_my_games").get(lib.authenticateToken, async (req, res) => {
  try {
    const { game_line, page = 1, edition } = req.query;

    const user = req.currentUser;

    if (!user) {
      return res.status(403).send("User not found, access denied");
    }

    const where = {
      active: 1,
      created_by: user.id,
    };

    assignIfValid(where, "game_line", game_line);
    assignIfValid(where, "edition", edition);

    const limit = 25;
    const offset = (parseInt(page) - 1) * limit;

    const { count, rows } = await Games.findAndCountAll({
      where,
      include: [
        {
          model: GameStyles,
          as: "style",
          attributes: ["style_id", "style"],
        },
        {
          model: Editions,
          as: "edition_type",
          attributes: ["edition_id", "edition_name"],
        },
        {
          model: GameLines,
          as: "game_line_type",
          attributes: ["line_id", "game_line"],
        },
      ],

      limit,
      offset,
      order: [["updated_at", "DESC"]],
    });

    return res.status(200).json({
      total: count,
      page: parseInt(page),
      total_pages: Math.ceil(count / limit),
      games: rows,
    });
  } catch (err) {
    console.error(err);
    return res.status(403).send("forbidden");
  }
});

function assignIfValid(obj, key, value) {
  if (
    value !== undefined &&
    value !== null &&
    value !== "Any" &&
    value !== "100"
  ) {
    obj[key] = value;
  }
}

module.exports = router; //Exports our routes
