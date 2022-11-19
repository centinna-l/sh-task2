const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone_no: { type: String, required: true },
    password: { type: String, required: true },
    profile_image: { type: String },
    gender: { type: String, required: true },
    dob: { type: Date, required: true },
    confirmation_code: { type: String },
    status: { type: Boolean, required: true, default: true },
    isEmailVerified: { type: Boolean, required: true, default: false },
    isPhoneVerified: { type: Boolean, required: true, default: false },
    google_auth_token: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
