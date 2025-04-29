const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const UserService = require("../app/user/service");
const dotenv = require("dotenv");

dotenv.config();

const passport = require("passport");

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};

const strategy = new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const user = await UserService.getById(jwt_payload.id);
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

module.exports = passport;
