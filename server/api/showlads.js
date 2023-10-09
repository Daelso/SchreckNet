const express = require("express");
const cookieParser = require("cookie-parser");
const sequelize = require("../database");
require("dotenv").config();
const app = express();

let router = express.Router();
router.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const Showlads = require("../models/lifeweb/Showlads.js");
const lib = require("../lib");

//Route is base/showlads/
router.route("/ckey/:ckey").get(async (req, res) => {
  try {
    const ckey_stats = await Showlads.findAll({
      where: {
        ckey: req.params.ckey,
      },
    });
    res.send(ckey_stats.dataValues);
  } catch (err) {
    res.status(404).send(err);
  }
});

module.exports = router; //Exports our routes
