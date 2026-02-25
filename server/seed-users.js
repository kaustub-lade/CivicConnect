// Seed script to create test users in MongoDB
// Run this with: node seed-users.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// User Schema (matching your User model)
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['citizen', 'volunteer', 'admin', 'authority'],
    default: 'citizen',
  },
  volunteeredOpportunities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VolunteerOpportunity',
  }],
  points: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);

// Test users to create
const testUsers = [
  {
    name: 'Test Citizen',
    email: 'citizen@test.com',
    password: 'Pass123!',
    role: 'citizen',
    points: 50,
  },
  {
    name: 'Test Authority',
    email: 'authority@test.com',
    password: 'Pass123!',
    role: 'authority',
    points: 100,
  },
  {
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'Pass123!',
    role: 'admin',
    points: 200,
  },
  {
    name: 'John Volunteer',
    email: 'volunteer@test.com',
    password: 'Pass123!',
    role: 'volunteer',
    points: 150,
  },
];

async function seedUsers() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if users already exist
    console.log('\n🔍 Checking for existing users...');
    const existingUsers = await User.find({
      email: { $in: testUsers.map(u => u.email) }
    });

    if (existingUsers.length > 0) {
      console.log('⚠️  Found existing users:');
      existingUsers.forEach(user => {
        console.log(`   - ${user.email} (${user.role})`);
      });
      console.log('\n🗑️  Deleting existing test users...');
      await User.deleteMany({
        email: { $in: testUsers.map(u => u.email) }
      });
      console.log('✅ Deleted existing test users');
    }

    // Create new users with hashed passwords
    console.log('\n👥 Creating test users...');
    const createdUsers = [];

    for (const userData of testUsers) {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Create user
      const user = await User.create({
        ...userData,
        password: hashedPassword,
      });

      createdUsers.push(user);
      console.log(`✅ Created: ${user.email} (${user.role}) - Points: ${user.points}`);
    }

    console.log('\n🎉 Successfully created all test users!');
    console.log('\n📝 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    testUsers.forEach(user => {
      console.log(`\n${user.role.toUpperCase()}:`);
      console.log(`  Email:    ${user.email}`);
      console.log(`  Password: ${user.password}`);
      console.log(`  Points:   ${user.points}`);
    });
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('✨ Database seeded successfully!');
    console.log('🚀 You can now login with any of the accounts above.\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the seed function
seedUsers();
