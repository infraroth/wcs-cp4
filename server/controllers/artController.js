import express from "express";
//import Joi from "joi";
import Art from "../models/artModel.js";
//import slugify from "slugify";
//import multer from "multer";
// import path from "path";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const brand = await Art.getAll();
    if (brand) return res.status(200).json(brand);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;