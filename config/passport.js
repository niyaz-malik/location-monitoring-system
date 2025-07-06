const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user-model.js');

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
            try {
                const user = await User.findOne({ email: email });
                if (!user) {
                    return done(null, false, { message: 'No user found' });
                }

                const isMatch = await user.comparePassword(password);
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Invalid credentials' });
                }
            } catch (error) {
                return done(error);
            }
        })
    );

    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: "http://localhost:3000/api/auth/google/callback",
            },
            async (accessToken, refreshToken, profile, done) => {
                try {

                    let user = await User.findOne({ googleId: profile.id });

                    if (!user) {

                        user = new User({
                            googleId: profile.id,
                            username: profile.displayName,
                            email: profile.emails[0].value,
                        });
                        await user.save();
                    }

                    return done(null, user);
                } catch (err) {
                    return done(err);
                }
            }
        )
    );


    passport.serializeUser((user, done) => done(null, user._id));

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};
