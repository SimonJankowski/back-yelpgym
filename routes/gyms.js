import express from "express";
import catchAsync from "../utils/catchAsync.js";
import { isLoggedIn, isAuthor, validateGym } from "../middleware.js";
import * as gyms from "../controllers/gyms.js";

const router = express.Router();

router.get("/", catchAsync(gyms.index));

router.post("/new", isLoggedIn, validateGym, catchAsync(gyms.createGym));

router.get("/:id", catchAsync(gyms.showGym));

router.post("/:id/update", isLoggedIn, isAuthor, validateGym, catchAsync(gyms.updateGym));

router.get("/:id/delete", isAuthor, isLoggedIn, catchAsync(gyms.deleteGym));

export default router;
