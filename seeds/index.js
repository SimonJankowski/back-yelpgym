import mongoose from "mongoose";
import cities from "./cities.js";
import { names, descriptors } from "./seedHelpers.js";
import Gym from "../models/gym.js";

mongoose.connect("mongodb://localhost:27017/yelp-gym");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Gym.deleteMany({});
  for (let i = 0; i < 25; i++) {
    const random25 = Math.floor(Math.random() * 25);
    const random6 = Math.floor(Math.random() * 6);
    const price = Math.floor(Math.random() * 100) + 10;
    const gym = new Gym({
      location: `${cities[random25].city}, ${cities[random25].state}`,
      title: `${sample(descriptors)} ${sample(names)}`,
    });
    await gym.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
