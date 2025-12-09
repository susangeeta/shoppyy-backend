import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

// Email Validation
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ======================= REGISTER =======================
export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    //Check required fields
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    // Validate email format
    if (!isValidEmail(email))
      return res.status(400).json({ message: "Invalid email address" });

    // Check if user already exists
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(409).json({ message: "Email already in use" }); // 409 Conflict

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    //Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Send response (Don't send password!)
    res.status(201).json({
      message: "User registered successfully",
      user: {
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error: " + err.message });
  }
}

// ======================= LOGIN =======================
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    //  Validate email format
    if (!isValidEmail(email))
      return res.status(400).json({ message: "Invalid email address" });

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User does not exist" });
    console.log(user);

    //  Compare passwords
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ message: "Incorrect password" });

    // Generate token
    //   const token = jwt.sign(
    //   { id: user._id },
    //   process.env.JWT_SECRET,
    //   { expiresIn: process.env.JWT_EXPIRE }
    // );
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    // 📤 Send response
    return res.status(200).json({
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
      },
      accessToken: token,
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error: " + err.message });
  }
}
