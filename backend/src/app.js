import express from "express";
import route from "./routers/index.js";
import dotenv from "dotenv";
import cors from "cors"; // Import middleware CORS

dotenv.config();

const app = express();

// Cấu hình CORS
app.use(cors({
    origin: "*", // Cho phép tất cả các domain (có thể thay bằng domain cụ thể)
    methods: ["GET", "POST", "PUT", "DELETE"], // Các phương thức được phép
    allowedHeaders: ["Content-Type", "Authorization"], // Các header được phép
}));

app.use(express.static("./src/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

route(app);

// Middleware handle errors
app.listen(process.env.PORT, () => {
    console.log(
        `Example app listening at http://localhost:${process.env.PORT}`
    );
});

export default app;
