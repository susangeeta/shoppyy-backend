import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export default async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader)
      return res.status(403).json({ message: "token not found" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(403).json({ message: "token not found" });

    jwt.verify(
      token,
      process.env.JWT_SECRET || "SECRETKEY",
      async (err, decoded) => {
        if (err)
          return res.status(403).json({ message: "Invalid or expired token" });

        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        req.user = user;
        next();
      }
    );
  } catch (err) {
    return res.status(500).json({
      message: "Error during verifying token",
      error: err.message,
    });
  }
}
