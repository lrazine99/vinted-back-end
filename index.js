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

app.get("/offers", async (req, res) => {
  try {
    // console.log(req.query.name);
    // const offers = await Offer.find({
    //   product_name: new RegExp(req.query.name, "i"),
    // }).select("product_name product_price -_id");

    // gte => greater than or equal
    //lte => loiwer than or equal
    // const offers = await Offer.find({
    //   product_price: { $gte: req.query.priceMin, $lte: req.query.priceMax },
    // }).select("product_name product_price -_id");

    // const offers = await Offer.find({
    //   product_price: { $gte: req.query.priceMin, $lte: req.query.priceMax },
    //   product_name: new RegExp(req.query.title, "i"),
    // })
    //   .sort({ product_price: "asc" })
    //   .select("product_name product_price -_id");

    // limit permet de limiter le nombre de résultats, ici par exemple, on veut 5 résultats par page :

    // skip = (page * limit) - limit

    // AIDE POUR L'EXO :

    const filters = {};

    const offers = await Offer.find();
    // .sort({ product_price: "asc" })
    // .skip(10)
    // .limit(5)
    // .select("product_name product_price -_id");
    res.status(200).json(offers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

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
