const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
const sequelize = require("../database");
const { QueryTypes } = require("sequelize");
let router = express.Router();

router.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const SCHEMA = "ey140u9j4rs9xcib";

/**
 * Generic search function for different tables
 */
async function searchTable(table, conditions, res) {
  try {
    const queryConditions = [];
    const queryParams = {};

    for (const key in conditions) {
      if (conditions[key] && conditions[key] !== "") {
        if (key.includes(".")) {
          const [jsonCol, jsonKey] = key.split(".");
          const paramKey = key.replace(".", "_");
          queryConditions.push(
            `JSON_UNQUOTE(JSON_EXTRACT(${jsonCol}, '$.${jsonKey}')) = :${paramKey}`
          );
          queryParams[paramKey] = conditions[key];
        } else {
          queryConditions.push(`${key} = :${key}`);
          queryParams[key] = conditions[key];
        }
      }
    }

    const query = `
      SELECT * FROM ${SCHEMA}.${table}
      ${queryConditions.length ? "WHERE " + queryConditions.join(" AND ") : ""}
    `;

    const results = await sequelize.sequelize.query(query, {
      replacements: queryParams,
      type: QueryTypes.SELECT,
    });

    return res.status(200).json(results);
  } catch (err) {
    console.error(`Error fetching ${table}:`, err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Search Routes
router.post("/vampires", async (req, res) => {
  const params = req.body.searchParams || {};
  return searchTable(
    "vampires",
    {
      created_by: params.user,
      clan: params.clan,
      predator_type: params.predator,
    },
    res
  );
});

router.post("/hunters", async (req, res) => {
  const params = req.body.searchParams || {};
  return searchTable(
    "hunters",
    {
      created_by: params.user,
      "drive.name": params.drive?.name,
      "creed.name": params.creed?.name,
    },
    res
  );
});

router.post("/garou", async (req, res) => {
  const params = req.body.searchParams || {};
  return searchTable(
    "garou",
    {
      created_by: params.user,
      "tribe.tribe_id": params.tribe?.tribe_id,
      "auspice.auspice_id": params.auspice?.auspice_id,
    },
    res
  );
});

module.exports = router;
