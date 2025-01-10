const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config();

// Middleware
app.use(express.json());
app.use(cors());

// Import Controllers

// MongoDB connection using Mongoose
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/OnlineExam'; 

// mongoose.connect(mongoURI)
//   .then(() => console.log('Successfully connected to MongoDB using Mongoose!'))
//   .catch((error) => console.log('Error connecting to MongoDB:', error));

app.get('/',(req,res)=>{
  res.json("hello world")
})
app.post('/post-job', upload.single('file'), async (req, res) => {
  try {
      const body = req.body;
      body.createdAt = new Date(); // Correct field name `createdAt`
      body.companyLogo = req.file.filename;
      req.body.skills = JSON.parse(req.body.skills)
      
      const result = await jobsCollection.insertOne(body);

      if (result.insertedId) {
          return res.status(200).send(result); // Successfully inserted
      } else {
          return res.status(500).send({
              message: "Unable to insert! Try again later.",
              status: false
          });
      }
  } catch (error) {
      // Log the error and send a response
      console.log(error);
      return res.status(500).send({
          message: "Server error. Please try again later.",
          status: false,
          error: error.message // Send error message for debugging
      });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
