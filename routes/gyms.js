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

router.get("/:id", async (req, res) => {
  const gym = await Gym.findById(req.params.id).populate("reviews");
  res.send({ gym });
});

router.post(
  "/:id/update",
  validateGym,
  catchAsync(async (req, res, next) => {
    console.log(req.body);
    const gym = await Gym.findByIdAndUpdate(req.params.id, { ...req.body.gym });
    res.status(200).send(gym._id);
  })
);

router.get("/:id/delete", async (req, res) => {
  const gym = await Gym.findByIdAndDelete(req.params.id);
  res.status(200).send("ok");
});

export default router;
