import express from "express";
import User from "../models/User.js";
import { signToken } from "../utils/auth.js";

const router = express.Router();

// POST /api/users/register - Create a new user
router.post("/register", async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = signToken(user);
    res.status(201).json({ token, user });
  } catch (err) {
    res.status(400).json(err);
  }
});

// POST /api/users/login - Authenticate a user and return a token
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).json({ message: "Can't find this user" });
  }

  const correctPw = await user.isCorrectPassword(req.body.password);

  if (!correctPw) {
    return res.status(400).json({ message: "Wrong password!" });
  }

  const token = signToken(user);
  res.json({ token, user });
});

export default router;
