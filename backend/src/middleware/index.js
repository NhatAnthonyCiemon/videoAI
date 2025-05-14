const middleware = {
    isAuthenticated: (req, res, next) => {
        passport.authenticate("jwt", { session: false }, (err, user) => {
            req.user = user;
            next();
        })(req, res, next);
    },
};

export default middleware;
