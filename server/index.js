const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config();
const testController= require("./controllers/testController")
const lecturarController= require("./controllers/lecturarController")

// Middleware
app.use(express.json());
app.use(cors());

// Import Controllers

// MongoDB connection using Mongoose
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/OnlineExam'; 

mongoose.connect(mongoURI)
  .then(() => console.log('Successfully connected to MongoDB using Mongoose!'))
  .catch((error) => console.log('Error connecting to MongoDB:', error));

// Add a Tests
app.post('/add-test', testController.addTests);
// All Tests
app.get('/all-tests', testController.getTests);
// get single test
app.get('/tests/:id', testController.getTestById);
// Edit a test
app.put('/tests/:id', testController.updateTest);
// delete one test
app.delete("/tests/:id", testController.deleteTest);

// Add a lecturar
app.post('/add-test', lecturarController.addLecturar);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
