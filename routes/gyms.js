import express from "express";
import catchAsync from "../utils/catchAsync.js";
import ExpressError from "../utils/ExpressError.js";
import Gym from "../models/gym.js";
import { gymJoiSchema, reviewSchema } from "../joiSchemas.js";
import { isLoggedIn, isAuthor, validateGym } from "../middleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  console.log(req.isAuthenticated());
  const gyms = await Gym.find({});
  res.send({ gyms });
});

router.post(
  "/new",
  isLoggedIn,
  validateGym,
  catchAsync(async (req, res, next) => {
    const gym = new Gym(req.body.gym);
    gym.author = req.user._id;
    await gym.save();
    res.status(200).send(gym._id);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const gym = await Gym.findById(req.params.id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("author");
    res.send({ gym });
  })
);

router.post(
  "/:id/update",
  isLoggedIn,
  isAuthor,
  validateGym,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const gym = await Gym.findByIdAndUpdate(id, { ...req.body.gym });
    console.log(gym);
    return res.status(200).send(id);
  })
);

router.get(
  "/:id/delete",
  isAuthor,
  isLoggedIn,
  catchAsync(async (req, res) => {
    const gym = await Gym.deleteOne({ _id: req.params.id });
    if (!gym) {
      res.status(404).send("gym does not exist");
    }
    res.status(200).send("gym deleted successfully");
  })
);

export default router;
