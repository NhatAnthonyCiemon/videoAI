const userRouter = require("../app/user/route");

function route(app) {
    app.use("/", (req, res) => {
        res.send("Hello World");
    });
    app.use("/user", userRouter);
}

module.exports = route;
