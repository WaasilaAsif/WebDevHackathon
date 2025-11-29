
import express from "express";
import crypto from "crypto";
import dotenv from "dotenv";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
import { generateToken } from "../utils/generateToken.js";

dotenv.config();
const { FRONTEND_URL } = process.env;


export async function signup(req, res) {
  try {
    const { fullName, email, password } = req.body;
    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Create new user (automatically verified)
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const user = await User.create({
      fullName,
      email,
      password,
      isVerified: true, // Auto-verify users
      profilePic: randomAvatar,
    });

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    console.log("✅ Signup successful");
    return res.status(201).json({
      message: "Account created successfully",
      user,
      token
    });

  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

//  LOGIN 
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    console.log(" Login attempt:");
    console.log("Email:", email);
    console.log("Incoming password:", password); // ⚠️ Debug only

    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found");
      return res.status(400).json({ message: "User not found" });
    }

    console.log("Stored password (hashed):", user.password); // ⚠️ Debug only

    if (!user.password) {
      console.log("⚠️ Attempted password login on Google-account user");
      return res.status(403).json({
        message: "This email is linked with Google. Please login with Google.",
      });
    }

    const correct = await user.comparePassword(password);
    console.log("Password match result:", correct);

    if (!correct) {
      console.log("❌ Invalid password");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    console.log("✅ Login successful");
    return res.status(200).json({ message: "Login successful", user, token });

  } catch (error) {
    console.error("💥 Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

//  LOGOUT
export async function logout(req, res) {
  res.clearCookie("token");
  return res.status(200).json({ success: true, message: "Logout successful" });
}

// GOOGLE CALLBACK 
export async function googleCallback(req, res) {
  // 1. If Google authentication failed
  if (!req.user) {
    return res.redirect(`${FRONTEND_URL}/auth/login`);
  }

  // 2. Generate the token
  const token = generateToken(req.user._id);

  // 3. Set the auth cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // 4. Send welcome email (optional)
  try {
    await sendEmail({
      to: req.user.email,
      subject: "Welcome!",
      title: "Welcome Aboard",
      body: `<p>Hi ${req.user.fullName}, your email has been verified.</p>`,
      buttonText: "Open App",
      buttonLink: `${FRONTEND_URL}/`,
    });
  } catch (emailError) {
    console.error("Failed to send welcome email:", emailError);
  }

  // -------------------------------
  // 5. REDIRECT LOGIC (same as frontend)
  // -------------------------------

  const user = req.user;
  const hasFriends = Array.isArray(user.friends) && user.friends.length > 0;
  const hasChats = Array.isArray(user.chats) && user.chats.length > 0;

  if (!user.onboarded && !user.isOnboarded) {
    // some users use onboarded, some use isOnboarded
    return res.redirect(`${FRONTEND_URL}/auth/onboard`);
  }

  if (hasFriends && hasChats) {
    return res.redirect(`${FRONTEND_URL}/chat`);
  }

  return res.redirect(`${FRONTEND_URL}/recommendations`);
}

export async function forgotPassword(req, res) {
  const { email } = req.body;
  
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  // Generate token and expiry (15 min)
  const resetToken = crypto.randomBytes(32).toString("hex");
  const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

  user.passwordResetToken = resetToken;
  user.passwordResetExpires = tokenExpiry;
  await user.save();

  const resetUrl = `${FRONTEND_URL}/auth/reset-password?token=${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: "Password Reset Request",
    title: "Reset Your Password",
    body: `<p>Hi ${user.fullName}, click below to reset your password.</p>`,
    buttonText: "Reset Password",
    buttonLink: resetUrl,
  });

  return res.status(200).json({ message: "Password reset email sent." });
}

export async function resetForgotPassword(req, res) {
  const { token, password } = req.body;

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: new Date() }, 
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token." });
  }

  
  user.password = password;

  // Clear token
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  return res.status(200).json({ message: "Password reset successful." });
}



export const getMe = async (req, res) => {
  try {
    // The protectRoute middleware already sets req.user
    // So we can directly use req.user
    const user = req.user;

    
    if (!user) {
      console.log("No user");
      return res.status(401).json({ message: "Not authenticated" });
    }
    console.log("Returning User");
    // Return the user object that's already been set by the middleware
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};