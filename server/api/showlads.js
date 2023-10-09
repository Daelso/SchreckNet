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

router.get("/ckeys", lib.getLimiter, async (req, res) => {
  try {
    const result = await sequelize.sequelize.query(
      "SELECT DISTINCT ckey FROM showlads ORDER by ckey asc"
    );
    const ckeys = result[0].map((item) => item.ckey);

    res.status(200).json(ckeys);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.route("/ckey/:ckey").get(lib.getLimiter, async (req, res) => {
  try {
    const ckey_stats = await Showlads.findAll({
      where: {
        ckey: req.params.ckey,
      },
    });
    res.send(ckey_stats);
  } catch (err) {
    res.status(404).send(err);
  }
});

module.exports = router; //Exports our routes
