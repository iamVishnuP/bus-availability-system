# 🚌 Kerala Bus Availability Checking System

A full-stack web application for checking real-time bus availability in Kerala with separate admin and user dashboards.

## Features

### Admin Features
- ✅ Login with credentials: `admin` / `admin123`
- ✅ Add, edit, and delete bus details
- ✅ Manage bus routes with multiple stops
- ✅ Configure bus types (Normal, Limited Stop, KSRTC)
- ✅ Set timings for source, destination, and all stops

### User Features
- ✅ Register and login
- ✅ Search buses by source and destination
- ✅ View real-time bus location based on current time
- ✅ See arrival time at source stop
- ✅ View total travel time
- ✅ Check current bus status (In Transit, At Stop, Not Started, Completed)
- ✅ View all intermediate stops

## Technology Stack

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcryptjs

**Frontend:**
- React.js
- Vite
- React Router
- Axios

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (URI already configured)

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies (already done):
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies (already done):
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Usage

### Admin Login
1. Open `http://localhost:5173`
2. Login with:
   - Username: `admin`
   - Password: `admin123`
3. You'll be redirected to the Admin Dashboard
4. Add buses with all required details including stops and timings

### User Login
1. Open `http://localhost:5173`
2. Register a new account or login with existing credentials
3. You'll be redirected to the User Dashboard
4. Enter source and destination to search for buses
5. View available buses with real-time location tracking

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Buses
- `GET /api/buses` - Get all buses
- `GET /api/buses/search?source=X&destination=Y` - Search buses
- `POST /api/buses` - Add new bus (Admin only)
- `PUT /api/buses/:id` - Update bus (Admin only)
- `DELETE /api/buses/:id` - Delete bus (Admin only)

## Kerala Districts Supported

1. Thiruvananthapuram
2. Kollam
3. Pathanamthitta
4. Alappuzha
5. Kottayam
6. Idukki
7. Ernakulam
8. Thrissur
9. Palakkad
10. Malappuram
11. Kozhikode
12. Wayanad
13. Kannur
14. Kasaragod

## Real-time Location Calculation

The system calculates the current bus location based on:
- Current system time
- Bus schedule (source time, destination time, stop times)
- Returns position between stops with progress percentage
- Shows status: Not Started, In Transit, At Stop, or Completed

## Environment Variables

Backend `.env` file:
```
## Environment Variables

Create a `.env` file in the server folder and add the following variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000


## Project Structure

```
bus/
├── server/
│   ├── models/
│   │   ├── User.js
│   │   └── Bus.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── buses.js
│   ├── middleware/
│   │   └── auth.js
│   ├── utils/
│   │   └── busLocation.js
│   ├── server.js
│   ├── package.json
│   └── .env
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── Auth/
    │   │   │   ├── LoginRegister.jsx
    │   │   │   └── LoginRegister.css
    │   │   ├── Admin/
    │   │   │   ├── AdminDashboard.jsx
    │   │   │   └── AdminDashboard.css
    │   │   └── User/
    │   │       ├── UserDashboard.jsx
    │   │       └── UserDashboard.css
    │   ├── services/
    │   │   └── api.js
    │   ├── utils/
    │   │   └── ProtectedRoute.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## License

MIT
