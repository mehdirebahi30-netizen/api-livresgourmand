const express = require("express");
const router = express.Router();
const avisController = require("../controllers/avisController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/:ouvrageId", authMiddleware, avisController.addAvis);

module.exports = router;