const db = require("../config/db");

// Ajouter avis
exports.addAvis = (req, res) => {
  const clientId = req.user.id;
  const { ouvrageId } = req.params;
  const { note, commentaire } = req.body;

  // Vérifier achat
  db.query(
    "SELECT * FROM commande_items ci JOIN commandes c ON ci.commande_id = c.id WHERE c.client_id = ? AND ci.ouvrage_id = ?",
    [clientId, ouvrageId],
    (err, achats) => {
      if (err) return res.status(500).json({ error: err });
      if (achats.length === 0) return res.status(400).json({ msg: "Achat requis pour laisser un avis" });

      db.query(
        "INSERT INTO avis (client_id, ouvrage_id, note, commentaire, date) VALUES (?, ?, ?, ?, NOW())",
        [clientId, ouvrageId, note, commentaire],
        (err, result) => {
          if (err) return res.status(500).json({ error: err });
          res.json({ msg: "Avis ajouté" });
        }
      );
    }
  );
};