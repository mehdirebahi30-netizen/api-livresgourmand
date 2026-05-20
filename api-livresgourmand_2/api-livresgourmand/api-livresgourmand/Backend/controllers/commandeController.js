const db = require("../config/db");

// Créer commande
exports.createCommande = (req, res) => {
  const clientId = req.user.id;

  db.query("SELECT * FROM panier WHERE client_id = ? AND actif = 1", [clientId], (err, panierResult) => {
    if (err) return res.status(500).json({ error: err });
    if (panierResult.length === 0) return res.status(400).json({ msg: "Panier vide" });

    const panierId = panierResult[0].id;
    db.query("SELECT * FROM panier_items WHERE panier_id = ?", [panierId], (err, items) => {
      if (err) return res.status(500).json({ error: err });
      if (items.length === 0) return res.status(400).json({ msg: "Panier vide" });

      // Vérifier stock
      const outOfStock = items.filter(item => item.quantite > item.stock);
      if (outOfStock.length > 0) return res.status(400).json({ msg: "Stock insuffisant pour certains articles" });

      // Calcul total
      let total = 0;
      items.forEach(item => total += item.quantite * item.prix_unitaire);

      // Créer commande
      db.query(
        "INSERT INTO commandes (client_id, date, total, statut) VALUES (?, NOW(), ?, 'en_cours')",
        [clientId, total],
        (err, result) => {
          if (err) return res.status(500).json({ error: err });
          const commandeId = result.insertId;

          // Ajouter items commande
          const commandeItems = items.map(i => [commandeId, i.ouvrage_id, i.quantite, i.prix_unitaire]);
          db.query("INSERT INTO commande_items (commande_id, ouvrage_id, quantite, prix_unitaire) VALUES ?", [commandeItems], (err, result) => {
            if (err) return res.status(500).json({ error: err });

            // Décrémenter stock
            items.forEach(i => {
              db.query("UPDATE ouvrages SET stock = stock - ? WHERE id = ?", [i.quantite, i.ouvrage_id]);
            });

            // Marquer panier inactif
            db.query("UPDATE panier SET actif = 0 WHERE id = ?", [panierId]);

            res.json({ msg: "Commande créée", commandeId });
          });
        }
      );
    });
  });
};

// Historique client
exports.getCommandes = (req, res) => {
  const clientId = req.user.id;
  db.query("SELECT * FROM commandes WHERE client_id = ?", [clientId], (err, commandes) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ commandes });
  });
};

// Détail commande
exports.getCommandeById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM commandes WHERE id = ?", [id], (err, commandes) => {
    if (err) return res.status(500).json({ error: err });
    if (commandes.length === 0) return res.status(404).json({ msg: "Commande introuvable" });

    db.query("SELECT * FROM commande_items WHERE commande_id = ?", [id], (err, items) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ commande: commandes[0], items });
    });
  });
};

// Mettre à jour statut (admin/gestionnaire)
exports.updateStatus = (req, res) => {
  const { id } = req.params;
  const { statut } = req.body;

  db.query("UPDATE commandes SET statut = ? WHERE id = ?", [statut, id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ msg: "Statut mis à jour" });
  });
};