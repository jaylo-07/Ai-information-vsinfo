require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

// view engine setup (optional, if you use jade/pug)
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");   // ✅ change jade → ejs

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", indexRouter);
app.use("/users", usersRouter);

// Catch 404
app.use(function (req, res, next) {
  res.status(404).json({ error: "Not Found" });
});

// Error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    error: err.message,
    stack: req.app.get("env") === "development" ? err.stack : {},
  });
});

module.exports = app;
