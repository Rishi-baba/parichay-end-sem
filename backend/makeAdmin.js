require('dotenv').config();
const User = require('./src/models/user');
const connectdb = require('./src/config/db');

const email = process.argv[2] || 'isha@gmail.com';

const run = async () => {
  try {
    await connectdb();
    const user = await User.findOneAndUpdate(
      { email }, 
      { role: 'admin' }, 
      { new: true }
    );
    if (user) {
      console.log(`Successfully elevated ${email} to admin!`);
    } else {
        console.log(`User with email ${email} not found. Use: node makeAdmin.js <your_email>`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
};

run();
