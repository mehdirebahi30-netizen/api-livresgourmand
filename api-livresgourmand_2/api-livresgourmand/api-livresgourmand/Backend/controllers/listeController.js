const db = require("../config/db");
const crypto = require("crypto"); // Module natif de Node.js

exports.createListe = (req, res) => {
  const clientId = req.user.id; // Récupéré via le token
  const { nom } = req.body;

  if (!nom) return res.status(400).json({ msg: "Le nom de la liste est requis" });

  // Génération d'un code de 8 caractères (ex: 4F2A9B12)
  const codePartage = crypto.randomBytes(4).toString('hex').toUpperCase();

  db.query(
    "INSERT INTO listes (client_id, nom, code_partage) VALUES (?, ?, ?)",
    [clientId, nom, codePartage],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ 
        msg: "Liste créée", 
        listeId: result.insertId, 
        code_partage: codePartage 
      });
    }
  );
};