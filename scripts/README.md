# Setup Scripts

## Create Admin User

To create a default admin user, run:

```bash
node scripts/create-admin-user.js
```

This will create:
- **Email**: `admin@nge.com`
- **Password**: `admin123`
- **Role**: Super Admin

**⚠️ IMPORTANT**: Change the password after first login!

### Prerequisites

1. Make sure `.env.local` exists with `MONGODB_URI` set
2. Install dependencies: `npm install bcryptjs mongoose dotenv`
3. Make sure your MongoDB database is running and accessible

### Custom Credentials

To use different credentials, edit `scripts/create-admin-user.js` and change:
- `email: 'admin@nge.com'`
- `defaultPassword = 'admin123'`


