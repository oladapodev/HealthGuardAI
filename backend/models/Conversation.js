import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Conversation = sequelize.define("Conversation", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "active",
  },
  messages: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  state: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
});

export { Conversation };
