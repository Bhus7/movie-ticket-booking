const jwt = require("jsonwebtoken");

// This middleware checks the admin token from request header.
const adminMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // This checks if authorization header exists.
  if (!authHeader) {
    return res.status(401).json({ message: "Token not provided" });
  }

  const token = authHeader.split(" ")[1];

  // This checks if token exists after Bearer.
  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // This checks if logged in user is admin.
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = adminMiddleware;