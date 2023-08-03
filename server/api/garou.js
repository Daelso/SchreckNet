const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
const { Op } = require("sequelize");

let router = express.Router();
router.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const Tribes = require("../models/Tribes.js");
const Auspices = require("../models/Auspices.js");

const lib = require("../lib");
const RenownTypes = require("../models/RenownTypes.js");
const NativeGifts = require("../models/NativeGifts.js");

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

router.route("/native_gifts").get(lib.getLimiter, async (req, res) => {
  try {
    const native_gifts = await NativeGifts.findAll({
      where: {
        renown_level: {
          [Op.lte]: 2,
        },
      },
    });
    res.json(native_gifts);
  } catch (err) {
    res.status(404).send(err);
  }
});

module.exports = router; //Exports our routes
