import { User } from "./User.js";
import { DailyCheckin } from "./DailyCheckin.js";
import { LabUpload } from "./LabUpload.js";
import { HealthAnalysis } from "./HealthAnalysis.js";
import { Conversation } from "./Conversation.js";

User.hasMany(DailyCheckin, { foreignKey: "userId", as: "checkins" });
DailyCheckin.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(LabUpload, { foreignKey: "userId", as: "labUploads" });
LabUpload.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(HealthAnalysis, { foreignKey: "userId", as: "analyses" });
HealthAnalysis.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(Conversation, { foreignKey: "userId", as: "conversations" });
Conversation.belongsTo(User, { foreignKey: "userId", as: "user" });

LabUpload.hasMany(HealthAnalysis, { foreignKey: "labUploadId", as: "analyses" });
HealthAnalysis.belongsTo(LabUpload, { foreignKey: "labUploadId", as: "labUpload" });

export { User, DailyCheckin, LabUpload, HealthAnalysis, Conversation };
