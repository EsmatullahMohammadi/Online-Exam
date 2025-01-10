const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const Test = require('./models/test');
require('dotenv').config();

// Middleware
app.use(express.json());
app.use(cors());

// Import Controllers

// MongoDB connection using Mongoose
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/OnlineExam'; 

mongoose.connect(mongoURI)
  .then(() => console.log('Successfully connected to MongoDB using Mongoose!'))
  .catch((error) => console.log('Error connecting to MongoDB:', error));

app.get('/add-test',(req,res)=>{
  const test = new Test({
    title: "new Exam 3",
    duration: "30",
    startDate: "2023",
    endDate: "2024",
    totalMark: "20",
    passingMark: "20",
    numOfQuestion: "12",
    description: "hi how are you it is your test"
  });
  test.save().then((result)=> res.send(result)).
  catch((err)=>console.log(err))
});
app.post('/add-test',(req,res)=>{
  console.log(req.body)
});
// All Tests
app.get('/all-tests', (req, res) => {
  Test.find().sort({createdAt: -1}).then((result)=> res.status(200).send(result)).
  catch((err)=>console.log(err));
});
// Single Tests
app.get('/single-test', (req, res) => {
  Test.findById('674c80939b2fd4cf105a31c5').then((result)=> res.status(200).send(result)).
    catch((err)=>console.log(err));
});
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
