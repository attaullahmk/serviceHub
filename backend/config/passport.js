const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");
const { signToken } = require("../utils/jwt");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.NODE_ENV === "production"
          ? process.env.PROD_GOOGLE_CALLBACK_URL
          : process.env.DEV_GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        let isNewUser = false; // Flag to track new user

        if (!user) {
          console.log("✅ New Google user detected, creating account...");
          user = new User({
            googleId: profile.id, 
            name: profile.displayName,
            email: profile.emails[0].value,
            role: "user",
          });
          await user.save();
          isNewUser = true; // Mark as new user
        } else if (!user.googleId) {
          console.log("🔄 Existing email found, linking Google account...");
          user.googleId = profile.id; 
          await user.save();
        }

        const token = signToken(user);
        return done(null, { user, token, isNewUser }); // Pass isNewUser flag
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
