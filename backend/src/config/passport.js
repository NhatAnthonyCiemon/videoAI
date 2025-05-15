import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import GoogleStrategy from "passport-google-oauth20";
import GitHubStrategy from "passport-github2";
import User from "../app/auth/service.js";
import dotenv from "dotenv";
dotenv.config();

import passport from "passport";

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};

const strategy = new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const user = await User.getById(jwt_payload.id);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (error) {
        return done(error, false);
    }
});

passport.use(strategy);
passport.use(
    "google",
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL:
                process.env.CALLBACK_URL ||
                "http://localhost:4000/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log("profile", profile);
                let user = await User.findUserBySocialId(profile.id);
                if (!user) {
                    const email = null;
                    const avatar = profile.photos[0].value;
                    user = await User.createUserGoogle(
                        profile.displayName,
                        profile.id,
                        email,
                        avatar
                    );
                }

                return done(null, user); // Trả về thông tin người dùng đã xác thực
            } catch (error) {
                console.log("error google ở đây", error);
                return done(error, false, { message: error.message }); // Trả về lỗi nếu có
            }
        }
    )
);
passport.use(
    "github",
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL:
                process.env.GITHUB_CALLBACK_URL ||
                "http://localhost:4000/auth/github/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log("profile", profile);
                let user = await User.findUserBySocialId(profile.id);
                if (!user) {
                    const email = profile.emails && profile.emails[0].value;
                    const avatar = profile.photos[0].value;
                    const fullName = profile.displayName || profile.username;
                    user = await User.createUserGithub(
                        fullName,
                        profile.id,
                        email,
                        avatar
                    );
                }
                return done(null, user);
            } catch (error) {
                console.log("error github ở đây", error);
                return done(error, false, { message: error.message }); // Trả về lỗi nếu có
            }
        }
    )
);

export default passport;
