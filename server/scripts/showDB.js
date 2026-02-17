const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Request = require('../models/Request');

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Fetch Users and group by role
        const users = await User.find({}).sort({ department: 1, name: 1 });

        const employees = users.filter(u => u.role === 'employee');
        const teamLeads = users.filter(u => u.role === 'teamlead');
        const managers = users.filter(u => u.role === 'manager');

        const fs = require('fs');
        const path = require('path');
        const outputFile = path.join(__dirname, '..', '..', 'db_directory.txt');

        let output = '';
        const log = (msg) => output += msg + '\n';

        log('\n' + '='.repeat(60));
        log('                   USER DIRECTORY');
        log('='.repeat(60));

        const printUser = (u) => {
            log(`  - Name:   ${u.name}`);
            log(`    Email:  ${u.email}`);
            log(`    Dept:   ${u.department || 'N/A'}`);
            log('');
        };

        log(`\n--- EMPLOYEES (${employees.length}) ---`);
        employees.forEach(printUser);

        log(`\n--- TEAM LEADS (${teamLeads.length}) ---`);
        teamLeads.forEach(printUser);

        log(`\n--- MANAGERS (${managers.length}) ---`);
        managers.forEach(printUser);

        log('='.repeat(60) + '\n');

        fs.writeFileSync(outputFile, output);
        console.log(`Directory written to ${outputFile}`);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

run();
