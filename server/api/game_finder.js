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

//Route is base/game_finder/
router.route("/styles").get(lib.getLimiter, async (req, res) => {
  try {
    const styles = await GameStyles.findAll();

    return res.status(200).json(styles);
  } catch (err) {
    return res.status(403).send("forbidden");
  }
});

router.route("/all_games").get(lib.getLimiter, async (req, res) => {
  try {
    const { game_line, page = 1 } = req.query;

    const where = {};

    if (game_line !== undefined && game_line !== null && game_line !== "Any") {
      where.game_line = game_line;
    }

    const limit = 25;
    const offset = (parseInt(page) - 1) * limit;

    const { count, rows } = await Games.findAndCountAll({
      where,
      include: [
        {
          model: GameStyles,
          as: "style", // MUST match alias in .belongsTo
          attributes: ["style_id", "style"],
        },
      ],
      attributes: {
        include: [
          [
            Sequelize.literal(`
            CASE
              WHEN games.game_line = 1 THEN 'Vampire: the Masquerade'
              WHEN games.game_line = 2 THEN 'Werewolf: the Apocalypse'
              WHEN games.game_line = 3 THEN 'Hunter: the Reckoning'
              ELSE 'Unknown'
            END
          `),
            "line_title",
          ],
        ],
      },
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

module.exports = router; //Exports our routes
