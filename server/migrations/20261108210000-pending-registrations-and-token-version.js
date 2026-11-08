"use strict";

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Sign-ups wait here until the activation link is clicked, so the
      // register form behaves the same whether or not the email is taken.
      await queryInterface.createTable(
        "pending_registrations",
        {
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
        },
        { transaction }
      );
      await queryInterface.addIndex("pending_registrations", ["username"], {
        transaction,
      });
      await queryInterface.addIndex("pending_registrations", ["expires_at"], {
        transaction,
      });

      // Bumped on password reset; refresh tokens carrying an older value stop
      // working. INT (not JSON), so a plain default is fine on MySQL 5.7.
      await queryInterface.addColumn(
        "users",
        "token_version",
        { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
        { transaction }
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn("users", "token_version", {
        transaction,
      });
      await queryInterface.dropTable("pending_registrations", { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
