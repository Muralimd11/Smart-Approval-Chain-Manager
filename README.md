# Smart Approval Chain Manager

A full-stack MERN application for managing approval workflows with role-based access control.

## Features

- **Role-Based Authentication**: Employee, Team Lead, and Manager roles
- **Request Management**: Purchase, Expense Reimbursement, and Leave requests
- **Sequential Approval Workflow**: Team Lead → Manager approval chain
- **Real-time Notifications**: Socket.io powered instant notifications
- **File Upload**: PDF uploads stored in Cloudinary
- **Request History**: Complete tracking of all requests and their status

## Tech Stack

### Backend
- Node.js + Express.js
- MongoDB with Mongoose
- JWT Authentication
- Socket.io for real-time features
- Cloudinary for file storage
- Multer for file uploads

### Frontend
- React.js 18
- TailwindCSS for styling
- React Router v6
- Axios for API calls
- Socket.io-client
- React Hot Toast for notifications

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for file uploads)

## Application Flow

### 1. Employee Workflow
- Login as Employee
- Create requests (Purchase/Expense/Leave)
- Upload PDF documents for Purchase/Expense requests
- View request history and status
- Receive real-time notifications on approval/rejection

### 2. Team Lead Workflow
- Login as Team Lead
- View pending requests from employees
- Approve or reject requests with comments
- Approved requests move to Manager

### 3. Manager Workflow
- Login as Manager
- View requests approved by Team Lead
- Final approval or rejection with comments
- Once approved by Manager, request is fully approved

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Requests
- `POST /api/requests` - Create new request (Employee)
- `GET /api/requests` - Get all pending requests (Team Lead/Manager)
- `GET /api/requests/my-requests` - Get employee's requests
- `GET /api/requests/:id` - Get single request

### Approvals
- `PUT /api/approvals/teamlead/:id` - Team Lead approval
- `PUT /api/approvals/manager/:id` - Manager approval
- `GET /api/approvals/history/:id` - Get approval history

### Notifications
- `GET /api/notifications` - Get all notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/mark-all-read` - Mark all as read

## Features in Detail

### Request Types

1. **Purchase Request**
   - Upload PDF with product details
   - Enter product name, market price, and reason
   - File stored in Cloudinary

2. **Expense Reimbursement**
   - Upload receipt PDF
   - Enter expense amount
   - Optional description

3. **Leave Request**
   - Select date range (from/to)
   - Enter reason for leave
   - Automatic calculation of days

### Approval Workflow

```
Employee → Team Lead → Manager
   ↓           ↓          ↓
Pending → Approved → Fully Approved
              ↓          ↓
          Rejected   Rejected
```

### Real-time Features

- Socket.io connection for instant notifications
- Auto-update notification count
- Toast notifications for new updates

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected API routes
- File type validation
- File size limits

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGO_URI in .env file
- Verify MongoDB port (default: 27017)

### Cloudinary Upload Error
- Verify Cloudinary credentials in .env
- Check file size (max 5MB)
- Ensure file is PDF format

### Socket Connection Error
- Check REACT_APP_SOCKET_URL in client .env
- Ensure server is running
- Check CORS settings

## Future Enhancements

- Email notifications
- Advanced reporting and analytics
- Bulk request processing
- Custom approval chains
- Mobile app
- Document preview
- Search and filter functionality
