import express from "express";
import catchAsync from "../utils/catchAsync.js";
import ExpressError from "../utils/ExpressError.js";
import Gym from "../models/gym.js";
import { gymJoiSchema, reviewSchema } from "../joiSchemas.js";

const router = express.Router();

const validateGym = (req, res, next) => {
  const { error } = gymJoiSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get("/", async (req, res) => {
  const gyms = await Gym.find({});
  res.send({ gyms });
});

router.post(
  "/new",
  validateGym,
  catchAsync(async (req, res, next) => {
    const gym = new Gym(req.body.gym);
    await gym.save();
    res.status(200).send(gym._id);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const gym = await Gym.findById(req.params.id).populate("reviews");
    res.send({ gym });
  })
);

router.post(
  "/:id/update",
  validateGym,
  catchAsync(async (req, res, next) => {
    const gym = await Gym.findByIdAndUpdate(req.params.id, { ...req.body.gym });
    res.status(200).send(gym._id);
  })
);

router.get(
  "/:id/delete",
  catchAsync(async (req, res) => {
    const gym = await Gym.deleteOne({ _id: req.params.id });
    if (!gym) {
      res.status(404).send("gym does not exist");
    }
    res.status(200).send("gym deleted successfully");
  })
);

export default router;
