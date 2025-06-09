<!-- # ServiceHub

ServiceHub is a local service marketplace to connect users with nearby professionals, such as doctors, drivers, electricians, and more.

## Getting Started

These instructions will guide you through setting up the environment to start building the project. This includes installing the necessary tools and initializing the server and client.

## Prerequisites

Make sure you have the following software installed on your machine:

- [Node.js](https://nodejs.org/) - Runtime environment for server-side JavaScript.
- [MongoDB](https://www.mongodb.com/) - Database for storing application data.
- [Git](https://git-scm.com/) - Version control system to manage the project code.

## Project Setup

1. **Clone the Repository**

   Start by cloning the project repository (you can create it on GitHub or another platform):

   ```bash
   git clone https://github.com/attaullahmk/serviceHub.git
   cd servicehub -->


# 🚀 ServiceHub

ServiceHub is a smart local service marketplace that connects users with nearby professionals—such as doctors, drivers, electricians, and more. It simplifies the search, booking, and communication between users and service providers in one centralized platform.

---

## 📌 Key Features

- 👤 User and Provider Authentication (Email + Google OAuth)
- 🔍 Search and Filter local service providers
- 📅 Booking system with real-time availability
- 💬 Messaging between users and service providers
- ⭐ Ratings and Reviews
- 🔔 Notifications and Alerts
- 📊 Admin Dashboard
- 📱 Mobile-Responsive UI using React + Bootstrap

---

## 🛠️ Getting Started

These instructions will help you set up the project on your local machine for development and testing purposes.

---

## ✅ Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) – JavaScript runtime
- [MongoDB](https://www.mongodb.com/) – NoSQL database
- [Git](https://git-scm.com/) – Version control system

---

## 📁 Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/attaullahmk/serviceHub.git
cd serviceHub
```

### 2. Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd ../frontend
npm install
```

---

## ⚙️ Environment Variables

This project uses environment variables for API keys, database connections, and other secrets.

> ⚠️ Environment Variables Notice:
For security reasons, all .env files are excluded from version control using .gitignore.
You must manually create your own .env files in both the backend/ and frontend/ directories.



---

### 🔐 Create `.env` file in `frontend/` folder

**Location:** `frontend/.env`

```env
VITE_MAPBOX_TOKEN=your-mapbox-token-here

# Local API base URL
VITE_API_BASE_URL=http://localhost:3000

# WebSocket server URL
VITE_SOCKET_URL=http://localhost:3000
```

---

### 🔐 Create `.env` file in `backend/` folder

**Location:** `backend/.env`

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

DEV_GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
PROD_GOOGLE_CALLBACK_URL=https://your-production-domain.com/auth/google/callback

JWT_SECRET=your-secret-key

# MongoDB Database URL (local or cloud)
MONGO_URL=mongodb://127.0.0.1:27017/serviceHub
# MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority

# Cloudinary (Image Uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password
```

---

## 🚀 Running the App

### Start the Backend Server

```bash
cd backend
npm start
```

### Start the Frontend Development Server

```bash
cd frontend
npm run dev
```

Open your browser and navigate to `http://localhost:5173`

---

## 🧭 Project Structure

```
serviceHub/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── schemas/
│   ├── utils/
│   ├── .env
│   ├── app.js
│   ├── initdb.js
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── feature/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── style/
│   │   ├── tests/
│   │   ├── utils/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── socket.jsx
│   ├── .env
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── .gitignore
├── README.md
└── other config files (e.g., .npmrc, .eslintrc)

```

---

## 🙌 Contribution Guide

Contributions are welcome!
If you find a bug or have a feature request, feel free to open an issue or submit a pull request.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 📞 Contact

**Author:** [Atta Ullah](https://github.com/attaullahmk)  
📧 Email: [attaullahmk099@gmail.com](mailto:attaullahmk099@gmail.com)
