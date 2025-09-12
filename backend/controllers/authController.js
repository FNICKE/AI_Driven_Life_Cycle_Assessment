import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOTPEmail } from "../utils/sendEmail.js";

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/**
 * Register new user
 */
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // ✅ Only check username (emails can repeat)
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    const user = await User.create({
      username,
      email, // can repeat
      password: hashedPassword,
      otp,
      otpExpires,
      isVerified: false,
    });

    await sendOTPEmail(email, otp);

    res.status(201).json({
      message: "Registered successfully, OTP sent!",
      userId: user._id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Verify OTP
 */
export const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    user.otp = null;
    user.otpExpires = null;
    user.isVerified = true;
    await user.save();

    res.json({ message: "OTP verified successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Login
 */
export const login = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    let user;
    if (username) {
      user = await User.findOne({ username });
    } else if (email) {
      user = await User.findOne({ email });
    }

    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.isVerified) {
      return res
        .status(400)
        .json({ error: "Please verify your account before logging in" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Forgot Password (send OTP)
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Email not found" });

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendOTPEmail(email, otp);
    res.json({ message: "OTP sent to email", userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Reset Password
 */
export const resetPassword = async (req, res) => {
  try {
    const { userId, otp, newPassword } = req.body;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: "Password reset successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
