import express from "express";
import catchAsync from "../utils/catchAsync.js";
import ExpressError from "../utils/ExpressError.js";
import Gym from "../models/gym.js";
import Review from "../models/review.js";
import { reviewSchema } from "../joiSchemas.js";

const router = express.Router({ mergeParams: true });

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    console.log(req.body);
    const gym = await Gym.findById(req.params.id);
    const review = new Review(req.body.review);
    gym.reviews.push(review);
    review.save();
    gym.save();
    res.status(200).send("you made it");
  })
);

router.get(
  "/:reviewId",
  catchAsync(async (req, res, next) => {
    console.log(req.body);
    await Gym.findByIdAndUpdate(req.params.id, { $pull: { reviews: req.params.reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    res.status(200).send("review deleted");
  })
);

export default router;
