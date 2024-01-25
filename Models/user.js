// user.js

import mongoose from "mongoose";
import joi from "joi";
import jwt from "jsonwebtoken";
import PasswordComplexity from "joi-password-complexity";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    pic: {
      type: String, // Fix the type here from "string" to String
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  { timestamps: true }
);

// Check if the model already exists to avoid OverwriteModelError
const User = mongoose.models.user || mongoose.model("user", userSchema);

// validation

const validate = (data) => {
  const schema = joi.object({
    name: joi.string().required().label("Name"),
    email: joi.string().required().label("email"),
    password: PasswordComplexity().required(),
    pic: joi.string().label("pic"),
  });
  return schema.validate(data);
};

// jwt token generation
const generateAuthToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY);
};

export { User, validate, generateAuthToken };
