const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// Charger variables d'environnement
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//Config DB
const db = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

const ouvrageRoutes = require("./routes/ouvrageRoutes");
app.use("/api/ouvrages", ouvrageRoutes);

const panierRoutes = require("./routes/panierRoutes");
app.use("/api/panier", panierRoutes);

const commandeRoutes = require("./routes/commandeRoutes");
app.use("/api/commandes", commandeRoutes);

const listeRoutes = require('./routes/listeRoutes.js');
app.use("/api/listes", listeRoutes);

const avisRoutes = require("./routes/avisRoutes");
app.use("/api/ouvrages/:id/avis", avisRoutes);

const commentairesRoutes = require("./routes/commentairesRoutes");
const authMiddleware = require("./middlewares/authMiddleware");


app.use("/api/ouvrages/:id/commentaires", commentairesRoutes);

//Test route (pour vérifier JWT)
app.get("/test", authMiddleware, (req, res) => {
  res.json({ msg: "Token OK", user: req.user });
});

app.get("/", (req, res) => {
  res.send("API Livres Gourmand est en ligne !");
});

const PORT = process.env.PORT || 5000;

// Lancer serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur port ${PORT}`);
});