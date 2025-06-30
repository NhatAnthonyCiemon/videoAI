import trendRouter from "../app/trend/route.js";
import contentRouter from "../app/content/route.js";
import storeRouter from "../app/store/route.js";
import videoRouter from "../app/video/route.js";
import authRouter from "../app/auth/route.js";
import userRouter from "../app/user/route.js";
import editRouter from "../app/edit/route.js";
import shareRouter from "../app/share/route.js";
import animRouter from "../app/animation/route.js";

function route(app) {
    app.use("/trend", trendRouter);
    app.use("/content", contentRouter);
    app.use("/store", storeRouter);
    app.use("/video", videoRouter);
    app.use("/auth", authRouter);
    app.use("/trend", trendRouter);
    app.use("/content", contentRouter);
    app.use("/store", storeRouter);
    app.use("/video", videoRouter);
    app.use("/auth", authRouter);
    app.use("/user", userRouter);
    app.use("/edit", editRouter);
    app.use("/share", shareRouter);
    app.use("/anim", animRouter);
    app.use((req, res) => {
        res.status(404).json({ error: "Not Found" });
    });
}

export default route;
