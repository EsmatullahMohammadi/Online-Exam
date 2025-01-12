const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config();
const testController= require("./controllers/testController")

// Middleware
app.use(express.json());
app.use(cors());

// Import Controllers

// MongoDB connection using Mongoose
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/OnlineExam'; 

mongoose.connect(mongoURI)
  .then(() => console.log('Successfully connected to MongoDB using Mongoose!'))
  .catch((error) => console.log('Error connecting to MongoDB:', error));

// Add Tests
app.post('/add-test', testController.addTests);
// All Tests
app.get('/all-tests', testController.getTests);
// get single test
app.get('/tests/:id', testController.getTestById);
// Edit a test
app.put('/tests/:id', testController.updateTest);
// delete one test
app.delete("/tests/:id", testController.deleteTest);


// Delete a Test
app.get('/d-single-test', (req, res) => {
  Test.findByIdAndDelete('6713b7b2ef54a8f06d4d2bcf').
    then((result)=>{
      if(result){
        res.status(200).send(result)
      }else{
        res.status(200).send("The document not founded");
      }
    }).catch((err)=>console.log(err));
});
// Delete all Tests
app.get('/d-all-test', (req, res) => {
  Test.deleteMany({}).
    then((result)=>{
      if(result){
        res.status(200).send(result)
      }
    }).catch((err)=>console.log(err));
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
