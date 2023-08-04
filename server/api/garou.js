const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
const { Op } = require("sequelize");

let router = express.Router();
router.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const Tribes = require("../models/werewolf/Tribes.js");
const Auspices = require("../models/werewolf/Auspices.js");

const lib = require("../lib");
const RenownTypes = require("../models/werewolf/RenownTypes.js");
const NativeGifts = require("../models/werewolf/NativeGifts.js");
const AuspiceGifts = require("../models/werewolf/AuspiceGifts.js");
const Rites = require("../models/werewolf/Rites.js");

//Route is base/garou/

router.route("/tribes").get(lib.getLimiter, async (req, res) => {
  try {
    const tribes = await Tribes.findAll({
      include: [
        {
          model: RenownTypes,
          as: "renownTypeId",
        },
      ],
    });
    res.json(tribes);
  } catch (err) {
    res.status(404).send(err);
  }
});

router.route("/auspices").get(lib.getLimiter, async (req, res) => {
  try {
    const auspices = await Auspices.findAll();
    res.json(auspices);
  } catch (err) {
    res.status(404).send(err);
  }
});

router.route("/renown_types").get(lib.getLimiter, async (req, res) => {
  try {
    const renown_types = await RenownTypes.findAll();
    res.json(renown_types);
  } catch (err) {
    res.status(404).send(err);
  }
});

router
  .route("/native_gifts/:max_level")
  .get(lib.getLimiter, async (req, res) => {
    try {
      const maxLevel = parseInt(req.params.max_level);

      if (isNaN(maxLevel) || maxLevel < 1) {
        return res.status(400).json({ error: "Invalid max_level." });
      }

      const native_gifts = await NativeGifts.findAll({
        where: {
          renown_level: {
            [Op.lte]: maxLevel,
          },
        },
      });
      res.json(native_gifts);
    } catch (err) {
      res.status(404).send(err);
    }
  });

router
  .route("/auspice_gifts/:max_level/:auspice_id")
  .get(lib.getLimiter, async (req, res) => {
    try {
      const maxLevel = parseInt(req.params.max_level);
      const auspiceId = parseInt(req.params.auspice_id);

      if (
        isNaN(maxLevel) ||
        isNaN(auspiceId) ||
        maxLevel < 1 ||
        auspiceId < 1
      ) {
        return res
          .status(400)
          .json({ error: "Invalid max_level or auspice_id." });
      }

      const gifts = await AuspiceGifts.findAll({
        where: {
          renown_level: {
            [Op.lte]: maxLevel,
          },
          auspice_id: {
            [Op.eq]: auspiceId,
          },
        },
      });
      res.json(gifts);
    } catch (err) {
      res.status(404).send(err);
    }
  });

router.route("/rites").get(lib.getLimiter, async (req, res) => {
  try {
    const rites = await Rites.findAll();
    res.json(rites);
  } catch (err) {
    res.status(404).send(err);
  }
});

module.exports = router; //Exports our routes
