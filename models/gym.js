import mongoose from "mongoose";
import Review from "./review.js";
const Schema = mongoose.Schema;

const GymSchema = new Schema({
  title: String,
  images: [{ url: String, filename: String }],
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ]
});

GymSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.remove({
      _id: { $in: doc.reviews }
    });
  }
});

export default mongoose.model("Gym", GymSchema);
