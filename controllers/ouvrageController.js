const db = require("../config/db");

exports.getAll = (req, res) => {
  db.query("SELECT * FROM ouvrages WHERE stock > 0", (err, result) => {
    res.json(result);
  });
};
exports.create = (req, res) => {
  const { titre, auteur, prix, stock, categorie_id } = req.body;

  db.query(
    "INSERT INTO ouvrages (titre, auteur, prix, stock, categorie_id) VALUES (?, ?, ?, ?, ?)",
    [titre, auteur, prix, stock, categorie_id],
    (err, result) => {
      res.json("Ouvrage ajouté");
    }
  );
};

//GET /api/ouvrages/:id : détail (incl. avis validés)
exports.getById = (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT o.*, c.nom AS categorie FROM ouvrages o JOIN categories c ON o.categorie_id = c.id WHERE o.id = ?",
    [id], (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.length === 0) return res.status(404).json({ msg: "Ouvrage non trouvé" });

      db.query(
        "SELECT a.note, a.commentaire, a.date, u.nom AS client FROM avis a JOIN users u ON a.client_id = u.id WHERE a.ouvrage_id = ? AND a.valide = 1",
        [id], (err, avis) => {  
          if (err) return res.status(500).json(err);
          const ouvrage = result[0];
          ouvrage.avis = avis;
          res.json(ouvrage);
        } 
      );
    }
  );
};
// post /api/ouvrages
exports.create = (req, res) => {
  const { titre, auteur, prix, stock, categorie_id } = req.body;  
  db.query(
    "INSERT INTO ouvrages (titre, auteur, prix, stock, categorie_id) VALUES (?, ?, ?, ?, ?)",
    [titre, auteur, prix, stock, categorie_id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ msg: "Ouvrage ajouté", id: result.insertId });
    }
  );
};
// PUT /api/ouvrages/:id
exports.update = (req, res) => {
  const { id } = req.params;
  const { titre, auteur, prix, stock, categorie_id } = req.body;
  db.query(
    "UPDATE ouvrages SET titre = ?, auteur = ?, prix = ?, stock = ?, categorie_id = ? WHERE id = ?",
    [titre, auteur, prix, stock, categorie_id, id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ msg: "Ouvrage mis à jour" });
    }
  );
};
// DELETE /api/ouvrages/:id
exports.delete = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM ouvrages WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ msg: "Ouvrage supprimé" });
  });
};

//GET /api/categories / POST / PUT / DELETE (role: editeur/gestionnaire)
exports.getCategories = (req, res) => {
  db.query("SELECT * FROM categories", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

exports.createCategory = (req, res) => {
  const { nom } = req.body;
  db.query("INSERT INTO categories (nom) VALUES (?)", [nom], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ msg: "Catégorie ajoutée", id: result.insertId });
  });
};

exports.updateCategory = (req, res) => {
  const { id } = req.params;
  const { nom } = req.body;
  db.query("UPDATE categories SET nom = ? WHERE id = ?", [nom, id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ msg: "Catégorie mise à jour" });
  });
};

exports.deleteCategory = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM categories WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ msg: "Catégorie supprimée" });
  });
};








