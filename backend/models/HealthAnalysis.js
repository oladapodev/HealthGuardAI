import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const HealthAnalysis = sequelize.define("HealthAnalysis", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  labUploadId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  input: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  structured: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  context: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  patientSummary: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  clinicianSummary: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  colorCodedLabs: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  safetyAlerts: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  riskFactors: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  nextQuestions: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  agentTrace: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "completed",
  },
});

export { HealthAnalysis };
