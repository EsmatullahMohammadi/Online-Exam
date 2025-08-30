const crypto = require("crypto");

const AES_SECRET = crypto
  .createHash("sha256")
  .update(process.env.AESSECRET)
  .digest();
const IV = Buffer.alloc(16, 0); //we use iv that if the input was same the output should be defrence

const encryptAES = (text) => {
  const cipher = crypto.createCipheriv("aes-256-cbc", AES_SECRET, IV);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

const decryptAES = (encryptedText) => {
  const decipher = crypto.createDecipheriv("aes-256-cbc", AES_SECRET, IV);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

module.exports = { encryptAES, decryptAES };
