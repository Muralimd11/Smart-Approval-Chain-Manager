const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const log = (msg) => {
    console.log(msg);
};

const logError = (err) => {
    console.error(err);
};

log(`Starting script...`);
log(`Mongo URI: ${process.env.MONGO_URI ? 'Found' : 'Missing'}`);

if (!process.env.MONGO_URI) {
    logError('MONGO_URI is missing from .env');
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        log('Connected to MongoDB');

        // Fetch all users
        const users = await User.find({}, '-password').sort('role name');

        log('='.repeat(80));
        log('ALL USERS IN SYSTEM (DEBUG DUMP)');
        log('='.repeat(80));

        users.forEach((user, index) => {
            log(`${index + 1}. ${user.name}`);
            log(`   ID: ${user._id}`);
            log(`   Email: ${user.email}`);
            log(`   Role: ${user.role}`);
            log(`   Department: "${user.department}"`);
            log('');
        });

        log('='.repeat(80));
        log(`TOTAL USERS: ${users.length}`);
        log('='.repeat(80));

        process.exit(0);
    })
    .catch(err => {
        logError(err);
        process.exit(1);
    });