const express = require("express");
const router = express.Router();
const listeController = require("../controllers/listeController");
const authMiddleware = require("../middlewares/authMiddleware"); //

// POST /api/listes
router.post("/", authMiddleware, listeController.createListe);

module.exports = router;