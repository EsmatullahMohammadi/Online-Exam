const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require("path");
const cookieParser = require('cookie-parser');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
const adminRoutes = require('./routes/adminRoutes');
const lecturerRoutes = require('./routes/lecturerRoutes');
const authRoutes = require('./routes/authRoutes');
const candidateRoutes = require('./routes/candidateRoutes')
// Middleware
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}));
app.use(cookieParser());
app.use("/userImage", express.static(path.join(__dirname, "userImage")));

// MongoDB connection using Mongoose
const mongoURI = process.env.MONGO_URI || `mongodb://localhost:27017/${process.env.DB_NAME}`; 

mongoose.connect(mongoURI)
  .then(() => console.log('Successfully connected to MongoDB using Mongoose!'))
  .catch((error) => console.log('Error connecting to MongoDB:', error));

// Auth Routes
app.use(authRoutes);

// Admin Routes
app.use(adminRoutes);

// Lecturer Routes
app.use(lecturerRoutes);

// Candidate Routes
app.use(candidateRoutes);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
