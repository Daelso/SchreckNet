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
      image_link: sanitizeImageLink(req.body.imgLink),
      advantages_remaining: req.body.advantages_remaining,
      flaws_remaining: req.body.flaws_remaining,
      created_by: currentUser,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return res.status(200).json(newHunter.id);
  } catch (err) {
    console.log(err);
    return res.status(403).send("Forbidden");
  }
});

router.route("/hunter/:id").get(async (req, res) => {
  try {
    const hunter = await Hunters.findByPk(req.params.id);
    return res.send(hunter.dataValues);
  } catch (err) {
    console.log(err);
    return res.status(404).send("Not found");
  }
});

router.route("/myHunter/:id").get(async (req, res) => {
  try {
    const hunter = await Hunters.findAll({
      where: {
        created_by: req.params.id,
      },
    });
    return res.status(200).send(hunter);
  } catch (err) {
    console.log(err);
    return res.status(404).send("Not found");
  }
});

router.route("/card").get(async (req, res) => {
  try {
    const hunter = await Hunters.findAll({
      limit: 3,
      order: [["createdAt", "DESC"]],
    });
    return res.send(hunter);
  } catch (err) {
    console.log(err);
    return res.status(404).send("Not found");
  }
});

router.route("/hunter/edit/:id").put(lib.postLimiter, async (req, res) => {
  try {
    const currentUser = lib.getCurrentUser(req, res);

    const hunter = await Hunters.findByPk(req.params.id);

    if (currentUser.id !== hunter.created_by) {
      return res.status(403).send("Access Denied");
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
      image_link: sanitizeImageLink(req.body.imgLink),
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

    return res.status(200).send("Hunter updated!");
  } catch (err) {
    console.log(err);
    return res.status(404).send("Not found");
  }
});

router.route("/delete/:id").delete(lib.limiter, async (req, res) => {
  try {
    let currentUser = lib.getCurrentUser(req, res);

    const hunter = await Hunters.findByPk(req.params.id);

    if (currentUser.id !== hunter.created_by) {
      return;
    }
    await hunter.destroy();
    return res.status(200).send("Deletion successful");
  } catch (err) {
    console.log(err);
    return res.status(404).send("Not found");
  }
});

function sanitizeImageLink(urlString) {
  try {
    const url = new URL(urlString);
    const allowedHosts = ["i.imgur.com", "imgur.com"];
    const isHostAllowed = allowedHosts.some((host) =>
      url.hostname.includes(host)
    );

    const isImageFile = /\.(jpg|jpeg|png|gif|webp)$/i.test(url.pathname);

    if (isHostAllowed && isImageFile) {
      return url.toString();
    }

    return null;
  } catch (err) {
    return null;
  }
}

module.exports = router; //Exports our routes
