import express from "express";
import mongoose from "mongoose";
import POST from "../models/post.js"; // Update the path to your POST model
import USER from "../models/model.js"; // Update the path to your USER model
import requireLogin from "../middlewares/requireLogin.js"; // Update the path to your requireLogin middleware

const router = express.Router();

// Get user profile
router.get("/user/:id", async (req, res) => {
    try {
        const user = await USER.findOne({ _id: req.params.id }).select("-password");
        const posts = await POST.find({ postedBy: req.params.id }).populate("postedBy", "_id");

        res.status(200).json({ user, posts });
    } catch (err) {
        res.status(404).json({ error: "User not found" });
    }
});

// Follow user
router.put("/follow", requireLogin, async (req, res) => {
    try {
        const updatedFollowedUser = await USER.findByIdAndUpdate(
            req.body.followId,
            { $push: { followers: req.user._id } },
            { new: true }
        );

        const updatedCurrentUser = await USER.findByIdAndUpdate(
            req.user._id,
            { $push: { following: req.body.followId } },
            { new: true }
        );

        res.json(updatedCurrentUser);
    } catch (err) {
        res.status(422).json({ error: err });
    }
});

// Unfollow user
router.put("/unfollow", requireLogin, async (req, res) => {
    try {
        const updatedUnfollowedUser = await USER.findByIdAndUpdate(
            req.body.followId,
            { $pull: { followers: req.user._id } },
            { new: true }
        );

        const updatedCurrentUser = await USER.findByIdAndUpdate(
            req.user._id,
            { $pull: { following: req.body.followId } },
            { new: true }
        );

        res.json(updatedCurrentUser);
    } catch (err) {
        res.status(422).json({ error: err });
    }
});

// Upload profile pic
router.put("/uploadProfilePic", requireLogin, async (req, res) => {
    try {
        const updatedUser = await USER.findByIdAndUpdate(
            req.user._id,
            { $set: { Photo: req.body.pic } },
            { new: true }
        );

        res.json(updatedUser);
    } catch (err) {
        res.status(422).json({ error: err });
    }
});

export default router;
