const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/ouvrageController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

// Tout le monde peut voir
router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);

// Seuls les gestionnaires et éditeurs peuvent créer
router.post("/", 
  authMiddleware, 
  authorize(["gestionnaire", "editeur"]), 
  ctrl.create
);

router.get("/categories", ctrl.getCategories);
router.post("/categories", 
  authMiddleware, 
  authorize(["gestionnaire", "editeur"]), 
  ctrl.createCategory
);
router.put("/categories/:id", 
  authMiddleware, 
  authorize(["gestionnaire", "editeur"]), 
  ctrl.updateCategory
);
router.delete("/categories/:id", 
  authMiddleware, 
  authorize(["gestionnaire", "editeur"]), 
  ctrl.deleteCategory
);


module.exports = router;