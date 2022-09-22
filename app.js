import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import Gym from "./models/gym.js";

const app = express();

mongoose.connect("mongodb://localhost:27017/yelp-gym");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("hello from yelpgym");
});

app.get("/gyms", async (req, res) => {
  const gyms = await Gym.find({});
  res.send({ gyms });
});

app.post("/gyms/new", async (req, res) => {
  const gym = new Gym(req.body);
  await gym.save();
  console.log(gym);
  res.status(200).send(gym._id);
});

app.get("/gyms/:id", async (req, res) => {
  const gym = await Gym.findById(req.params.id);
  res.send({ gym });
});

app.post("/gyms/:id/update", async (req, res) => {
  console.log(req.body);
  const gym = await Gym.findByIdAndUpdate(req.params.id, { ...req.body });
  res.status(200).send(gym._id);
});

app.get("/gyms/:id/delete", async (req, res) => {
  const gym = await Gym.findByIdAndDelete(req.params.id);
  res.status(200).send("ok");
});

app.listen(3001, () => {
  console.log("YELPGYM BACKEND serving on port 3001");
});
