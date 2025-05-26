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

    const {
      title,
      style,
      min,
      max,
      game_line,
      desc,
      paid_game,
      new_player,
      optional_link,
      edition,
    } = sanitizedBody;

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
      paid_game: paid_game,
      new_player: new_player,
      optional_link: optional_link,
      active: 1,
      edition: edition,
    });

    return res.status(200).send("Game created!");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
});

router.route("/:id/bump").post(lib.postLimiter, async (req, res) => {
  try {
    const { id } = req.params;

    const game = await Games.findOne({ where: { game_id: id } });

    if (!game) {
      return res.status(404).send("Game not found.");
    }

    const now = new Date();
    const lastUpdated = new Date(game.updated_at);
    const diffInMs = now - lastUpdated;
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return res.status(429).send("You can only bump once per hour.");
    }

    await Games.update({ updated_at: now }, { where: { game_id: id } });

    return res.status(200).send("Game bumped!");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});

router.route("/:id/edit").put(lib.postLimiter, async (req, res) => {
  try {
    const game_id = req.params.id;
    const sanitizedBody = sanitizeStrings(req.body);

    const {
      title,
      style,
      min,
      max,
      game_line,
      desc,
      paid_game,
      new_player,
      optional_link,
      edition,
    } = sanitizedBody;

    const game = await Games.findOne({ where: { game_id: game_id } });

    if (!game) {
      return res.status(404).send("Game not found.");
    }

    game.update({
      game_title: title,
      game_style: style,
      game_line: game_line.value,
      minimum_players: min,
      maximum_players: max,
      description: desc,
      updated_by: req.currentUser.id,
      updated_at: Date.now(),
      paid_game: paid_game,
      new_player: new_player,
      optional_link: optional_link,
      edition: edition,
      active: 1,
    });

    return res.status(200).send("Game edited!");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});

router.route("/:id/delete").put(lib.postLimiter, async (req, res) => {
  try {
    const game_id = req.params.id;

    const game = await Games.findOne({ where: { game_id: game_id } });

    if (!game) {
      return res.status(404).send("Game not found.");
    }

    game.update({
      active: 0,
    });

    return res.status(200).send("Game deleted!");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});

const sanitizeStrings = (obj) => {
  const sanitized = {};
  for (const key in obj) {
    if (typeof obj[key] === "string") {
      if (key === "link" || key === "optional_link") {
        // Validate that it's a proper URL, but do NOT escape it
        sanitized[key] = obj[key].trim();
      } else {
        // Escape other strings for safety
        sanitized[key] = validator.escape(obj[key]);
      }
    } else {
      sanitized[key] = obj[key];
    }
  }
  return sanitized;
};

module.exports = router; //Exports our routes
