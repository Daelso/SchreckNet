const Sequelize = require("sequelize");
const db = require("../database");

// Sign-ups that haven't clicked their activation link yet. A row becomes a
// real user on activation and is ignored once expires_at has passed.
const PendingRegistrations = db.sequelize.define("pending_registrations", {
  pending_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  username: { type: Sequelize.STRING, allowNull: false },
  email: { type: Sequelize.STRING, allowNull: false },
  password: { type: Sequelize.STRING, allowNull: false },
  terms_accepted: { type: Sequelize.INTEGER, allowNull: false },
  expires_at: { type: Sequelize.DATE, allowNull: false },
  createdAt: { type: Sequelize.DATE, allowNull: false },
  updatedAt: { type: Sequelize.DATE, allowNull: false },
});

module.exports = PendingRegistrations;
