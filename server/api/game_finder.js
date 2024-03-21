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

//Route is base/game_finder/
router.route("/styles").get(lib.getLimiter, async (req, res) => {
  try {
    const styles = await GameStyles.findAll();

    res.status(200).json(styles);
  } catch (err) {
    res.status(403).send(err);
  }
});

module.exports = router; //Exports our routes
