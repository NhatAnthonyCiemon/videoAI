const userRouter = require("../app/user/route");
const editRouter = require("../app/edit/route");

function route(app) {
    app.use("/", (req, res) => {
        res.send("Hello World");
    });
    app.use("/user", userRouter);
    app.use("/edit", editRouter);
}

module.exports = route;
