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
    const random1000 = Math.floor(Math.random() * 1000);
    const random6 = Math.floor(Math.random() * 6);
    const price = Math.floor(Math.random() * 100) + 10;
    const gym = new Gym({
      author: "638c930b5eb6d1560db769e5",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(names)}`,
      geometry: {
        type: "Point",
        coordinates: [cities[random1000].longitude, cities[random1000].latitude]
      },
      images: [
        { url: "https://source.unsplash.com/collection/10552289", filename: "default gym" },
        { url: "https://source.unsplash.com/collection/10552289", filename: "default gym2" }
      ],
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti voluptas eaque doloremque est quo et quaerat illum quia dolor, dolores nam itaque quas! Quia, quos nemo? Commodi expedita vitae beatae!",
      price
    });
    await gym.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
