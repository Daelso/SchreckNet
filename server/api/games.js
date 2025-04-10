const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();

let router = express.Router();
router.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const validator = require("validator");

const Games = require("../models/game_finder/games.js");
const lib = require("../lib");

//Route is base/games/
router.route("/new_game").post(lib.postLimiter, async (req, res) => {
  try {
    const sanitizedBody = sanitizeStrings(req.body);

    const { title, style, min, max, game_line, desc } = sanitizedBody;

    await Games.create({
      game_title: title,
      game_style: style,
      game_line: game_line.value,
      minimum_players: min,
      maximum_players: max,
      description: desc,
      created_by: req.currentUser.id,
      updated_by: req.currentUser.id,
      created_at: Date.now(),
      updated_at: Date.now(),
    });

    return res.status(200).send("Game created!");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
});

const sanitizeStrings = (obj) => {
  const sanitized = {};
  for (const key in obj) {
    if (typeof obj[key] === "string") {
      sanitized[key] = validator.escape(obj[key]);
    } else {
      sanitized[key] = obj[key];
    }
  }
  return sanitized;
};

module.exports = router; //Exports our routes
