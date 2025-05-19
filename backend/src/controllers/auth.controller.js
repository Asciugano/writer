import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bycrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "all fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 character" });
    }

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "email already exist" });

    const salt = await bycrypt.genSalt(10);
    const hashPasswd = await bycrypt.hash(password, salt);

    const newUser = new User({
      fullName: fullName,
      email: email,
      password: hashPasswd,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ meessage: "invalid data" });
    }
  } catch (error) {
    console.error("error in signup controller", error.meessage);
    res.status(500).json({ message: "internal server error" });
  }
};

export const login = (req, res) => {
  res.send("login route");
};

export const logout = (req, res) => {
  res.send("logout route");
};