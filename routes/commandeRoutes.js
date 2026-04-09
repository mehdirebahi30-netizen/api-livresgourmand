const express = require("express");
const router = express.Router();
const commandeController = require("../controllers/commandeController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// Créer commande
router.post("/", authMiddleware, commandeController.createCommande);

// Historique client
router.get("/", authMiddleware, commandeController.getCommandes);

// Détail commande
router.get("/:id", authMiddleware, commandeController.getCommandeById);

// Mettre à jour statut (admin/gestionnaire)
router.put("/:id/status", authMiddleware, roleMiddleware(["admin","gestionnaire"]), commandeController.updateStatus);

module.exports = router;