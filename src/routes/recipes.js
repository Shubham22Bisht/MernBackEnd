import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import { verifyToken } from "./users.js";
import { RecipeModel } from "../models/Recipe.js";
import { UserModel } from "../models/Users.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Get all recipes
router.get("/", async (req, res) => {
  try {
    const response = await RecipeModel.find({});
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// Create a new recipe
router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  const { name, ingredients, instructions, imageUrl, cookingTime, userOwner } = req.body;
  let image = null;

  if (req.file) {
    image = req.file.buffer.toString("base64");
  }

  const newRecipe = new RecipeModel({
    name,
    ingredients: JSON.parse(ingredients),
    instructions,
    imageUrl,
    image,
    cookingTime,
    userOwner,
  });

  try {
    const response = await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create recipe" });
  }
});

// Get a recipe by ID
router.get("/:recipeId", async (req, res) => {
  try {
    const result = await RecipeModel.findById(req.params.recipeId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Save a recipe
router.put("/", verifyToken, async (req, res) => {
  try {
    const recipe = await RecipeModel.findById(req.body.recipeID);
    const user = await UserModel.findById(req.body.userID);
    user.savedRecipes.push(recipe);
    await user.save();
    res.status(201).json({ savedRecipes: user.savedRecipes });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// Delete a recipe
router.delete("/",verifyToken, async (req, res) => {
  const { recipeID, userID } = req.body;
  try {
    const user = await UserModel.findById(userID);
    user.savedRecipes = user.savedRecipes.filter(
      (savedRecipeID) => savedRecipeID?.toString() !== recipeID
    );
    await user.save();
    res.status(200).json({ savedRecipes: user.savedRecipes });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// Get IDs of saved recipes
router.get("/savedRecipes/ids/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    res.status(201).json({ savedRecipes: user?.savedRecipes });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// Get saved recipes
router.get("/savedRecipes/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    const savedRecipes = await RecipeModel.find({
      _id: { $in: user?.savedRecipes },
    });
    res.status(201).json({ savedRecipes });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

export { router as recipesRouter };
