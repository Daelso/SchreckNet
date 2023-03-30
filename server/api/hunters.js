const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();

let router = express.Router();
router.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const Hunters = require("../models/Hunters");
const lib = require("../lib");

//Route is base/hunters/
router.route("/new").post(async (req, res) => {
  try {
    let currentUser = lib.getCurrentUser(req, res);

    if (currentUser !== null) {
      currentUser = currentUser.id;
    }
    const newHunter = await Hunters.create({
      charName: req.body.name,
      cell: req.body.cell,
      concept: req.body.concept,
      ambition: req.body.ambition,
      desire: req.body.desire,
      creed: req.body.creed,
      drive: req.body.drive,
      redemption: req.body.redemption,
      chronicle: req.body.chronicle,
      touchstones: req.body.touchstones,
      attributes: req.body.attributes,
      skills: req.body.skills,
      health: req.body.health,
      willpower: req.body.willpower,
      remaining_specialties: req.body.remainingSpecialties,
      edges: req.body.edgeArr,
      xp: req.body.xp,
      spentXp: req.body.spentXp,
      specialties: req.body.specialties,
      advantages: req.body.advantages,
      advantages_remaining: req.body.advantages_remaining,
      flaws_remaining: req.body.flaws_remaining,
      created_by: currentUser,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    res.status(200).json(newHunter.id);
  } catch (err) {
    res.status(403).send(err);
  }
});

router.route("/hunter/:id").get(async (req, res) => {
  try {
    const hunter = await Hunters.findByPk(req.params.id);
    res.send(hunter.dataValues);
  } catch (err) {
    res.status(404).send(err);
  }
});

router.route("/myHunter/:id").get(async (req, res) => {
  try {
    const hunter = await Hunters.findAll({
      where: {
        created_by: req.params.id,
      },
    });
    res.status(200).send(hunter);
  } catch (err) {
    res.status(404).send(err);
  }
});

router.route("/card").get(async (req, res) => {
  try {
    const hunter = await Hunters.findAll({
      limit: 3,
      order: [["createdAt", "DESC"]],
    });
    res.send(hunter);
  } catch (err) {
    res.status(404).send(err);
  }
});

router.route("/hunter/edit/:id").put(lib.postLimiter, async (req, res) => {
  try {
    const currentUser = lib.getCurrentUser(req, res);

    const hunter = await Hunters.findByPk(req.params.id);

    if (currentUser.id !== hunter.created_by) {
      res.status(403).send("Access Denied");
      return;
    }

    await hunter.update({
      charName: req.body.name,
      cell: req.body.cell,
      concept: req.body.concept,
      ambition: req.body.ambition,
      desire: req.body.desire,
      creed: req.body.creed,
      drive: req.body.drive,
      redemption: req.body.redemption,
      chronicle: req.body.chronicle,
      touchstones: req.body.touchstones,
      attributes: req.body.attributes,
      skills: req.body.skills,
      health: req.body.health,
      willpower: req.body.willpower,
      remaining_specialties: req.body.remainingSpecialties,
      edges: req.body.edgeArr,
      xp: req.body.xp,
      spentXp: req.body.spentXp,
      specialties: req.body.specialties,
      advantages: req.body.advantages,
      advantages_remaining: req.body.advantages_remaining,
      flaws_remaining: req.body.flaws_remaining,
      updatedAt: Date.now(),
    });

    res.status(200).send("Kindred updated!");
  } catch (err) {
    res.status(404).send(err);
  }
});

router.route("/delete/:id").delete(lib.limiter, async (req, res) => {
  try {
    let currentUser = lib.getCurrentUser(req, res);

    const hunter = await Hunters.findByPk(req.params.id);

    if (currentUser.id !== hunter.created_by) {
      return;
    }
    hunter.destroy();
    res.status(200).send("Deletion successful");
  } catch (err) {
    res.status(404).send(err);
  }
});

module.exports = router; //Exports our routes
