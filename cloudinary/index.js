import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
if (process.env.NODE.ENV !== "production") {
  dotenv.config();
}

console.log(process.env.API_SECRET);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

export default cloudinary;
