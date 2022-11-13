import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import catchAsync from "./utils/catchAsync.js";
import ExpressError from "./utils/ExpressError.js";
import Gym from "./models/gym.js";
import { gymJoiSchema } from "./joiSchemas.js";

const app = express();

mongoose.connect("mongodb://localhost:27017/yelp-gym");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

const validateGym = (req, res, next) => {
  const { error } = gymJoiSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.send("hello from yelpgym");
});

app.get("/gyms", async (req, res) => {
  const gyms = await Gym.find({});
  res.send({ gyms });
});

app.post(
  "/gyms/new",
  validateGym,
  catchAsync(async (req, res, next) => {
    const gym = new Gym(req.body.gym);
    await gym.save();
    res.status(200).send(gym._id);
  })
);

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

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong";
  res.status(statusCode).send(err);
});

app.listen(3001, () => {
  console.log("YELPGYM BACKEND serving on port 3001");
});
