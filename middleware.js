import ExpressError from "./utils/ExpressError.js";
import { gymJoiSchema, reviewSchema } from "./joiSchemas.js";
import Gym from "./models/gym.js";
import Review from "./models/review.js";

export const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send("Unauthorized");
  }
  next();
};
export const validateGym = (req, res, next) => {
  const { error } = gymJoiSchema.validate(req.body);
  console.log("error", error);
  if (error) {
    console.log("error validating gym");
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

export const isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const gym = await Gym.findById(id);
  if (!gym.author.equals(req.user._id)) {
    return res.status(401).send("You don´t have permission to do that");
  }
  next();
};

export const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    console.log(error);
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

export const isReviewAuthor = async (req, res, next) => {
  const { reviewId } = req.params;
  const review = await Review.findById(reviewId);
  console.log("checking review author");
  if (!review.author.equals(req.user._id)) {
    console.log("it is not an  author");
    return res.status(401).send("You don´t have permission to do that");
  }
  next();
};
