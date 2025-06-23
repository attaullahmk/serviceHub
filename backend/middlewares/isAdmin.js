const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const isAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(403).json({ error: "Not authorized as admin" });
    }

    req.user = { id: admin._id, role: "admin" };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = isAdmin;
