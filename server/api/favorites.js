const express = require("express");
const cookieParser = require("cookie-parser");
const sequelize = require("../database");
require("dotenv").config();
const app = express();

let router = express.Router();
router.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const Favorites = require("../models/Favorites.js");
const lib = require("../lib");

//Route is base/favorites/
router.route("/add").post(lib.authenticateToken, async (req, res) => {
  try {
    const check = await Favorites.findAll({
      where: {
        game_id: req.body.game_id,
        sheet_id: req.body.sheet_id,
        favorited_by: req.currentUser.id,
      },
    });
    if (check.length > 0) {
      return res.sendStatus(409);
    }

    await Favorites.create({
      game_id: req.body.game_id,
      sheet_id: req.body.sheet_id,
      favorited_by: req.currentUser.id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    res.sendStatus(200);
  } catch (err) {
    res.status(403).send(err);
  }
});

router.route("/remove").post(lib.authenticateToken, async (req, res) => {
  try {
    await Favorites.destroy({
      where: {
        id: req.body.favId,
      },
    });
    res.sendStatus(200);
  } catch (err) {
    res.status(403).send(err);
  }
});

router.route("/my").get(lib.authenticateToken, async (req, res) => {
  console.log(req.currentUser.id);
  try {
    const [vampires] = await sequelize.sequelize.query(
      `SELECT favs.id as favId, favs.game_id, favs.sheet_id, vamps.* FROM login.favorites as favs INNER JOIN login.vampires vamps ON favs.sheet_id = vamps.id WHERE favs.game_id = 1 AND favs.favorited_by = ${req.currentUser.id}`
    );

    const [hunters] = await sequelize.sequelize.query(
      `SELECT favs.id as favId, favs.game_id, favs.sheet_id, hunters.* FROM login.favorites as favs INNER JOIN login.hunters hunters ON favs.sheet_id = hunters.id WHERE favs.game_id = 2 AND favs.favorited_by = ${req.currentUser.id}`
    );

    const [garou] = await sequelize.sequelize.query(
      `SELECT favs.id as favId, favs.game_id, favs.sheet_id, garou.* FROM login.favorites as favs INNER JOIN login.garou garou ON favs.sheet_id = garou.id WHERE favs.game_id = 3 AND favs.favorited_by = ${req.currentUser.id}`
    );

    res.status(200).send([vampires, hunters, garou, req.currentUser]);
  } catch (err) {
    res.status(404).send(err);
  }
});

router.route("/favCount/:id").get(async (req, res) => {
  try {
    const count = await Favorites.findAndCountAll({
      where: {
        sheet_id: req.params.id,
      },
    });

    res.status(200).send(count);
  } catch (err) {
    res.status(404).send(err);
  }
});

module.exports = router; //Exports our routes
