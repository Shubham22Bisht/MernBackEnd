import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import {userRouter} from './routes/users.js'
import {recipesRouter} from './routes/recipes.js'

const app = express();


app.use(express.json());
app.use(cors());


app.use("/auth",userRouter);
app.use("/recipes",recipesRouter);

mongoose.connect(
  "mongodb+srv://test:recipetest@recipe.3zqsua2.mongodb.net/recipe?retryWrites=true&w=majority"
);
app.get("/", (req, res) => {
  res.send("kutte ka bachha");
});
app.listen(3001, () => {
  console.log("Server Started");
});

