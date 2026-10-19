import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const VALID_CATEGORIES = ["อบรม", "สัมมนา", "จิตอาสา"];

const Event = sequelize.define(
  "Event",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 150],
      },
    },
    organizer: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100],
      },
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
        isIn: {
          args: [VALID_CATEGORIES],
          msg: "Category must be one of: อบรม, สัมมนา, จิตอาสา",
        },
      },
    },
    eventDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: true,
        isDate: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 2000],
      },
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "events",
    timestamps: true,
  },
);

export const VALID_EVENT_CATEGORIES = VALID_CATEGORIES;
export default Event;
