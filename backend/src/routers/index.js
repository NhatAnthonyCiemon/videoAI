const userRouter = require("../app/user/route");
const trendRouter = require("../app/trend/route");
const contentRouter = require("../app/content/route");
const storeRouter = require("../app/store/route");

function route(app) {
    app.use("/user", userRouter);
    app.use("/trend", trendRouter);
    app.use("/content", contentRouter);
    app.use("/store", storeRouter);
    app.use((req, res) => {
        res.status(404).json({ error: "Not Found" });
    });
}

module.exports = route;
