import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import {userRouter} from './routes/users.js'
import {recipesRouter} from './routes/recipes.js';
import dotenv from "dotenv";
dotenv.config();

const PORT =process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(cors());


app.use("/auth",userRouter);
app.use("/recipes",recipesRouter);

mongoose.connect(
  process.env.MONGODB_URI
).then(console.log("conected to database"));
app.get("/", (req, res) => {
  res.send("kutte ka bachha");
});
app.listen(PORT, () => {
  console.log("Server Started");
});

