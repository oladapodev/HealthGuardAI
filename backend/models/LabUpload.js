import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const LabUpload = sequelize.define("LabUpload", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mimeType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  extractedText: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  parsedResults: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
});

export { LabUpload };
