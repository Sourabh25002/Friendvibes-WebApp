import jwt from "jsonwebtoken";
import { Jwt_secret } from "../keys.js";
import mongoose from "mongoose";
const USER = mongoose.model("USER");

export default async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "You must have logged in 1" });
  }
  const token = authorization.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, Jwt_secret);
    const { _id } = payload;
    const userData = await USER.findById(_id);
    req.user = userData;
    next();
  } catch (err) {
    return res.status(401).json({ error: "You must have logged in 2" });
  }
};
