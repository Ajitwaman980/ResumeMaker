// app.js
const express = require("express");
const app = express();
const cookiesparser = require("cookie-parser");
const path = require("path");
const indexRouter = require("./src/index");
const jwt = require("jsonwebtoken");
const { log } = require("console");
const index = require("./src/index");
const flash = require("connect-flash");
const usermodel = require("./src/model/user");
const session = require("express-session");
const ejsmate = require("ejs-mate");
const currentUser = require("./src/middleware/verifyuser");
const methodoveride = require("method-override");
const compression =require("compression")


app.set("view engine", "ejs");
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(cookiesparser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodoveride("_method"));
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "Ajitwaman",
    cookie: { maxAge: 2 * 60 * 60 * 1000 }, //2 day
  })
);
app.use(flash());
app.use(compression());
// session destory
app.use("/", index);

const port = 3000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

module.exports = app;
