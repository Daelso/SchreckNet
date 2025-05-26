import { INTEGER, STRING } from "sequelize";
import { sequelize } from "../../database";

const Editions = sequelize.define(
  "editions",
  {
    edition_id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    edition_name: {
      type: STRING,
      allowNull: false,
    },
  },
  { timestamps: false, underscored: true }
);

export default Editions;
