const router = require("express").Router();
const jwt = require("jsonwebtoken");
const multer = require("multer");

const Party = require("../models/party");
const User = require("../models/user");

//define file storage
const diskStorage = require("../helpers/file-storage");
const upload = multer({ storage: diskStorage });

const verifyToken = require("../helpers/check-token");

const getUserByToken = require("../helpers/get-user-by-token");

router.get("/all", async (req, res) => {
  try {
    const parties = await Party.find({ privacy: false }).sort([["_id", -1]]);
    res.json({ error: null, parties: parties });
  } catch (error) {
    return res.status(404).json({ error });
  }
});

router.post(
  "/",
  verifyToken,
  upload.fields([{ name: "photos" }]),
  async (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const partyDate = req.body.party_date;

    let files = [];
    if (req.files) {
      files = req.files.photos;
    }
    if (title == "null" || description == "null" || partyDate == "null") {
      return res.status(400).json({
        error: "Preencha os campos obrigatórios: nome, descrição e data",
      });
    }

    const token = req.header("auth-token");

    const userByToken = await getUserByToken(token);
    const userId = userByToken._id.toString();
    try {
      const user = await User.findOne({ _id: userId });

      let photos = [];

      if (files && files.length > 0) {
        files.forEach((photo, key) => {
          photos[key] = photo.path;
        });
      }

      const party = new Party({
        title: title,
        description: description,
        partyDate: partyDate,
        photos: photos,
        privacy: req.body.privacy,
        userID: user._id.toString(),
      });

      try {
        const newParty = await party.save();
        return res.json({
          error: null,
          msg: "Evento criado com sucesso",
          data: newParty,
        });
      } catch (error) {
        return res.status(400).json({ error });
      }
    } catch (error) {
      return res.status(400).json({
        error: "Acesso negado",
      });
    }
  }
);

module.exports = router;
