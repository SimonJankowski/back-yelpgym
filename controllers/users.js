import User from "../models/user.js";
import ExpressError from "../utils/ExpressError.js";

export const registerUser = async (req, res, next) => {
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
};

export const loginUser = (req, res) => {
  return res.status(200).send("Welcome back!");
};

export const logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.status(200).send("Successfully logged out");
  });
};

export const getUser = async (req, res) => {
  res.status(200).send(req.user);
};
