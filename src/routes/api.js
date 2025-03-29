const express = require("express");
const router = express.Router();
const disruptionController = require("../controllers/disruptionController");

router.get("/status", (req, res) => {
  res.json({ status: "online", message: "API is working properly" });
});

router.get("/disruptions", disruptionController.getDisruptions);

module.exports = router;
