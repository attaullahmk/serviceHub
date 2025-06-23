const express = require("express");
const passport = require("passport");
const { signToken } = require("../utils/jwt");
const User = require("../models/user");
const { userSchema } = require("../schemas/userSchema");
const validateSchema = require("../middlewares/validateSchema");
const wrapAsync = require("../utils/wrapAsync");
const authenticateJWT = require("../middlewares/authenticateJWT");
const sendEmail = require("../utils/sendEmail"); // Import sendEmail utility
const OTP = require("../models/otp"); // Create an OTP model
const crypto = require("crypto");
// const OTP = require("../models/otp"); // Create an OTP model
// const sendEmail = require("../utils/sendEmail");


const router = express.Router();

// Google OAuth routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/login", session: false }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const { user, token, isNewUser } = req.user; // Extract isNewUser flag
console.log("User authenticated via Google:", req.user);
    try {
      if (isNewUser) {
        console.log("✅ New Google user detected, sending email...");

        // ✅ Send Welcome Email
        const emailSubject = "Welcome to ServiceHub! 🎉";
        const emailMessage = `Hello ${user.name},\n\nYour account has been created successfully using Google.\n\nThank you for joining ServiceHub!\n\nBest regards,\nServiceHub Team`;

        await sendEmail(user.email, emailSubject, emailMessage);
        console.log(`✅ Welcome email sent to ${user.email}`);
      } else {
        console.log("⚠️ Existing Google user, no email sent.");
      }
    } catch (error) {
      console.error(`❌ Error sending email:`, error.message);
    }

    // ✅ Redirect User to Frontend with Token
    console.log("✅ Google authentication successful, redirecting to frontend...", token);
    res.redirect(`http://localhost:5173/signup?token=${token}`);
    
  }
);

// ✅ Register route with Email Sending
router.post(
  "/register",
  validateSchema(userSchema),
  wrapAsync(async (req, res) => {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const newUser = new User({ name, email, password, role });
    await newUser.save();

    const token = signToken(newUser);

    // ✅ Send Welcome Email
    const emailSubject = "Welcome to ServiceHub! 🎉";
    const emailMessage = `Hello ${name},\n\nYour account has been created successfully.\n\nThank you for joining ServiceHub!\n\nBest regards,\nServiceHub Team`;

    try {
      await sendEmail(email, emailSubject, emailMessage);
      console.log(`✅ Welcome email sent to ${email}`);
    } catch (error) {
      console.error(`❌ Failed to send email to ${email}:`, error.message);
    }

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    });
  })
);

// ✅ Login route
router.post(
  "/login",
  wrapAsync(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = signToken(user);
    res.json({ message: "Login successful", user, token });
  })
);

// ✅ Fetch authenticated user's data
router.get("/me", authenticateJWT, async (req, res) => {
  try {
    return res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Logout route
router.get("/logout", (req, res) => {
  res.json({ message: "Logout successful" });
});

// ✅ Request OTP for Password Reset
router.post(
  "/forgot-password",
  wrapAsync(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User with this email not found" });
    }

    // Generate OTP
    const otp = user.generateOTP();
    await user.save();

    // Send OTP to user's email
    const emailSubject = "Reset Your Password - ServiceHub";
    const emailMessage = `Hello ${user.name},\n\nYour OTP for password reset is: ${otp}\n\nThis OTP is valid for 10 minutes.\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nServiceHub Team`;

    try {
      await sendEmail(email, emailSubject, emailMessage);
      console.log(`✅ OTP sent to ${email}`);
    } catch (error) {
      console.error(`❌ Failed to send OTP to ${email}:`, error.message);
    }

    res.json({ message: "OTP sent successfully" });
  })
);

// ✅ Verify OTP and Reset Password
router.post(
  "/reset-password",
  wrapAsync(async (req, res) => {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check OTP validity
    if (!user.resetOTP || user.resetOTPExpires < Date.now()) {
      return res.status(400).json({ message: "OTP has expired. Request a new one." });
    }

    if (user.resetOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP. Please try again." });
    }

    // Update password
    user.password = newPassword;
    user.resetOTP = null;
    user.resetOTPExpires = null;
    await user.save();

    res.json({ message: "Password reset successful. You can now log in with your new password." });
  })
);









router.post(
  "/send-otp",
  wrapAsync(async (req, res) => {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const otpCode = crypto.randomInt(100000, 999999); // Generate a 6-digit OTP
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10-minute expiry

    await OTP.findOneAndUpdate(
      { email },
      { otp: otpCode, expiresAt: otpExpires },
      { upsert: true, new: true }
    );

    const emailSubject = "Your OTP for ServiceHub Signup";
    const emailMessage = `Your OTP code is: ${otpCode}. It is valid for 10 minutes.`;

    try {
      await sendEmail(email, emailSubject, emailMessage);
      res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to send OTP" });
    }
  })
);





router.post(
  "/verify-otp",
  wrapAsync(async (req, res) => {
    const { email, otp, name, password, role } = req.body;

    const otpRecord = await OTP.findOne({ email });
    // console.log(otpRecord);
  
    if (parseInt(otpRecord.otp) !== parseInt(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP has expired" });
    }
    // Fix OTP comparison issue
    if (otpRecord.otp !== otp) {  // Compare as string
      return res.status(400).json({ message: "Invalid OTP" });
    }


    await OTP.deleteOne({ email });

    const newUser = new User({ name, email, password, role });
    await newUser.save();

    const token = signToken(newUser);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    });
  })
);


module.exports = router;
