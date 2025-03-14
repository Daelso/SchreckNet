const express = require("express");
const sequelize = require("../database");
const { QueryTypes } = require("sequelize");
let router = express.Router();

const SCHEMA = "ey140u9j4rs9xcib";

/**
 * Generic search function for different tables with pagination (most recent first)
 */
async function searchTable(table, conditions, page = 1, res) {
  try {
    const queryConditions = [];
    const queryParams = {};

    // Build the query conditions based on the provided filters
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

    // Set the limit to 25 results per page
    const limit = 25;
    const offset = (page - 1) * limit;

    const query = `
      SELECT * FROM ${SCHEMA}.${table}
      ${queryConditions.length ? "WHERE " + queryConditions.join(" AND ") : ""}
      ORDER BY createdAt DESC
      LIMIT :limit OFFSET :offset
    `;

    queryParams.limit = limit;
    queryParams.offset = offset;

    const results = await sequelize.sequelize.query(query, {
      replacements: queryParams,
      type: QueryTypes.SELECT,
    });

    // Query to fetch total count for pagination
    const countQuery = `
      SELECT COUNT(*) AS totalCount FROM ${SCHEMA}.${table}
      ${queryConditions.length ? "WHERE " + queryConditions.join(" AND ") : ""}
    `;

    const countResults = await sequelize.sequelize.query(countQuery, {
      replacements: queryParams,
      type: QueryTypes.SELECT,
    });
    const resultsPerPage = 25;
    const totalCount = countResults[0].totalCount;
    const totalPages = Math.ceil(totalCount / resultsPerPage);

    return res.status(200).json({ results: results, total_pages: totalPages });
  } catch (err) {
    console.error(`Error fetching ${table}:`, err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Search Routes with pagination support (most recent first)
router.post("/vampires", async (req, res) => {
  const params = req.body.searchParams || {};
  const page = parseInt(req.body.searchParams.page) || 1;

  return searchTable(
    "vampires",
    {
      created_by: params.user,
      clan: params.clan,
      predator_type: params.predator,
    },
    page,
    res
  );
});

router.post("/hunters", async (req, res) => {
  const params = req.body.searchParams || {};
  const page = parseInt(req.body.searchParams.page) || 1;
  return searchTable(
    "hunters",
    {
      created_by: params.user,
      "drive.name": params.drive?.name,
      "creed.name": params.creed?.name,
    },
    page,
    res
  );
});

router.post("/garou", async (req, res) => {
  const params = req.body.searchParams || {};
  const page = parseInt(req.body.searchParams.page) || 1;
  return searchTable(
    "garou",
    {
      created_by: params.user,
      "tribe.tribe_id": params.tribe?.tribe_id,
      "auspice.auspice_id": params.auspice?.auspice_id,
    },
    page,
    res
  );
});

module.exports = router;
