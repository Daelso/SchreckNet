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

const { QueryTypes } = require("sequelize");

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

router.get("/characters", lib.getLimiter, async (req, res) => {
  try {
    const result = await sequelize.sequelize.query(
      "SELECT DISTINCT character_name FROM showlads ORDER by character_name asc"
    );
    const characters = result[0].map((item) => item.character_name);

    res.status(200).json(characters);
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
        "SELECT showlads.role, COUNT(*) AS count_played FROM lifeweb_roles AS roles INNER JOIN showlads ON showlads.role = roles.role_name WHERE roles.role_category = 9 GROUP BY showlads.role ORDER BY count_played DESC LIMIT 1; "
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

router.route("/ckey_fun_facts/:ckey").get(lib.getLimiter, async (req, res) => {
  try {
    const [result1, result2] = await Promise.all([
      sequelize.sequelize.query(
        `SELECT count(*) as role_count, role FROM showlads WHERE ckey = '${req.params.ckey}' AND role != 'Unknown' GROUP BY role ORDER BY COUNT(*) DESC LIMIT 1`
      ),
      sequelize.sequelize.query(
        `SELECT COUNT(character_name) AS static_count, SUBSTRING_INDEX(character_name, ' ', 1) AS first_name FROM showlads WHERE ckey = '${req.params.ckey}' GROUP BY first_name ORDER BY static_count DESC LIMIT 1;`
      ),
    ]);

    //idk why tf these are getting duplicated some dumb node stuff
    res.status(200).json([result1[0][0], result2[0][0]]);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get(
  "/find_static/:ckey/:character_name",
  lib.getLimiter,
  async (req, res) => {
    try {
      const [results, metadata] = await sequelize.sequelize.query(
        `SELECT count(character_name) as played_count FROM showlads WHERE ckey = '${req.params.ckey}' AND character_name = '${req.params.character_name}'`
      );

      res.status(200).send(results);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get(
  "/find_role_played/:ckey/:role",
  lib.getLimiter,
  async (req, res) => {
    try {
      const ckey = req.params.ckey;
      const role = req.params.role;

      const query = `
        SELECT COUNT(role) as played_count
        FROM showlads
        WHERE ckey = :ckey AND role = :role
      `;

      const [results, metadata] = await sequelize.sequelize.query(query, {
        replacements: { ckey: ckey, role: role },
        type: QueryTypes.SELECT,
      });

      res.status(200).send(results);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get(
  "/find_role_played_by_char/:character_name/:role",
  lib.getLimiter,
  async (req, res) => {
    try {
      const character_name = req.params.character_name;
      const role = req.params.role;

      const query = `
        SELECT COUNT(role) as played_count
        FROM showlads
        WHERE character_name = :character_name AND role = :role
      `;

      const [results, metadata] = await sequelize.sequelize.query(query, {
        replacements: { character_name: character_name, role: role },
        type: QueryTypes.SELECT,
      });

      res.status(200).send(results);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get("/pie_chart/:ckey", lib.getLimiter, async (req, res) => {
  try {
    const [results, metadata] = await sequelize.sequelize.query(
      `SELECT COUNT(showlads.role) AS play_count, rc.category_name FROM role_categories rc LEFT JOIN lifeweb_roles lr ON rc.category_id = lr.role_category LEFT JOIN showlads ON lr.role_name = showlads.role AND showlads.ckey = '${req.params.ckey}' GROUP BY rc.category_name ORDER BY category_name asc;`
    );

    res.status(200).send(results);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.route("/char_name").get(lib.getLimiter, async (req, res) => {
  try {
    const char_stats = await Showlads.findAll({
      where: {
        character_name: decodeURIComponent(req.query.character_name.trim()),
      },
    });
    res.send(char_stats);
  } catch (err) {
    res.status(404).send(err);
  }
});

router
  .route("/character_name_fun_facts/:character_name")
  .get(lib.getLimiter, async (req, res) => {
    try {
      const [result1, result2] = await Promise.all([
        sequelize.sequelize.query(
          `SELECT count(*) as role_count, role FROM showlads WHERE character_name = '${req.params.character_name}' AND role != 'Unknown' GROUP BY role ORDER BY COUNT(*) DESC LIMIT 1`
        ),
        sequelize.sequelize.query(
          `SELECT COUNT(ckey) AS static_count, ckey FROM showlads WHERE character_name = '${req.params.character_name}' GROUP BY ckey ORDER BY static_count DESC LIMIT 1;`
        ),
      ]);

      //idk why tf these are getting duplicated some dumb node stuff
      res.status(200).json([result1[0][0], result2[0][0]]);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

router.get(
  "/pie_chart_character/:character_name",
  lib.getLimiter,
  async (req, res) => {
    try {
      const [results, metadata] = await sequelize.sequelize.query(
        `SELECT COUNT(showlads.role) AS play_count, rc.category_name FROM role_categories rc LEFT JOIN lifeweb_roles lr ON rc.category_id = lr.role_category LEFT JOIN showlads ON lr.role_name = showlads.role AND showlads.character_name = '${req.params.character_name}' GROUP BY rc.category_name ORDER BY category_name asc;`
      );

      res.status(200).send(results);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = router; //Exports our routes
