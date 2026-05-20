const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { nom, email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (nom, email, password_hash) VALUES (?, ?, ?)",
    [nom, email, hash],
    (err, result) => {
      if (err) return res.json(err);
      res.json("Utilisateur créé");
    },
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {
      if (result.length === 0) return res.json("User not found");

      const user = result[0];

      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) return res.json("Mot de passe incorrect");

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || "secret123",
        { expiresIn: "1h" },
      );

      res.json({ token });
    },
  );
};
