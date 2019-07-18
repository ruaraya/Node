const debug = require("debug")("app:startup");
const morgan = require("morgan");
const config = require("config");
const helmet = require("helmet");
const logger = require("./middleware/logger");
const courses = require("./routes/courses");
const home = require("./routes/home");
const express = require("express");
const app = express();

app.set("view engine", "pug"); //using pug
app.set("views", "./views"); //using default view

app.use(express.json()); //enable parsing JSON objects in the nody of the response
app.use(express.urlencoded({ extended: true })); //enable parsing body request with key/pair values
app.use(express.static("public")); //allows to access static content
app.use(helmet());
app.use("/api/courses", courses);
app.use("/", home);

// Configuration
console.log("Application Name: " + config.get("name"));
console.log("Mail Server: " + config.get("mail.host"));
//console.log("Mail Password: " + config.get("mail.password")); it will throw an error as it is not defined within the .json config files

if (app.get("env") === "development") {
  app.use(morgan("tiny")); //enable logging of each HTTP request
  debug("Morgan enabled...");
}

app.use(logger);

app.use(function(req, res, next) {
  console.log("Authenticating...");
  next();
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening in port ${port}...`));
