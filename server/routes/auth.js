import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Create new user
        const user = new User({
            username,
            password,
            role: 'user'
        });

        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check for admin credentials
        if (username === 'admin' && password === 'admin123') {
            // Check if admin user exists
            let adminUser = await User.findOne({ username: 'admin' });

            if (!adminUser) {
                // Create admin user
                adminUser = new User({
                    username: 'admin',
                    password: 'admin123',
                    role: 'admin'
                });
                await adminUser.save();
            }

            // Generate token for admin
            const token = jwt.sign(
                { userId: adminUser._id, role: 'admin' },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            return res.json({
                message: 'Login successful',
                token,
                user: {
                    id: adminUser._id,
                    username: adminUser.username,
                    role: 'admin'
                }
            });
        }

        // Regular user login
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
