const crypto = require("crypto");
const Candidate = require("../../models/candidate");

const editCandidate = async (req, res) => {
  const crypto = require("crypto");
  const { email, currentPassword, newPassword } = req.body;
  const { candidateId } = req.params;

  const AES_SECRET = crypto
    .createHash("sha256")
    .update(process.env.AESSECRET)
    .digest();

  const decryptAES = (encryptedText) => {
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      AES_SECRET,
      Buffer.alloc(16, 0)
    );
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  };

  const encryptAES = (text) => {
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      AES_SECRET,
      Buffer.alloc(16, 0)
    );
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  };

  try {
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    const decryptedPassword = decryptAES(candidate.password);
    console.log(decryptedPassword)
    console.log(currentPassword)
    if (decryptedPassword.trim() !== currentPassword.trim()) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    if (email && email !== candidate.email) {
      const emailExists = await Candidate.findOne({ email });
      if (emailExists) {
        return res
          .status(400)
          .json({ message: "Email address is already in use" });
      }
      candidate.email = email;
    }

    if (newPassword) {
      const encryptedNewPassword = encryptAES(newPassword);
      candidate.password = encryptedNewPassword;
    }

    await candidate.save();
    res
      .status(200)
      .json({ message: "Candidate updated successfully", candidate });
  } catch (error) {
    console.error(`Error updating candidate: ${error.message}`);
    res
      .status(500)
      .json({ message: "Error updating candidate", error: error.message });
  }
};

module.exports = { editCandidate };
