import express from "express";
import mongoose from "mongoose";
import requireLogin from "../middlewares/requireLogin.js";

import route from "./auth.js";
const POST = mongoose.model("POST");

const router = express.Router();

router.get("/allposts", requireLogin, async (req, res) => {
    try {
        const posts = await POST.find()
            .populate("postedBy", "_id name Photo")
            .populate("comments.postedBy", "_id name")
            .sort("-createdAt");
        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "An error occurred while fetching posts" });
    }
});

router.post("/createPost", requireLogin, async (req, res) => {
    const { body, pic } = req.body;

    if (!body || !pic) {
        return res.status(422).json({ error: "Please add all the fields" });
    }

    try {
        const post = new POST({
            body,
            photo: pic,
            postedBy: req.user
        });

        const result = await post.save();
        res.json({ post: result });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "An error occurred while creating the post" });
    }
});

router.get("/myposts", requireLogin, async (req, res) => {
    try {
        const myposts = await POST.find({ postedBy: req.user._id })
            .populate("postedBy", "_id name")
            .populate("comments.postedBy", "_id name")
            .sort("-createdAt");
        res.json(myposts);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "An error occurred while fetching your posts" });
    }
});
router.put("/like", requireLogin, (req, res) => {
    POST.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id }
    }, {
        new: true
    }).populate("postedBy", "_id name Photo")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            } else {
                res.json(result)
            }
        })
})

router.put("/unlike", requireLogin, (req, res) => {
    POST.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    }, {
        new: true
    }).populate("postedBy", "_id name Photo")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            } else {
                res.json(result)
            }
        })
})

router.put("/comment", requireLogin, (req, res) => {
    const comment = {
        comment: req.body.text,
        postedBy: req.user._id
    }
    POST.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comment }
    }, {
        new: true
    })
        .populate("comments.postedBy", "_id name")
        .populate("postedBy", "_id name Photo")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            } else {
                res.json(result)
            }
        })
})

// Api to delete post
router.delete("/deletePost/:postId", requireLogin, (req, res) => {
    POST.findOne({ _id: req.params.postId })
        .populate("postedBy", "_id")
        .exec((err, post) => {
            if (err || !post) {
                return res.status(422).json({ error: err })
            }

            if (post.postedBy._id.toString() == req.user._id.toString()) {

                post.remove()
                    .then(result => {
                        return res.json({ message: "Successfully deleted" })
                    }).catch((err) => {
                        console.log(err)
                    })
            }
        })
})

// to show following post
router.get("/myfollwingpost", requireLogin, (req, res) => {
    POST.find({ postedBy: { $in: req.user.following } })
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .then(posts => {
            res.json(posts)
        })
        .catch(err => { console.log(err) })
})


export default router;
