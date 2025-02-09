
const CandidateResponse = require('../../models/CandidateResponse')

const getResults = async (req, res)=>{
    try {
        const results = await CandidateResponse.find()
          .populate("candidateId")
          .populate("testId");
    
        res.json(results);
      } catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
}

module.exports = { getResults }

