import mongoose from "mongoose";
import Review from "./review.js";
const Schema = mongoose.Schema;
const options = { toJSON: { virtuals: true } };

const GymSchema = new Schema(
  {
    title: String,
    images: [{ url: String, filename: String }],
    price: Number,
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
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
  },
  options
);

GymSchema.virtual("properties.popUpMarkup").get(function () {
  return `<strong><a href="/gym/${this._id}">${this.title}</a></strong>
  <p>${this.location}</p>`;
});

GymSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.remove({
      _id: { $in: doc.reviews }
    });
  }
});

export default mongoose.model("Gym", GymSchema);
