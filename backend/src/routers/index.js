import userRouter from "../app/user/route.js";

function route(app) {
    app.use("/user", userRouter);
    app.use("/", (req, res) => {
        res.json({ message: "Hello World" }); // Trả về JSON thay vì chuỗi văn bản
    });
}

export default route;
