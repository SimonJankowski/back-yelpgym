import mongoose from "mongoose";
import { Schema } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  }
});

UserSchema.plugin(passportLocalMongoose);

export default mongoose.model("User", UserSchema);
