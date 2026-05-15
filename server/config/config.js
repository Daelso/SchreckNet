require("dotenv").config();

// sequelize-cli selects a section by NODE_ENV (development by default).
// The app itself uses process.env.ENV (DEV|prod) for its own runtime flags;
// the two env-var conventions coexist intentionally.
const base = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT || 3306,
  dialect:  "mysql",
};

module.exports = {
  development: base,
  production:  base,
};
