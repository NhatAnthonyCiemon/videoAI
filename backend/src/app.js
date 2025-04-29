const express = require("express");
const route = require("./routers/index");
const dotenv = require("dotenv");
//const passport = require("./config/passport");

dotenv.config();

const app = express();

app.use(express.static("./src/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

route(app);
//Middleware handle errors
app.listen(process.env.PORT, () => {
    console.log(
        `Example app listening at http://localhost:${process.env.port}`
    );
});

module.exports = app;
