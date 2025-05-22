import express from "express";
import route from "./routers/index.js";
import dotenv from "dotenv";
import cors from "cors";
import passport from "./config/passport.js";

dotenv.config();

const app = express();
app.use(passport.initialize());
app.use(cors());
app.use(express.static("./src/public"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

route(app);

// Middleware handle errors
app.listen(process.env.PORT, () => {
    console.log(
        `Example app listening at http://localhost:${process.env.PORT}`
    );
});

export default app;
