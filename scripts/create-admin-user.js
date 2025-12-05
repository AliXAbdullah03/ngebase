/**
 * Script to create a default admin user
 * Run this with: node scripts/create-admin-user.js
 * 
 * Make sure your .env.local has MONGODB_URI set
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not set in .env.local');
  process.exit(1);
}

// User Schema (simplified)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: String,
  roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
  status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
  lastLogin: Date,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Role Schema (simplified)
const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  permissions: [String],
}, { timestamps: true });

const Role = mongoose.model('Role', roleSchema);

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      dbName: 'nge',
    });
    console.log('Connected to MongoDB');

    // Find or create Super Admin role
    let superAdminRole = await Role.findOne({ name: 'Super Admin' });
    if (!superAdminRole) {
      superAdminRole = await Role.create({
        name: 'Super Admin',
        description: 'Full system access',
        permissions: [
          'order:create',
          'order:modify',
          'order:delete',
          'order:view',
          'shipment:status_update',
          'shipment:bulk_update',
          'shipment:view',
          'user:create',
          'user:modify',
          'user:delete',
          'user:view',
          'frontend:edit',
          'frontend:reviews',
          'settings:modify',
        ],
      });
      console.log('Created Super Admin role');
    }

    // Check if admin user already exists
    const existingUser = await User.findOne({ email: 'admin@nge.com' });
    if (existingUser) {
      console.log('Admin user already exists!');
      console.log('Email: admin@nge.com');
      console.log('To reset password, delete the user and run this script again.');
      await mongoose.disconnect();
      return;
    }

    // Hash password
    const defaultPassword = 'admin123'; // Change this after first login!
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Create admin user
    const adminUser = await User.create({
      email: 'admin@nge.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      phone: '+1234567890',
      roleId: superAdminRole._id,
      status: 'active',
    });

    console.log('\n✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email: admin@nge.com');
    console.log('Password: admin123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  IMPORTANT: Change the password after first login!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error creating admin user:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

createAdminUser();


