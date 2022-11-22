const express = require("express");
const router = express.Router();
// import du package cloudinary
const cloudinary = require("cloudinary").v2;
// import du package express-fileupload
const fileUpload = require("express-fileupload");
// import du middleware isAuthenticated
const isAuthenticated = require("../middlewares/isAuthenticated");
// import de la fonction de conversion en base 64:
const { convertToBase64, test } = require("../utils/converterB64");

const Offer = require("../models/Offer");

// le package express-fileupload s'utilise en middleware directement dans la route concernée
router.post(
  "/offer/publish",
  isAuthenticated,
  fileUpload(),
  async (req, res) => {
    try {
      // destructuring :
      const { title, description, price, condition, city, brand, size, color } =
        req.body;

      // conversion de l'image en base 64 pour permettre l'upload :
      const pictureToUpload = convertToBase64(req.files.picture);
      const newOffer = new Offer({
        product_name: title,
        product_description: description,
        product_price: price,
        product_details: [
          {
            MARQUE: brand,
          },
          {
            TAILLE: size,
          },
          {
            ÉTAT: condition,
          },
          {
            COULEUR: color,
          },
          {
            EMPLACEMENT: city,
          },
        ],
        owner: req.user,
      });
      // envoi de l'image sur cloudinary, qui nous renvoi en retour un objet contenant toutes les infos de l'image (secure_url, format, taille... etc...)
      const uploadResult = await cloudinary.uploader.upload(pictureToUpload, {
        folder: `/vinted/offers/${newOffer._id}`,
      });
      newOffer.product_image = uploadResult;

      await newOffer.save(); // sauvegarde dans la base de données

      res.status(201).json(newOffer);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

router.get("/offers", async (req, res) => {
  try {
    const { title, number, priceMax, priceMin, page, sort } = req.query;
    const filters = {};
    const priceFilter = {};
    const sorting =  {};

    if (title) {
      filters.product_name = new RegExp(title, "i");
    }

    if (priceMin) {
      priceFilter.$gte = priceMin;
    }

    if (priceMax) {
      priceFilter.$lte = priceMax;
    }

    if (Object.values(priceFilter).length) {
      filters.product_price = priceFilter;
    }

    if (sort) {
      if (sort.includes('asc')) {
        sorting.product_price = 'asc';

      } else if (sort.includes('desc')) {
        sorting.product_price = 'desc';
      }

    }
    console.log(sorting);
    const offersFound = await Offer.find(filters).sort(sorting).limit();

    res.status(200).json(offersFound);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
