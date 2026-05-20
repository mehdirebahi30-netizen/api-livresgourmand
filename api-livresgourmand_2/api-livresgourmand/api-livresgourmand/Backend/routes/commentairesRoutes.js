const express = require("express");
const router = express.Router();
const commentairesController = require("../controllers/commentairesController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// Soumettre commentaire 
router.post("/:ouvrageId", authMiddleware, commentairesController.addCommentaire);

// Valider commentaire (editeur)
router.put("/:id/valider", authMiddleware, roleMiddleware(["editeur"]), commentairesController.validateCommentaire);

module.exports = router;