import express from "express";
import mongoose from "mongoose";
import Gym from "./models/gym.js";

const app = express();

mongoose.connect("mongodb://localhost:27017/yelp-gym");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.get("/", (req, res) => {
  res.send("hello from yelpgym");
});

app.get("/makegym", async (req, res) => {
  const gym = new Gym({ title: "dungeon", description: "hardcore real gym" });
  await gym.save();
  res.send(gym);
});

app.listen(3001, () => {
  console.log("YELPGYM BACKEND serving on port 3001");
});
