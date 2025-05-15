import passport from "../config/passport.js";
import { createErrorResponse } from "../utils/responseAPI.js";
const middleware = {
    isAuthenticated: (req, res, next) => {
        passport.authenticate("jwt", { session: false }, (err, user) => {
            if (!user) {
                res.status(401).json(createErrorResponse(401, "Unauthorized"));
                return;
            }
            req.user = user;
            next();
        })(req, res, next);
    },
};

export default middleware;
