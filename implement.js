const express = require("express");
const path = require("node:path");
const session = require("express-session");
const { setupCanScreen } = require("./CanScreen");
require("dotenv").config();

const app = express();

app.set('trust proxy', 1);

app.use(
    session({
        secret: process.env.EXPRESSJS_SECRET,
        resave: true,
        saveUninitialized: true,
        rolling: true,
        cookie: {
            secure: false,
            sameSite: 'lax',
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        },
    })
);

setupCanScreen(app);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/static/real.html"));
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});