const bcrypt = require('bcryptjs');
const Candidate = require('../../models/candidate');


// edit candidate
const editCandidate = async (req, res) => {
    const { email, currentPassword, newPassword } = req.body;
    const { candidateId } = req.params;
  
    try {
      // Find the candidate by ID
      const candidate = await Candidate.findById(candidateId);
      if (!candidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }

      // Check if current password matches the stored password
      const isPasswordValid = await bcrypt.compare(currentPassword, candidate.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
  
      // Update fields if provided
      if (email && email !== candidate.email) {
        const emailExists = await Candidate.findOne({ email });
        if (emailExists) {
          return res.status(400).json({ message: "Email address is already in use" });
        }
        candidate.email = email;
      }
      
      // If a new password is provided, hash and update it
      if (newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        candidate.password = hashedPassword;
      }
      // Save the updated candidate
      await candidate.save();
      res.status(200).json({ message: "candidate updated successfully", candidate });
    } catch (error) {
      console.error(`Error updating candidate: ${error.message}`);
      res.status(500).json({ message: "Error updating candidate", error: error.message });
    }
  };
  
  module.exports = { editCandidate };