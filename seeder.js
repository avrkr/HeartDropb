import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const seedAdmin = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'test@gmail.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Test@123';

        const userExists = await User.findOne({ email: adminEmail });

        if (userExists) {
            console.log('Admin user already exists');
            process.exit();
        }

        const user = await User.create({
            email: adminEmail,
            password: adminPassword,
            isVerified: true,
            role: 'admin',
            publicAliases: ['Admin'],
            currentAlias: 'Admin',
            gender: 'other',
            dateOfBirth: new Date(),
        });

        console.log('Admin user created successfully');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedAdmin();
