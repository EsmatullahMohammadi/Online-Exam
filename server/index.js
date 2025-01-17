const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config();
const testController= require("./controllers/testController")
const lecturarController= require("./controllers/lecturarController");
const candidateController= require("./controllers/candidateController")
const settingController= require("./controllers/settingController")


// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection using Mongoose
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/OnlineExam'; 

mongoose.connect(mongoURI)
  .then(() => console.log('Successfully connected to MongoDB using Mongoose!'))
  .catch((error) => console.log('Error connecting to MongoDB:', error));

// Settings
app.put('/settings', settingController.editSetting);

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
app.post('/add-lecturar', lecturarController.addLecturar);
// All lecturar
app.get('/all-lecturars', lecturarController.getLecturar);
// delete one lecturer
app.delete("/lecturars/:id", lecturarController.deleteLecturer);

// Add a candidates
app.post('/add-candidates', candidateController.addCandidate);
// All candidates
app.get('/all-candidates', candidateController.getCandidates);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
