import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const DailyCheckin = sequelize.define("DailyCheckin", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  mood: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  symptoms: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  foodTags: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  sleep: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  exercise: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
});

export { DailyCheckin };
