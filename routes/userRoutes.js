const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// Route pour obtenir les informations de l'utilisateur connecté
router.get("/me", authMiddleware, userController.getMe);

// Route pour obtenir la liste de tous les utilisateurs (Admin uniquement)
router.get("/", authMiddleware, roleMiddleware(["administrateur"]), userController.getAllUsers);

// Route pour mettre à jour les informations d'un utilisateur (Admin ou Propriétaire)
router.put("/:id", authMiddleware, roleMiddleware(["administrateur"]), userController.updateUser);

module.exports = router;