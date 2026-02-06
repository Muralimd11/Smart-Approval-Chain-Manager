# QUICK SETUP GUIDE

## Step-by-Step Setup Instructions

### 1. Install Dependencies

#### Server
```bash
cd server
npm install
```

Required packages will be installed from package.json:
- express, mongoose, bcryptjs, jsonwebtoken
- cloudinary, multer, socket.io
- cors, dotenv, express-validator

#### Client
```bash
cd client
npm install
```

Required packages will be installed from package.json:
- react, react-dom, react-router-dom
- axios, socket.io-client
- tailwindcss, react-hot-toast

### 2. Environment Setup

#### Server (.env)
Create `server/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart-approval-chain
JWT_SECRET=your_secret_key_here_change_in_production
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=development
```

#### Client (.env)
Create `client/.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### 3. Create Missing Components

The following files need to be created manually from the guides:

From COMPONENTS_BUNDLE.txt:
- client/src/components/auth/PrivateRoute.jsx
- client/src/components/auth/RoleBasedRoute.jsx
- client/src/components/common/Navbar.jsx
- client/src/components/common/LoadingSpinner.jsx
- client/src/components/common/Modal.jsx

From COMPONENT_GUIDE_PART1.md:
- client/src/components/notifications/NotificationBell.jsx
- client/src/components/notifications/NotificationPanel.jsx
- client/src/components/notifications/NotificationItem.jsx
- client/src/components/employee/RequestForm.jsx
- client/src/components/employee/PurchaseRequestForm.jsx

From COMPONENT_GUIDE_PART2.md:
- client/src/components/employee/ExpenseReimbursementForm.jsx
- client/src/components/employee/LeaveRequestForm.jsx
- client/src/pages/EmployeeDashboard.jsx
- client/src/pages/TeamLeadDashboard.jsx
- client/src/pages/ManagerDashboard.jsx (copy TeamLeadDashboard and modify)
- client/src/pages/NotFound.jsx
- client/src/pages/Unauthorized.jsx

### 4. Start MongoDB

Ensure MongoDB is running:
```bash
# On Mac/Linux
sudo systemctl start mongodb

# Or using MongoDB Compass, connect to:
mongodb://localhost:27017
```

### 5. Create Test Users

Use Postman or cURL to create test users:

```bash
# Employee
POST http://localhost:5000/api/auth/register
{
  "name": "John Employee",
  "email": "employee@test.com",
  "password": "password123",
  "role": "employee",
  "department": "Engineering"
}

# Team Lead
POST http://localhost:5000/api/auth/register
{
  "name": "Sarah TeamLead",
  "email": "teamlead@test.com",
  "password": "password123",
  "role": "teamlead",
  "department": "Engineering"
}

# Manager
POST http://localhost:5000/api/auth/register
{
  "name": "Mike Manager",
  "email": "manager@test.com",
  "password": "password123",
  "role": "manager",
  "department": "Engineering"
}
```

### 6. Run the Application

#### Terminal 1 - Server
```bash
cd server
npm run dev
```
Server runs on: http://localhost:5000

#### Terminal 2 - Client
```bash
cd client
npm start
```
Client runs on: http://localhost:3000

### 7. Login and Test

Open http://localhost:3000

Login credentials:
- Employee: employee@test.com / password123
- Team Lead: teamlead@test.com / password123
- Manager: manager@test.com / password123

### 8. Testing the Workflow

1. Login as Employee
   - Create a purchase/expense/leave request
   - View in request history

2. Login as Team Lead
   - See pending requests
   - Approve or reject

3. Login as Manager
   - See requests approved by Team Lead
   - Give final approval

4. Login back as Employee
   - Check notifications
   - See updated request status

## Troubleshooting

### MongoDB Connection Failed
- Check if MongoDB is running
- Verify MONGO_URI in server/.env
- Try: `mongodb://127.0.0.1:27017/smart-approval-chain`

### Cloudinary Upload Failed
- Verify Cloudinary credentials
- Check file is PDF
- Check file size (max 5MB)

### Socket.io Not Working
- Check REACT_APP_SOCKET_URL in client/.env
- Verify server is running on port 5000
- Check browser console for errors

### Port Already in Use
- Change PORT in server/.env
- Update REACT_APP_API_URL and REACT_APP_SOCKET_URL accordingly

## Project Structure Summary

```
smart-approval-chain-manager/
├── server/                 # Backend (Node.js + Express)
│   ├── config/            # DB, Cloudinary, Socket configs
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Auth, upload, validation
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── socket/            # Socket.io handlers
│   ├── utils/             # Helper functions
│   └── server.js          # Entry point
│
├── client/                # Frontend (React)
│   ├── public/            # Static files
│   └── src/
│       ├── components/    # React components
│       ├── context/       # Context providers
│       ├── hooks/         # Custom hooks
│       ├── pages/         # Page components
│       ├── services/      # API calls
│       ├── utils/         # Helpers
│       ├── App.jsx        # Main app
│       └── index.jsx      # Entry point
│
└── README.md              # Documentation
```

## Additional Notes

- The server must have `streamifier` package installed for Cloudinary uploads
- Add it to server package.json dependencies: `"streamifier": "^0.1.1"`
- Run `npm install` again in server directory

## Getting Cloudinary Credentials

1. Go to https://cloudinary.com
2. Sign up for free account
3. Dashboard shows:
   - Cloud Name
   - API Key
   - API Secret
4. Copy these to server/.env file
