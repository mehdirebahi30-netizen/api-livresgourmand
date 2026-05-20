const db = require("../config/db");

// GET /api/users/me
exports.getMe = (req, res) => {
  
  const sql = "SELECT id, nom, email, role FROM users WHERE id = ?";
  db.query(sql, [req.user.id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0) return res.status(404).json({ msg: "Utilisateur non trouvé" });
    res.json(result[0]);
  });
};

// GET /api/users (Admin uniquement)
exports.getAllUsers = (req, res) => {
  // Changement : utilisateurs -> users
  db.query("SELECT id, nom, email, role FROM users", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// PUT /api/users/:id
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { nom, email } = req.body;

  if (req.user.role !== "administrateur" && req.user.id != id) {
    return res.status(403).json({ msg: "Non autorisé" });
  }

  
  db.query(
    "UPDATE users SET nom = ?, email = ? WHERE id = ?",
    [nom, email, id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ msg: "Profil mis à jour" });
    }
  );
};