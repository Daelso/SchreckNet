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

router.route("/fun_facts").get(lib.getLimiter, async (req, res) => {
  try {
    const [result1, result2, result3, result4, result5] = await Promise.all([
      sequelize.sequelize.query(
        "SELECT role, COUNT(*) AS role_count FROM showlads WHERE ckey = 'Randy Sandy' AND role != 'Unknown' GROUP BY role ORDER BY role_count DESC LIMIT 1;"
      ),
      sequelize.sequelize.query(
        "SELECT ckey, COUNT(*) AS role_count FROM showlads WHERE role = 'Bum' GROUP BY ckey ORDER BY role_count DESC LIMIT 1;"
      ),
      sequelize.sequelize.query(
        "SELECT role, COUNT(*) AS role_count FROM showlads GROUP BY role HAVING role_count > 40 ORDER BY role_count ASC LIMIT 1;"
      ),
      sequelize.sequelize.query(
        "SELECT character_name, COUNT(*) AS played_count FROM showlads GROUP BY character_name ORDER BY COUNT(*) DESC LIMIT 1;"
      ),
      sequelize.sequelize.query(
        "SELECT showlads.role, COUNT(*) AS count_played FROM lifeweb_roles AS roles INNER JOIN showlads ON showlads.role = roles.role WHERE roles.migrant_role = 1 GROUP BY showlads.role ORDER BY count_played DESC LIMIT 1; "
      ),
    ]);

    //idk why tf these are getting duplicated some dumb node stuff
    res
      .status(200)
      .json([
        result1[0][0],
        result2[0][0],
        result3[0][0],
        result4[0][0],
        result5[0][0],
      ]);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router; //Exports our routes
