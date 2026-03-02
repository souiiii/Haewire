import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectToMongoose from "./connection.js";

const app = express();
const PORT = process.env.PORT || 8000;
const MONGO_PATH = process.env.MONGO_PATH;

connectToMongoose(MONGO_PATH)
  .then(() => {
    console.log("database connected");
    app.listen(PORT, () => console.log("server started"));
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
