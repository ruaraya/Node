const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { title: "My Express App", message: "Hello" }); //displaying the index template defined with pug
});

module.exports = router;
