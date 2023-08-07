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
const TribeGifts = require("../models/werewolf/TribeGifts.js");
const Garou = require("../models/werewolf/Garou.js");

//Route is base/garou/

router.route("/new").post(lib.postLimiter, async (req, res) => {
  try {
    let currentUser = lib.getCurrentUser(req, res);

    if (currentUser !== null) {
      currentUser = currentUser.id;
    }

    const newGarou = await Garou.create({
      charName: req.body.name,
      tribe: req.body.tribe,
      concept: req.body.concept,
      auspice: req.body.auspice,
      chronicle: req.body.chronicle,
      touchstones: req.body.touchstones,
      attributes: req.body.attributes,
      skills: req.body.skills,
      bonus_renown: req.body.bonus_renown,
      health: req.body.health,
      willpower: req.body.willpower,
      remaining_specialties: req.body.remainingSpecialties,
      xp: req.body.xp,
      specialties: req.body.specialties,
      advantages: req.body.advantages,
      advantages_remaining: req.body.advantages_remaining,
      flaws_remaining: req.body.flaws_remaining,
      tribe_gifts: req.body.tribe_gifts,
      purchased_gifts: req.body.purchased_gifts,
      tribe_renown: req.body.tribe_renown,
      purchased_renown: req.body.purchased_renown,
      created_by: currentUser,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    res.status(200).json(newGarou.id);
  } catch (err) {
    res.status(403).send(err);
  }
});

router.route("/garou/:id").get(lib.getLimiter, async (req, res) => {
  try {
    const garou = await Garou.findByPk(req.params.id);
    res.json(garou);
  } catch (err) {
    res.status(404).send(err);
  }
});

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

      if (isNaN(maxLevel) || maxLevel < 0) {
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
        maxLevel < 0 ||
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

router
  .route("/tribe_gifts/:max_level/:tribe_id")
  .get(lib.getLimiter, async (req, res) => {
    try {
      const maxLevel = parseInt(req.params.max_level);
      const tribeId = parseInt(req.params.tribe_id);

      if (isNaN(maxLevel) || isNaN(tribeId) || maxLevel < 0 || tribeId < 1) {
        return res
          .status(400)
          .json({ error: "Invalid max_level or tribe_id." });
      }

      const gifts = await TribeGifts.findAll({
        where: {
          renown_level: {
            [Op.lte]: maxLevel,
          },
          tribe_id: {
            [Op.eq]: tribeId,
          },
        },
      });

      res.status(200).json(gifts);
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

router.route("/card").get(async (req, res) => {
  try {
    const garou = await Garou.findAll({
      limit: 3,
      order: [["createdAt", "DESC"]],
    });
    res.json(garou);
  } catch (err) {
    res.status(404).send(err);
  }
});

router.route("/delete/:id").delete(lib.postLimiter, async (req, res) => {
  try {
    let currentUser = lib.getCurrentUser(req, res);

    const garou = await Garou.findByPk(req.params.id);

    if (currentUser.id !== garou.created_by) {
      return;
    }
    garou.destroy();
    res.status(200).send("Deletion successful");
  } catch (err) {
    res.status(404).send(err);
  }
});

module.exports = router; //Exports our routes
