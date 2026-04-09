const db = require("../config/db");

// Récupérer le panier actif
exports.getPanier = (req, res) => {
  const clientId = req.user.id;

  const queryPanier = "SELECT * FROM panier WHERE client_id = ? AND actif = 1";
  db.query(queryPanier, [clientId], (err, panierResult) => {
    if (err) return res.status(500).json({ error: err });

    if (panierResult.length === 0) return res.json({ items: [] });

    const panierId = panierResult[0].id;
    const queryItems = `
      SELECT pi.id, pi.quantite, pi.prix_unitaire, o.titre
      FROM panier_items pi
      JOIN ouvrages o ON pi.ouvrage_id = o.id
      WHERE pi.panier_id = ?
    `;
    db.query(queryItems, [panierId], (err, items) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ panier: panierResult[0], items });
    });
  });
};

// Ajouter un item
exports.addItem = (req, res) => {
  const clientId = req.user.id;
  const { ouvrage_id, quantite } = req.body;

  // Vérifier si panier actif existe
  const queryPanier = "SELECT * FROM panier WHERE client_id = ? AND actif = 1";
  db.query(queryPanier, [clientId], (err, panierResult) => {
    if (err) return res.status(500).json({ error: err });

    let panierId = null;
    if (panierResult.length === 0) {
      // Créer panier actif
      db.query("INSERT INTO panier (client_id, actif) VALUES (?,1)", [clientId], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        panierId = result.insertId;
        insertItem();
      });
    } else {
      panierId = panierResult[0].id;
      insertItem();
    }

    function insertItem() {
      // Récupérer prix de l'ouvrage
      db.query("SELECT prix, stock FROM ouvrages WHERE id = ?", [ouvrage_id], (err, ouvrage) => {
        if (err) return res.status(500).json({ error: err });
        if (ouvrage.length === 0) return res.status(404).json({ msg: "Ouvrage introuvable" });
        if (ouvrage[0].stock < quantite) return res.status(400).json({ msg: "Stock insuffisant" });

        const prix_unitaire = ouvrage[0].prix;
        db.query("INSERT INTO panier_items (panier_id, ouvrage_id, quantite, prix_unitaire) VALUES (?,?,?,?)",
          [panierId, ouvrage_id, quantite, prix_unitaire],
          (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ msg: "Item ajouté au panier" });
          }
        );
      });
    }
  });
};

// Modifier quantité
exports.updateItem = (req, res) => {
  const { id } = req.params;
  const { quantite } = req.body;

  db.query("UPDATE panier_items SET quantite = ? WHERE id = ?", [quantite, id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ msg: "Quantité mise à jour" });
  });
};

// Supprimer item
exports.deleteItem = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM panier_items WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ msg: "Item supprimé du panier" });
  });
};