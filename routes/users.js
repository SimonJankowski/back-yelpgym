import express from "express";
import passport from "passport";
import User from "../models/user.js";
import ExpressError from "../utils/ExpressError.js";
import catchAsync from "../utils/catchAsync.js";

const router = express.Router();

router.post(
  "/register",
  catchAsync(async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) return next();
        res.status(200).send("Welcome to YelpGym");
      });
    } catch (error) {
      throw new ExpressError(error.message, 409);
    }
  })
);

router.post(
  "/login",
  passport.authenticate("local"),
  catchAsync((req, res) => {
    return res.status(200).send("Welcome back!");
  })
);

router.get(
  "/logout",
  catchAsync((req, res) => {
    console.log("hit it");
    req.logout((err) => {
      if (err) return next(err);
      res.status(200).send("Successfully logged out");
    });
  })
);

router.get(
  "/get-user",
  catchAsync(async (req, res) => {
    res.status(200).send(req.user);
  })
);

export default router;
