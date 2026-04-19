const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const adminExists = await User.findOne({ email: 'admin@gmail.com' });
        if (!adminExists) {
            await User.create({
                name: 'Admin',
                email: 'admin@gmail.com',
                password: 'admin1218',
                role: 'admin',
                department: 'Administration'
            });
            console.log('Admin account created successfully.');
        } else {
            console.log('Admin account already exists.');
        }
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
};

seedDB();
