import Gym from "../models/gym.js";
import Review from "../models/review.js";

export const addReview = async (req, res) => {
  const gym = await Gym.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  gym.reviews.push(review);
  review.save();
  gym.save();
  res.status(200).send("review created");
};

export const deleteReview = async (req, res, next) => {
  await Gym.findByIdAndUpdate(req.params.id, { $pull: { reviews: req.params.reviewId } });
  const rev = await Review.findByIdAndDelete(req.params.reviewId);
  if (!rev) {
    res.status(404).send("review does not exist");
  }
  res.status(200).send("review deleted");
};
