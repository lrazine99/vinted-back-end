// La ligne suivante ne doit être utilisée qu'une seule fois et au tout début du projet. De préférence dans index.js
require('dotenv').config(); // Permet d'activer les variables d'environnement qui se trouvent dans le fichier `.env`

// import du package express
const express = require("express");
// import du package mongoose
const mongoose = require("mongoose");
//permet deblocage sécurité serveur
const cors = require("cors");
// import du package cloudinary
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

// créer notre serveur
const app = express();

// utiliser express.json pour pouvoir lire les paramètres de type body (middleware global) :
app.use(express.json());
app.use(cors());

// établir la connexion avec mongoose :
mongoose.connect(process.env.MONGODB_URI);

// import des routes :
const userRoutes = require("./routes/user");
app.use(userRoutes);
const offerRoutes = require("./routes/offer");
app.use(offerRoutes);

// faire la route app.all (toujours la laisser tout en bas)
app.all("*", (req, res) => {
  try {
    res.status(404).json("Not found");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// lancer le serveur (le mettre à l'écoute/ en ligne)
app.listen(process.env.PORT, () => {
  console.log("Server is on fire 🔥 on port " + process.env.PORT);
});
