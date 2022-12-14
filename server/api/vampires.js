const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();

let router = express.Router();
router.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const Vampires = require("../models/vampires");
const lib = require("../lib");

//Route is base/vampires/
router.route("/new").post(async (req, res) => {
  try {
    let currentUser = lib.getCurrentUser(req, res);

    if (currentUser !== null) {
      currentUser = currentUser.id;
    }
    const newKindred = await Vampires.create({
      charName: req.body.name,
      clan: req.body.clan,
      concept: req.body.concept,
      ambition: req.body.ambition,
      desire: req.body.desire,
      archetype: req.body.archetype,
      sect: req.body.sect,
      chronicle: req.body.chronicle,
      sireName: req.body.sireName,
      convictions: req.body.convictions,
      touchstones: req.body.touchstones,
      attributes: req.body.attributes,
      skills: req.body.skills,
      age: req.body.age,
      generation: req.body.generation,
      predator_type: req.body.predatorType,
      cult: req.body.cult,
      health: req.body.health,
      willpower: req.body.willpower,
      remaining_specialties: req.body.remainingSpecialties,
      potency: req.body.potency,
      max_potency: req.body.maxPotency,
      disciplines: req.body.disciplines,
      discipline_skills: req.body.disciplineSkills,
      xp: req.body.xp,
      specialties: req.body.specialties,
      advantages: req.body.advantages,
      advantages_remaining: req.body.advantages_remaining,
      flaws_remaining: req.body.flaws_remaining,
      humanity: req.body.humanity,
      created_by: currentUser,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    res.status(200).json(newKindred.id);
  } catch (err) {
    res.status(403).send(err);
  }
});

router.route("/vampire/:id").get(async (req, res) => {
  try {
    const kindred = await Vampires.findByPk(req.params.id);
    res.send(kindred.dataValues);
  } catch (err) {
    res.status(404).send(err);
  }
});

router.route("/myVampire/:id").get(async (req, res) => {
  try {
    const kindred = await Vampires.findAll({
      where: {
        created_by: req.params.id,
      },
    });
    res.status(200).send(kindred);
  } catch (err) {
    res.status(404).send(err);
  }
});

router.route("/card").get(async (req, res) => {
  try {
    const kindred = await Vampires.findAll({
      limit: 3,
      order: [["createdAt", "DESC"]],
    });
    res.send(kindred);
  } catch (err) {
    res.status(404).send(err);
  }
});

module.exports = router; //Exports our routes
