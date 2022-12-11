import express from "express";
import passport from "passport";
import catchAsync from "../utils/catchAsync.js";
import * as users from "../controllers/users.js";

const router = express.Router();

router.post("/register", catchAsync(users.registerUser));

router.post("/login", passport.authenticate("local"), catchAsync(users.loginUser));

router.get("/logout", catchAsync(users.logoutUser));

router.get("/get-user", catchAsync(users.getUser));

export default router;
