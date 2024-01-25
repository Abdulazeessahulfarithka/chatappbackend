import { validate, generateAuthToken, User } from "../Models/user.js";
// Example import statement
import jwt from "jsonwebtoken";
import joi from "joi";
import bcrypt from "bcrypt";

const signup = async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check if the email is already registered
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    // Hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Save new user
    user = new User({ ...req.body, password: hashedPassword });
    await user.save();

    const token = generateAuthToken(user._id);
    const { _id, name, email, pic } = user;

    return res.status(200).json({ user: { _id, name, email, pic }, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error, message: "Error in signup" });
  }
};

const validateLogin = (data) => {
  const Schema = joi.object({
    email: joi.string().email().required().label("Email"),
    password: joi.string().required().label("Password"),
  });
  return Schema.validate(data);
};

const login = async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check if the user exists in the database
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Compare the password
    const validatePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validatePassword) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate token
    const token = generateAuthToken(user._id);
    const { _id, name, email, pic } = user;

    return res.status(200).json({ user: { _id, name, email, pic }, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error in login", error });
  }
};

// ... (previous code)

const isSignedIn = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decode = jwt.verify(token, process.env.SECRET_KEY);
      req.user = await User.findById(decode.id).select("password");
      next();
    } catch (error) {
      res.status(500).json({ error: "Problem in authentication" });
    }
  }
  if (!token) {
    return res.status(400).json({ error: "Access denied" });
  }
};

export { signup, isSignedIn, login };
