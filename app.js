import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import catchAsync from "./utils/catchAsync.js";
import ExpressError from "./utils/ExpressError.js";
import Gym from "./models/gym.js";
import Review from "./models/review.js";
import { gymJoiSchema, reviewSchema } from "./joiSchemas.js";
import gyms from "./routes/gyms.js";
import reviews from "./routes/reviews.js";

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

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.use("/gyms", gyms);
app.use("/gyms/:id/reviews", reviews);

app.get("/", (req, res) => {
  res.send("hello from yelpgym");
});

// app.post(
//   "/gyms/:id/reviews",
//   validateReview,
//   catchAsync(async (req, res) => {
//     const gym = await Gym.findById(req.params.id);
//     const review = new Review(req.body.review);
//     gym.reviews.push(review);
//     review.save();
//     gym.save();
//     res.status(200).send("you made it");
//   })
// );

// app.get(
//   "/gyms/:gymId/deleteReview/:reviewId",
//   catchAsync(async (req, res, next) => {
//     await Gym.findByIdAndUpdate(req.params.id, { $pull: { reviews: req.params.reviewId } });
//     await Review.findByIdAndDelete(req.params.reviewId);
//     res.status(200).send("review deleted");
//   })
// );

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
