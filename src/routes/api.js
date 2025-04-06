const express = require("express");
const router = express.Router();
const disruptionController = require("../controllers/disruptionController");
const { validateLineNameQuery } = require("../middlewares/validation");

router.get("/status", (req, res) => {
  res.json({ status: "online", message: "API is working properly" });
});

router.get(
  "/disruptions",
  validateLineNameQuery,
  disruptionController.getDisruptions
);

router.get(
  "/disruptions/cached",
  validateLineNameQuery,
  disruptionController.getCachedDisruptions
);

module.exports = router;
