const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();

let router = express.Router();
router.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const Tribes = require("../models/Tribes.js");
const Auspices = require("../models/Auspices.js");

const lib = require("../lib");
const RenownTypes = require("../models/RenownTypes.js");

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

module.exports = router; //Exports our routes
