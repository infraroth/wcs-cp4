import express from "express";
import Joi from "joi";
import Art from "../models/artModel.js";
//import slugify from "slugify";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "public");
  },
  filename: (req, file, callBack) => {
    callBack(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

const schemaArt = Joi.object({
  name: Joi.string().max(255).required(),
  image: Joi.string().max(255).required(),
  description: Joi.string().required(),
});

router.get("/", async (req, res) => {
  try {
    const art = await Art.getAll();
    if (art) return res.status(200).json(art);
    else res.status(404).json({ message: "Art not found" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const art = await Art.getOneById(id);
    if (art) return res.status(200).json(art);
    else res.status(404).json({ message: "Art not found" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/user/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const art = await Art.getAllByUser(id);
    if (art) return res.status(200).json(art);
    else res.status(404).json({ message: "Art not found" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/", upload.single("imgage"), async (req, res) => {
  const { name, description, user_id } = req.body;
  const image = `http://localhost:8000/${req.file.filename}`;
  try {
    const { error, value } = await schemaArt.validate({
      name,
      image,
      description,
    });
    const lastInsertId = await Art.createNew(value);
    console.log(lastInsertId);
    if (lastInsertId) {
      const newUserArt = await Art.addUserToArt(user_id, lastInsertId);
      const newArt = await Art.getOneById(lastInsertId);
      res.status(201).json({ artwork_id: newArt.id, user_artwork: newUserArt.insertId });
    } else res.status(422).json({ message: error.message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// router.post("/", async (req, res) => {
//   const { name, image, description, user_id } = req.body;
//   try {
//     // const { error, value } = await schemaArt.validate({
//     //   name,
//     //   image,
//     //   description,
//     // });
//     const lastInsertId = await Art.createNew({ name, image, description, user_id });
//     console.log(lastInsertId);
//     if (lastInsertId) {
//       const newUserArt = await Art.addUserToArt(user_id, lastInsertId);
//       const newArt = await Art.getOneById(lastInsertId);
//       res.status(201).json({ artwork_id: newArt.id, user_artwork: newUserArt.insertId });
//     } else res.status(422).json({ message: error.message });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

router.put("/:id", upload.single("img"), async (req, res) => {
  const { name, description } = req.body;
  let { image } = req.body;
  if (!image) {
    if (req.file) {
      image = `http://localhost:8000/${req.file.filename}`;
    }
  }
  try {
    const { error, value } = await schemaArt.validate({
      name,
      description,
      image,
    });
    const artUpdate = await Art.updateArt(req.params.id, value);
    if (artUpdate) res.status(201).json(value);
    else res.status(422).json({ message: error.message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await Art.deleteById(id);
    result
      ? res.json({ message: `ArtId ${id} has been deleted !` })
      : res.status(404).json({ message: "Art not found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



export default router;