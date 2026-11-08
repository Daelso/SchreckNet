const express = require("express");
const cookieParser = require("cookie-parser");
const sequelize = require("../database");
require("dotenv").config();

let router = express.Router();
router.use(cookieParser());
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

    return res.sendStatus(200);
  } catch (err) {
    return res.status(403).send("Forbidden");
  }
});

router.route("/remove").post(lib.authenticateToken, async (req, res) => {
  try {
    await Favorites.destroy({
      where: {
        id: req.body.favId,
        favorited_by: req.currentUser.id,
      },
    });
    return res.sendStatus(200);
  } catch (err) {
    return res.status(403).send("Forbidden");
  }
});

router.route("/my").get(lib.authenticateToken, async (req, res) => {
  try {
    const userId = req.currentUser.id;
    const [vampires] = await sequelize.sequelize.query(
      "SELECT favs.id as favId, favs.game_id, favs.sheet_id, vamps.* FROM favorites as favs INNER JOIN vampires vamps ON favs.sheet_id = vamps.id WHERE favs.game_id = 1 AND favs.favorited_by = ?",
      { replacements: [userId] }
    );

    const [hunters] = await sequelize.sequelize.query(
      "SELECT favs.id as favId, favs.game_id, favs.sheet_id, hunters.* FROM favorites as favs INNER JOIN hunters hunters ON favs.sheet_id = hunters.id WHERE favs.game_id = 3 AND favs.favorited_by = ?",
      { replacements: [userId] }
    );

    const [garou] = await sequelize.sequelize.query(
      "SELECT favs.id as favId, favs.game_id, favs.sheet_id, garou.* FROM favorites as favs INNER JOIN garou garou ON favs.sheet_id = garou.id WHERE favs.game_id = 2 AND favs.favorited_by = ?",
      { replacements: [userId] }
    );

    return res.status(200).send([vampires, hunters, garou, req.currentUser]);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
});

router.route("/favCount/:id").get(async (req, res) => {
  try {
    const where = { sheet_id: req.params.id };
    // Sheet ids are only unique within a game line (1 = VtM, 2 = WtA, 3 = HtR).
    // game_id is optional so older cached clients keep working.
    if (req.query.game_id !== undefined) {
      where.game_id = req.query.game_id;
    }
    const count = await Favorites.findAndCountAll({ where });

    return res.status(200).send(count);
  } catch (err) {
    return res.status(404).send("Not found!");
  }
});

module.exports = router; //Exports our routes
