# Backend Requirements Documentation
## Next Global Express - Logistics Management System

---

## Table of Contents
1. [Technology Stack](#technology-stack)
2. [Database Schema](#database-schema)
3. [API Endpoints](#api-endpoints)
4. [Authentication & Authorization](#authentication--authorization)
5. [File Upload System](#file-upload-system)
6. [Data Models](#data-models)
7. [Security Requirements](#security-requirements)
8. [API Response Format](#api-response-format)
9. [Error Handling](#error-handling)

---

## Technology Stack

### Recommended Stack:
- **Backend Framework**: Node.js with Express.js or Next.js API Routes
- **Database**: MongoDB (recommended) or PostgreSQL / MySQL
- **ODM/ORM**: Mongoose (for MongoDB) or Prisma / TypeORM (for SQL)
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: AWS S3 / Cloudinary / Local Storage
- **Validation**: Zod or Joi
- **Email Service**: Nodemailer / SendGrid
- **Real-time**: Socket.io (for tracking updates)

---

## Database Schema

> **Note**: This document provides schemas for both MongoDB (Mongoose) and SQL databases. Choose the one that fits your stack.

---

## MongoDB Schema (Mongoose Models)

### 1. Users Collection
```javascript
// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ roleId: 1 });
userSchema.index({ branchId: 1 });

module.exports = mongoose.model('User', userSchema);
```

### 2. Roles Collection
```javascript
// models/Role.js
const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String
  },
  permissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission'
  }]
}, {
  timestamps: true
});

roleSchema.index({ name: 1 });

module.exports = mongoose.model('Role', roleSchema);
```

### 3. Permissions Collection
```javascript
// models/Permission.js
const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String
  },
  resource: {
    type: String,
    required: true // shipments, users, orders, etc.
  },
  action: {
    type: String,
    required: true // create, read, update, delete
  }
}, {
  timestamps: true
});

permissionSchema.index({ resource: 1, action: 1 });

module.exports = mongoose.model('Permission', permissionSchema);
```

### 4. Branches Collection
```javascript
// models/Branch.js
const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  postalCode: {
    type: String
  },
  email: {
    type: String,
    lowercase: true
  },
  phone: {
    type: String
  },
  operatingTime: {
    type: String // "9 AM - 6 PM"
  },
  timeZone: {
    type: String // "UAE Time Zone (GMT+4)"
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Branch', branchSchema);
```

### 5. Customers Collection
```javascript
// models/Customer.js
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String
  },
  city: {
    type: String
  },
  country: {
    type: String
  },
  postalCode: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Indexes
customerSchema.index({ email: 1 });
customerSchema.index({ phone: 1 });
customerSchema.index({ status: 1 });

module.exports = mongoose.model('Customer', customerSchema);
```

### 6. Orders Collection
```javascript
// models/Order.js
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'refunded'],
    default: 'unpaid'
  },
  notes: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ customerId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
```

### 7. Shipments Collection
```javascript
// models/Shipment.js
const mongoose = require('mongoose');

const shipmentHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { _id: true });

const parcelSchema = new mongoose.Schema({
  itemsDescription: {
    type: String,
    required: true
  },
  weight: {
    type: Number,
    required: true,
    min: 0
  },
  weightUnit: {
    type: String,
    default: 'kg'
  },
  dimensions: {
    type: String // "LxWxH"
  },
  value: {
    type: Number,
    min: 0
  }
}, { _id: true });

const shipmentSchema = new mongoose.Schema({
  trackingId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  shipperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  invoiceNumber: {
    type: String,
    trim: true
  },
  batchNumber: {
    type: String,
    trim: true
  },
  departureDate: {
    type: Date
  },
  estimatedDeliveryDate: {
    type: Date
  },
  currentStatus: {
    type: String,
    enum: ['Processing', 'In Transit', 'Out for Delivery', 'Delivered', 'On Hold'],
    default: 'Processing'
  },
  originBranchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch'
  },
  destinationBranchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch'
  },
  parcels: [parcelSchema],
  history: [shipmentHistorySchema],
  totalWeight: {
    type: Number,
    min: 0
  },
  weightUnit: {
    type: String,
    default: 'kg'
  },
  shippingCost: {
    type: Number,
    min: 0
  },
  insuranceAmount: {
    type: Number,
    min: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
shipmentSchema.index({ trackingId: 1 });
shipmentSchema.index({ currentStatus: 1 });
shipmentSchema.index({ orderId: 1 });
shipmentSchema.index({ batchNumber: 1 });
shipmentSchema.index({ shipperId: 1 });
shipmentSchema.index({ receiverId: 1 });
shipmentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Shipment', shipmentSchema);
```

### 8. Website Images Collection
```javascript
// models/WebsiteImage.js
const mongoose = require('mongoose');

const websiteImageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true
  },
  storagePath: {
    type: String // S3 path or local path
  },
  imageType: {
    type: String,
    enum: ['hero', 'service', 'testimonial', 'other'],
    default: 'hero'
  },
  altText: {
    type: String
  },
  orderIndex: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

websiteImageSchema.index({ imageType: 1, isActive: 1 });
websiteImageSchema.index({ orderIndex: 1 });

module.exports = mongoose.model('WebsiteImage', websiteImageSchema);
```

### 9. Site Settings Collection
```javascript
// models/SiteSetting.js
const mongoose = require('mongoose');

const siteSettingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  value: {
    type: String
  },
  type: {
    type: String,
    enum: ['text', 'email', 'url', 'json'],
    default: 'text'
  },
  category: {
    type: String,
    enum: ['general', 'contact', 'social'],
    default: 'general'
  }
}, {
  timestamps: { createdAt: false, updatedAt: true }
});

siteSettingSchema.index({ key: 1 });
siteSettingSchema.index({ category: 1 });

module.exports = mongoose.model('SiteSetting', siteSettingSchema);
```

### 10. Hub Information Collection
```javascript
// models/HubInformation.js
const mongoose = require('mongoose');

const hubInformationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true
  },
  email: {
    type: String,
    lowercase: true
  },
  phone: {
    type: String
  },
  operatingTime: {
    type: String // "9 AM - 6 PM"
  },
  timeZone: {
    type: String // "UAE Time Zone (GMT+4)"
  },
  mapUrl: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

hubInformationSchema.index({ isActive: 1, displayOrder: 1 });

module.exports = mongoose.model('HubInformation', hubInformationSchema);
```

### MongoDB Connection Setup
```javascript
// config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### MongoDB Environment Variables
```env
MONGODB_URI=mongodb://localhost:27017/nge_db
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nge_db?retryWrites=true&w=majority
```

---

## SQL Database Schema (PostgreSQL/MySQL)

### 1. Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  role_id UUID REFERENCES roles(id),
  branch_id UUID REFERENCES branches(id),
  status VARCHAR(20) DEFAULT 'active', -- active, inactive, suspended
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Roles Table
```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL, -- Super Admin, Admin, Manager, Staff
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Permissions Table
```sql
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL, -- manage_shipments, manage_users, etc.
  description TEXT,
  resource VARCHAR(50) NOT NULL, -- shipments, users, orders, etc.
  action VARCHAR(50) NOT NULL -- create, read, update, delete
);
```

### 4. Role_Permissions Table (Many-to-Many)
```sql
CREATE TABLE role_permissions (
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);
```

### 5. Branches Table
```sql
CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20),
  email VARCHAR(255),
  phone VARCHAR(20),
  operating_time VARCHAR(100), -- "9 AM - 6 PM"
  time_zone VARCHAR(50), -- "UAE Time Zone (GMT+4)"
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6. Customers Table
```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20) NOT NULL,
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  postal_code VARCHAR(20),
  status VARCHAR(20) DEFAULT 'active', -- active, inactive
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 7. Orders Table
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL, -- ORD-1001
  customer_id UUID REFERENCES customers(id),
  branch_id UUID REFERENCES branches(id),
  total_amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, cancelled
  payment_status VARCHAR(20) DEFAULT 'unpaid', -- unpaid, paid, refunded
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 8. Shipments Table
```sql
CREATE TABLE shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_id VARCHAR(50) UNIQUE NOT NULL, -- NGE12345678
  order_id UUID REFERENCES orders(id),
  shipper_id UUID REFERENCES customers(id),
  receiver_id UUID REFERENCES customers(id),
  invoice_number VARCHAR(50),
  batch_number VARCHAR(50),
  departure_date TIMESTAMP,
  estimated_delivery_date TIMESTAMP,
  current_status VARCHAR(50) DEFAULT 'Processing', -- Processing, In Transit, Out for Delivery, Delivered, On Hold
  origin_branch_id UUID REFERENCES branches(id),
  destination_branch_id UUID REFERENCES branches(id),
  total_weight DECIMAL(10, 2),
  weight_unit VARCHAR(10) DEFAULT 'kg',
  shipping_cost DECIMAL(10, 2),
  insurance_amount DECIMAL(10, 2),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 9. Shipment_History Table
```sql
CREATE TABLE shipment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  location VARCHAR(255) NOT NULL,
  notes TEXT,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES users(id)
);
```

### 10. Parcels Table
```sql
CREATE TABLE parcels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE,
  items_description TEXT NOT NULL,
  weight DECIMAL(10, 2) NOT NULL,
  weight_unit VARCHAR(10) DEFAULT 'kg',
  dimensions VARCHAR(100), -- "LxWxH"
  value DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 11. Website_Images Table
```sql
CREATE TABLE website_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  storage_path TEXT, -- S3 path or local path
  image_type VARCHAR(50), -- hero, service, testimonial, etc.
  alt_text VARCHAR(255),
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 12. Site_Settings Table
```sql
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL, -- site_name, contact_email, etc.
  value TEXT,
  type VARCHAR(50), -- text, email, url, json
  category VARCHAR(50), -- general, contact, social
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 13. Hub_Information Table (Alternative to Branches or separate)
```sql
CREATE TABLE hub_information (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  operating_time VARCHAR(100),
  time_zone VARCHAR(50),
  map_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## API Endpoints

### Authentication Endpoints

#### POST `/api/auth/login`
**Description**: Admin login
**Request Body**:
```json
{
  "email": "admin@nge.com",
  "password": "password123"
}
```
**Response**:
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "uuid",
      "email": "admin@nge.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "Super Admin"
    }
  }
}
```

#### POST `/api/auth/logout`
**Description**: Logout user
**Headers**: `Authorization: Bearer {token}`

#### POST `/api/auth/refresh`
**Description**: Refresh access token
**Request Body**:
```json
{
  "refreshToken": "refresh_token_here"
}
```

---

### Dashboard Endpoints

#### GET `/api/dashboard/stats`
**Description**: Get dashboard statistics
**Headers**: `Authorization: Bearer {token}`
**Response**:
```json
{
  "success": true,
  "data": {
    "totalCustomers": 1234,
    "activeOrders": 456,
    "inTransit": 789,
    "totalRevenue": 125430.50,
    "recentOrders": [...],
    "recentShipments": [...]
  }
}
```

---

### Customer Management Endpoints

#### GET `/api/customers`
**Description**: Get all customers with pagination and search
**Query Parameters**: 
- `page` (default: 1)
- `limit` (default: 10)
- `search` (optional)
- `status` (optional: active, inactive)
**Headers**: `Authorization: Bearer {token}`
**Response**:
```json
{
  "success": true,
  "data": {
    "customers": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

#### GET `/api/customers/:id`
**Description**: Get customer by ID
**Headers**: `Authorization: Bearer {token}`

#### POST `/api/customers`
**Description**: Create new customer
**Headers**: `Authorization: Bearer {token}`
**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "address": "123 Main St",
  "city": "New York",
  "country": "USA",
  "postalCode": "10001"
}
```

#### PUT `/api/customers/:id`
**Description**: Update customer
**Headers**: `Authorization: Bearer {token}`
**Request Body**: Same as POST

#### DELETE `/api/customers/:id`
**Description**: Delete customer (soft delete recommended)
**Headers**: `Authorization: Bearer {token}`

---

### Orders Management Endpoints

#### GET `/api/orders`
**Description**: Get all orders
**Query Parameters**: 
- `page`, `limit`, `search`
- `status` (pending, processing, completed, cancelled)
- `customerId` (optional)
**Headers**: `Authorization: Bearer {token}`

#### GET `/api/orders/:id`
**Description**: Get order by ID
**Headers**: `Authorization: Bearer {token}`

#### POST `/api/orders`
**Description**: Create new order
**Headers**: `Authorization: Bearer {token}`
**Request Body**:
```json
{
  "customerId": "uuid",
  "branchId": "uuid",
  "items": [
    {
      "description": "Electronics",
      "quantity": 2,
      "price": 100.00
    }
  ],
  "totalAmount": 200.00,
  "notes": "Handle with care"
}
```

#### PUT `/api/orders/:id`
**Description**: Update order
**Headers**: `Authorization: Bearer {token}`

#### PUT `/api/orders/:id/status`
**Description**: Update order status
**Headers**: `Authorization: Bearer {token}`
**Request Body**:
```json
{
  "status": "processing",
  "notes": "Order is being processed"
}
```

#### DELETE `/api/orders/:id`
**Description**: Cancel/Delete order
**Headers**: `Authorization: Bearer {token}`

---

### Shipments Management Endpoints

#### GET `/api/shipments`
**Description**: Get all shipments
**Query Parameters**: 
- `page`, `limit`, `search`
- `status` (Processing, In Transit, Delivered, On Hold)
- `trackingId` (optional)
**Headers**: `Authorization: Bearer {token}`

#### GET `/api/shipments/:id`
**Description**: Get shipment by ID or tracking ID
**Headers**: `Authorization: Bearer {token}`

#### GET `/api/shipments/track/:trackingId`
**Description**: Public endpoint for tracking (no auth required)
**Response**:
```json
{
  "success": true,
  "data": {
    "shipment": {...},
    "history": [...],
    "parcels": [...]
  }
}
```

#### POST `/api/shipments`
**Description**: Create new shipment
**Headers**: `Authorization: Bearer {token}`
**Request Body**:
```json
{
  "orderId": "uuid",
  "shipperId": "uuid",
  "receiverId": "uuid",
  "invoiceNumber": "INV-2024-001",
  "batchNumber": "BCH-2024-001",
  "departureDate": "2024-08-15T09:00:00Z",
  "originBranchId": "uuid",
  "destinationBranchId": "uuid",
  "parcels": [
    {
      "itemsDescription": "Electronics",
      "weight": 5.0,
      "weightUnit": "kg"
    }
  ],
  "shippingCost": 150.00,
  "insuranceAmount": 50.00
}
```

#### PUT `/api/shipments/:id`
**Description**: Update shipment
**Headers**: `Authorization: Bearer {token}`

#### POST `/api/shipments/:id/status`
**Description**: Update shipment status and add to history
**Headers**: `Authorization: Bearer {token}`
**Request Body**:
```json
{
  "status": "In Transit",
  "location": "JFK Airport, USA",
  "notes": "Departed from origin facility"
}
```

#### DELETE `/api/shipments/:id`
**Description**: Delete shipment
**Headers**: `Authorization: Bearer {token}`

#### GET `/api/shipments/batch/:batchNumber`
**Description**: Get all shipments in a batch
**Headers**: `Authorization: Bearer {token}`

#### PUT `/api/shipments/batch/:batchNumber/status`
**Description**: Bulk update status for all shipments in a batch
**Headers**: `Authorization: Bearer {token}`
**Request Body**:
```json
{
  "status": "In Transit",
  "location": "Origin Facility",
  "notes": "Batch processed"
}
```

---

### Branch Management Endpoints

#### GET `/api/branches`
**Description**: Get all branches
**Query Parameters**: `status` (optional: active, inactive)
**Headers**: `Authorization: Bearer {token}`

#### GET `/api/branches/:id`
**Description**: Get branch by ID
**Headers**: `Authorization: Bearer {token}`

#### POST `/api/branches`
**Description**: Create new branch
**Headers**: `Authorization: Bearer {token}`
**Request Body**:
```json
{
  "name": "Dubai Hub",
  "address": "Warehouse 42, Al Quoz Industrial Area 3",
  "city": "Dubai",
  "country": "UAE",
  "postalCode": "00000",
  "email": "customercare@nge.ae",
  "phone": "+971 50 123 4567",
  "operatingTime": "9 AM - 6 PM",
  "timeZone": "UAE Time Zone (GMT+4)"
}
```

#### PUT `/api/branches/:id`
**Description**: Update branch
**Headers**: `Authorization: Bearer {token}`

#### DELETE `/api/branches/:id`
**Description**: Delete branch (soft delete)
**Headers**: `Authorization: Bearer {token}`

---

### Roles & Permissions Endpoints

#### GET `/api/roles`
**Description**: Get all roles with permissions
**Headers**: `Authorization: Bearer {token}`

#### GET `/api/roles/:id`
**Description**: Get role by ID with permissions
**Headers**: `Authorization: Bearer {token}`

#### POST `/api/roles`
**Description**: Create new role
**Headers**: `Authorization: Bearer {token}`
**Request Body**:
```json
{
  "name": "Manager",
  "description": "Management access",
  "permissionIds": ["uuid1", "uuid2", "uuid3"]
}
```

#### PUT `/api/roles/:id`
**Description**: Update role and permissions
**Headers**: `Authorization: Bearer {token}`

#### DELETE `/api/roles/:id`
**Description**: Delete role
**Headers**: `Authorization: Bearer {token}`

#### GET `/api/permissions`
**Description**: Get all available permissions
**Headers**: `Authorization: Bearer {token}`

---

### User Management Endpoints

#### GET `/api/users`
**Description**: Get all users
**Query Parameters**: 
- `page`, `limit`, `search`
- `roleId` (optional)
- `branchId` (optional)
- `status` (optional)
**Headers**: `Authorization: Bearer {token}`

#### GET `/api/users/:id`
**Description**: Get user by ID
**Headers**: `Authorization: Bearer {token}`

#### POST `/api/users`
**Description**: Create new user
**Headers**: `Authorization: Bearer {token}`
**Request Body**:
```json
{
  "email": "user@nge.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "roleId": "uuid",
  "branchId": "uuid"
}
```

#### PUT `/api/users/:id`
**Description**: Update user
**Headers**: `Authorization: Bearer {token}`

#### PUT `/api/users/:id/password`
**Description**: Change user password
**Headers**: `Authorization: Bearer {token}`
**Request Body**:
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

#### PUT `/api/users/:id/status`
**Description**: Update user status (active, inactive, suspended)
**Headers**: `Authorization: Bearer {token}`
**Request Body**:
```json
{
  "status": "inactive"
}
```

#### DELETE `/api/users/:id`
**Description**: Delete user (soft delete)
**Headers**: `Authorization: Bearer {token}`

---

### Website Images Management Endpoints

#### GET `/api/website/images`
**Description**: Get all website images
**Query Parameters**: 
- `type` (optional: hero, service, testimonial)
- `isActive` (optional: true, false)
**Headers**: `Authorization: Bearer {token}`

#### GET `/api/website/images/:id`
**Description**: Get image by ID
**Headers**: `Authorization: Bearer {token}`

#### POST `/api/website/images/upload`
**Description**: Upload new image
**Headers**: `Authorization: Bearer {token}`
**Request**: `multipart/form-data`
**Form Data**:
- `file`: Image file
- `name`: Image name
- `type`: Image type (hero, service, etc.)
- `altText`: Alt text for image
- `orderIndex`: Display order

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Hero Image 1",
    "url": "https://cdn.example.com/images/hero-1.jpg",
    "storagePath": "images/hero/hero-1.jpg"
  }
}
```

#### PUT `/api/website/images/:id`
**Description**: Update image metadata
**Headers**: `Authorization: Bearer {token}`
**Request Body**:
```json
{
  "name": "Updated Name",
  "altText": "Updated alt text",
  "orderIndex": 1,
  "isActive": true
}
```

#### DELETE `/api/website/images/:id`
**Description**: Delete image
**Headers**: `Authorization: Bearer {token}`

---

### Hub Information Endpoints

#### GET `/api/hubs`
**Description**: Get all hub information (public endpoint)
**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Dubai Hub",
      "address": "...",
      "email": "...",
      "phone": "...",
      "operatingTime": "...",
      "timeZone": "..."
    }
  ]
}
```

#### GET `/api/admin/hubs`
**Description**: Get all hubs (admin only)
**Headers**: `Authorization: Bearer {token}`

#### GET `/api/admin/hubs/:id`
**Description**: Get hub by ID
**Headers**: `Authorization: Bearer {token}`

#### POST `/api/admin/hubs`
**Description**: Create new hub
**Headers**: `Authorization: Bearer {token}`
**Request Body**:
```json
{
  "name": "Dubai Hub",
  "address": "Warehouse 42, Al Quoz Industrial Area 3, Dubai, UAE",
  "email": "customercare@nge.ae",
  "phone": "+971 50 123 4567",
  "operatingTime": "9 AM - 6 PM",
  "timeZone": "UAE Time Zone (GMT+4)",
  "mapUrl": "https://maps.google.com/..."
}
```

#### PUT `/api/admin/hubs/:id`
**Description**: Update hub
**Headers**: `Authorization: Bearer {token}`

#### DELETE `/api/admin/hubs/:id`
**Description**: Delete hub
**Headers**: `Authorization: Bearer {token}`

---

### Site Settings Endpoints

#### GET `/api/admin/settings`
**Description**: Get all site settings
**Query Parameters**: `category` (optional: general, contact, social)
**Headers**: `Authorization: Bearer {token}`

#### GET `/api/admin/settings/:key`
**Description**: Get specific setting by key
**Headers**: `Authorization: Bearer {token}`

#### PUT `/api/admin/settings`
**Description**: Update multiple settings
**Headers**: `Authorization: Bearer {token}`
**Request Body**:
```json
{
  "settings": [
    {
      "key": "site_name",
      "value": "Next Global Express"
    },
    {
      "key": "contact_email",
      "value": "customercare@nge.ae"
    },
    {
      "key": "facebook_url",
      "value": "https://facebook.com/nge"
    }
  ]
}
```

#### PUT `/api/admin/settings/:key`
**Description**: Update single setting
**Headers**: `Authorization: Bearer {token}`
**Request Body**:
```json
{
  "value": "New Value"
}
```

---

## Authentication & Authorization

### JWT Token Structure
```json
{
  "userId": "uuid",
  "email": "user@nge.com",
  "role": "Super Admin",
  "permissions": ["manage_shipments", "manage_users", ...],
  "iat": 1234567890,
  "exp": 1234654290
}
```

### Permission System
- Each role has multiple permissions
- Permissions are checked on each API endpoint
- Format: `{resource}_{action}` (e.g., `shipments_create`, `users_delete`)

### Required Permissions by Endpoint:
- **Dashboard**: `dashboard_view`
- **Customers**: `customers_read`, `customers_create`, `customers_update`, `customers_delete`
- **Orders**: `orders_read`, `orders_create`, `orders_update`, `orders_delete`
- **Shipments**: `shipments_read`, `shipments_create`, `shipments_update`, `shipments_delete`
- **Branches**: `branches_read`, `branches_create`, `branches_update`, `branches_delete`
- **Roles**: `roles_read`, `roles_create`, `roles_update`, `roles_delete`
- **Users**: `users_read`, `users_create`, `users_update`, `users_delete`
- **Website**: `website_read`, `website_update`

---

## File Upload System

### Image Upload Requirements:
1. **Supported Formats**: JPEG, PNG, WebP, GIF
2. **Max File Size**: 10MB per image
3. **Storage Options**:
   - **Local**: Store in `/public/uploads/images/`
   - **Cloud**: AWS S3, Cloudinary, or similar
4. **Image Processing**:
   - Generate thumbnails
   - Optimize images
   - Multiple sizes (original, medium, thumbnail)
5. **File Naming**: `{timestamp}-{random}-{originalname}`

### Upload Endpoint Details:
- **Method**: POST
- **Content-Type**: `multipart/form-data`
- **Validation**: File type, size, dimensions
- **Response**: URL to uploaded image

---

## Data Models

### Shipment Model
```typescript
interface Shipment {
  id: string;
  trackingId: string;
  orderId?: string;
  shipper: Customer;
  receiver: Customer;
  invoiceNumber: string;
  batchNumber: string;
  departureDate: Date;
  estimatedDeliveryDate?: Date;
  currentStatus: 'Processing' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'On Hold';
  originBranch: Branch;
  destinationBranch: Branch;
  parcels: Parcel[];
  history: ShipmentHistory[];
  totalWeight: number;
  weightUnit: string;
  shippingCost: number;
  insuranceAmount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Customer Model
```typescript
interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}
```

### Order Model
```typescript
interface Order {
  id: string;
  orderNumber: string;
  customer: Customer;
  branch: Branch;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Security Requirements

### 1. Authentication
- JWT tokens with expiration (15 minutes access, 7 days refresh)
- Password hashing using bcrypt (salt rounds: 10)
- Rate limiting on login endpoint (5 attempts per 15 minutes)

### 2. Authorization
- Role-based access control (RBAC)
- Permission-based endpoint protection
- Admin-only endpoints clearly marked

### 3. Input Validation
- Validate all input data
- Sanitize user inputs
- SQL injection prevention (use parameterized queries)
- XSS prevention

### 4. CORS
- Configure allowed origins
- Allow credentials for authenticated requests

### 5. File Upload Security
- Validate file types
- Scan for malware (optional)
- Limit file sizes
- Rename files to prevent path traversal

### 6. Rate Limiting
- General API: 100 requests per minute per IP
- Auth endpoints: 5 requests per 15 minutes
- File upload: 10 requests per minute

---

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "message": "Operation successful" // Optional
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {} // Optional additional details
  }
}
```

### Pagination Response
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

## Error Handling

### HTTP Status Codes:
- `200 OK`: Successful GET, PUT, PATCH
- `201 Created`: Successful POST
- `204 No Content`: Successful DELETE
- `400 Bad Request`: Validation errors, malformed request
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Duplicate entry, conflict
- `422 Unprocessable Entity`: Validation failed
- `500 Internal Server Error`: Server error

### Error Codes:
- `AUTH_REQUIRED`: Authentication required
- `AUTH_INVALID`: Invalid credentials
- `AUTH_EXPIRED`: Token expired
- `PERMISSION_DENIED`: Insufficient permissions
- `VALIDATION_ERROR`: Input validation failed
- `NOT_FOUND`: Resource not found
- `DUPLICATE_ENTRY`: Duplicate resource
- `FILE_TOO_LARGE`: Uploaded file exceeds size limit
- `INVALID_FILE_TYPE`: Unsupported file type

---

## Additional Requirements

### 1. Tracking ID Generation
- Format: `NGE` + 8 digits (e.g., NGE12345678)
- Must be unique
- Auto-generate on shipment creation

### 2. Order Number Generation
- Format: `ORD-` + 4 digits (e.g., ORD-1001)
- Auto-increment
- Must be unique

### 3. Batch Number Generation
- Format: `BCH-YYYY-XXX` (e.g., BCH-2024-001)
- Year-based with sequence

### 4. Email Notifications
- Shipment status updates
- Order confirmations
- User account creation
- Password reset (if implemented)

### 5. Audit Logging
- Log all admin actions
- Track who made changes
- Timestamp all modifications

### 6. Data Export
- Export shipments to CSV/Excel
- Export customer data
- Export reports

### 7. Search Functionality
- Full-text search on shipments, customers, orders
- Search by tracking ID, name, email, phone
- Case-insensitive search

---

## Database Indexes

### MongoDB Indexes (Already defined in schemas above)
MongoDB indexes are defined in the Mongoose schemas using `schema.index()`. The following indexes are recommended:

- **Users**: email, roleId, branchId
- **Shipments**: trackingId, currentStatus, orderId, batchNumber, shipperId, receiverId
- **Customers**: email, phone, status
- **Orders**: orderNumber, customerId, status, createdAt
- **Website Images**: imageType + isActive, orderIndex
- **Site Settings**: key, category

### SQL Database Indexes:
```sql
-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_users_branch ON users(branch_id);

-- Shipments
CREATE INDEX idx_shipments_tracking_id ON shipments(tracking_id);
CREATE INDEX idx_shipments_status ON shipments(current_status);
CREATE INDEX idx_shipments_order ON shipments(order_id);
CREATE INDEX idx_shipments_batch ON shipments(batch_number);

-- Customers
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_phone ON customers(phone);

-- Orders
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
```

---

## Environment Variables

### MongoDB
```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/nge_db
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nge_db?retryWrites=true&w=majority
```

### SQL Database
```env
# PostgreSQL/MySQL Connection
DATABASE_URL=postgresql://user:password@localhost:5432/nge_db
# Or for MySQL:
# DATABASE_URL=mysql://user:password@localhost:3306/nge_db

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# File Upload
UPLOAD_MAX_SIZE=10485760  # 10MB in bytes
UPLOAD_DIR=./public/uploads
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_BUCKET_NAME=your-bucket
AWS_REGION=us-east-1

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password

# App
NODE_ENV=production
PORT=3000
API_BASE_URL=http://localhost:3000/api
```

---

## Testing Requirements

### Unit Tests:
- All service functions
- Utility functions
- Validation logic

### Integration Tests:
- API endpoints
- Database operations
- Authentication flow

### Test Coverage:
- Minimum 80% code coverage
- All critical paths tested

---

## Deployment Considerations

1. **Database Migrations**: Use migration system (Prisma, TypeORM)
2. **Backup Strategy**: Daily database backups
3. **Monitoring**: Log all errors and important events
4. **Performance**: Database query optimization
5. **Scalability**: Consider caching (Redis) for frequently accessed data

---

## Next Steps

1. Set up database and run migrations
2. Implement authentication system
3. Create API endpoints starting with core features (customers, shipments)
4. Implement file upload system
5. Add authorization middleware
6. Set up error handling and logging
7. Write tests
8. Deploy and monitor

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Author**: Backend Development Team

