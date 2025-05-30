import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    console.log("tocken:", token);

    if (!token) {
      return res
        .status(404)
        .json({ message: "unauthorized - no token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded tocken:", decoded);

    if (!decoded) {
      return res.status(404).json({ message: "unauthorized - invalid token" });
    }

    const user = await User.findById(decoded.userID).select("-password");

    if (!user) {
      res.status(404).json({ message: "user not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("error in protectRoute middleware ", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};