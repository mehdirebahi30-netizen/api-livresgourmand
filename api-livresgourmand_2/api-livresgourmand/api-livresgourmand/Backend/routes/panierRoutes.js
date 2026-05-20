const express = require("express");
const router = express.Router();
const panierController = require("../controllers/panierController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, panierController.getPanier);
router.post("/items", authMiddleware, panierController.addItem);
router.put("/items/:id", authMiddleware, panierController.updateItem);
router.delete("/items/:id", authMiddleware, panierController.deleteItem);

module.exports = router;