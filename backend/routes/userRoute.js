import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// 🟢 REGISTER / ONBOARD
router.post('/register', async (req, res) => {
    try {
        const { email, password, profile } = req.body;
        
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            email,
            password: hashedPassword,
            profile: profile || {}
        });

        await user.save();
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '30d' });
        res.status(201).json({ token, user: { id: user._id, email: user.email, profile: user.profile } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🟢 LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '30d' });
        res.json({ token, user: { id: user._id, email: user.email, profile: user.profile } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🟢 GET/UPDATE PROFILE
router.get('/profile', auth, async (req, res) => {
    const user = await User.findById(req.user).select('-password');
    res.json(user);
});

router.put('/profile', auth, async (req, res) => {
    const { profile } = req.body;
    const user = await User.findByIdAndUpdate(req.user, { profile }, { new: true }).select('-password');
    res.json(user);
});

// 🟢 DAILY CHECK-IN
router.post('/checkin', auth, async (req, res) => {
    const { log } = req.body;
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.dailyLogs.push(log);
    await user.save();
    res.json({ success: true, logs: user.dailyLogs });
});

export default router;
