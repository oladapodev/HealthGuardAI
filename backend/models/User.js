import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: {
        firstName: String,
        lastName: String,
        age: Number,
        gender: { type: String, enum: ['male', 'female', 'other', 'prefer-not-to-say'] },
        bloodGroup: String,
        height: Number, // in cm
        weight: Number, // in kg
        conditions: [String],
        allergies: [String],
        medications: [String],
        menstrualCycle: {
            lastPeriodDate: Date,
            cycleLength: { type: Number, default: 28 },
            active: { type: Boolean, default: false }
        }
    },
    dailyLogs: [{
        date: { type: Date, default: Date.now },
        mood: String,
        symptoms: [String],
        foodTags: [String],
        sleepHours: Number,
        exercise: String,
        notes: String
    }],
    createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', UserSchema);
