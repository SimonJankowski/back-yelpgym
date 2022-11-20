import mongoose from "mongoose";
import Review from "./review.js";
const Schema = mongoose.Schema;

const GymSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
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
