const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
const sequelize = require("../database");
let router = express.Router();
router.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const lib = require("../lib");

//Route is base/search/

router.route("/vampires").post(async (req, res) => {
  try {
    const params = req.body.searchParams;
    let baseQuery = "SELECT * FROM ey140u9j4rs9xcib.vampires WHERE 1=1";
    if (params.user) {
      baseQuery += ` AND created_by = ${params.user}`;
    }
    if (params.clan) {
      baseQuery += ` AND clan = "${params.clan}"`;
    }
    if (params.predator) {
      baseQuery += ` AND predator_type = "${params.predator}"`;
    }
    const [results, metadata] = await sequelize.sequelize.query(baseQuery);

    return res.status(200).send(results);
  } catch (err) {
    console.log(err);
    return res.status(404).send("Not found");
  }
});

router.route("/hunters").post(async (req, res) => {
  try {
    const params = req.body.searchParams;
    let baseQuery = "SELECT * FROM ey140u9j4rs9xcib.hunters WHERE 1=1";
    if (params.user) {
      baseQuery += ` AND created_by = ${params.user}`;
    }
    if (params.drive) {
      baseQuery += ` AND drive->"$.name" = "${params.drive.name}"`;
    }
    if (params.creed) {
      baseQuery += ` AND creed->"$.name" = "${params.creed.name}"`;
    }

    const [results, metadata] = await sequelize.sequelize.query(baseQuery);

    return res.status(200).send(results);
  } catch (err) {
    console.log(err);
    return res.status(404).send("Not found");
  }
});

router.route("/garou").post(async (req, res) => {
  try {
    const params = req.body.searchParams;
    let baseQuery = "SELECT * FROM ey140u9j4rs9xcib.garou WHERE 1=1";
    if (params.user) {
      baseQuery += ` AND created_by = ${params.user}`;
    }
    if (params.tribe) {
      baseQuery += ` AND tribe->"$.tribe_id" = "${params.tribe.tribe_id}"`;
    }
    if (params.auspice) {
      baseQuery += ` AND auspice->"$.auspice_id" = "${params.auspice.auspice_id}"`;
    }

    const [results, metadata] = await sequelize.sequelize.query(baseQuery);

    return res.status(200).send(results);
  } catch (err) {
    console.log(err);
    return res.status(404).send("Not found");
  }
});

module.exports = router; //Exports our routes
