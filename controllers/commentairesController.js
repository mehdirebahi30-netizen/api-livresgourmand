const db = require("../config/db");

// Ajouter commentaire
exports.addCommentaire = (req, res) => {
  const clientId = req.user.id;
  const { ouvrageId } = req.params;
  const { contenu } = req.body;

  db.query(
    "INSERT INTO commentaires (client_id, ouvrage_id, contenu, valide, date_soumission) VALUES (?, ?, ?, false, NOW())",
    [clientId, ouvrageId, contenu],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ msg: "Commentaire soumis (en attente de validation)" });
    }
  );
};

// Valider commentaire (editeur)
exports.validateCommentaire = (req, res) => {
  const { id } = req.params;
  const editeurId = req.user.id;

  db.query(
    "UPDATE commentaires SET valide = true, date_validation = NOW(), valide_par = ? WHERE id = ?",
    [editeurId, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ msg: "Commentaire validé" });
    }
  );
};