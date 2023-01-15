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
    console.log(params);
    let baseQuery = "SELECT * FROM login.vampires WHERE 1=1";
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

    res.status(200).send(results);
  } catch (err) {
    res.status(404).send(err);
  }
});

module.exports = router; //Exports our routes
