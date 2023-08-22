import express from "express";
import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { Jwt_secret } from "../keys.js";
import requireLogin from "../middlewares/requireLogin.js";

const router = express.Router();
const USER = mongoose.model("USER");

router.get('/', (req, res) => {
    res.send("hello");
});

router.post("/signup",(req, res) => {
    const { name, userName, email, password } = req.body;
    if (!name || !email || !userName || !password) {
        return res.status(422).json({ error: "Please add all the fields" });
    } 
    
    USER.findOne({ $or: [{ email: email }, { userName: userName }] }).then(async (savedUser) => {
        if (savedUser) {
            return res.status(422).json({ error: "User already exists with that email or userName" });
        }
        
        try {
            const hashedPassword = await bcrypt.hash(password, 12);

            const user = new USER({
                name,
                email,
                userName,
                password: hashedPassword
            });

            await user.save();
            res.json({ message: "Registered successfully" });
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: "An error occurred during registration" });
        }
    });
});

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).json({ error: "Please add email and password" });
    }

    try {
        const savedUser = await USER.findOne({ email: email });

        if (!savedUser) {
            return res.status(422).json({ error: "Invalid email" });
        }

        const match = await bcrypt.compare(password, savedUser.password);
        if (match) {
            const token = jwt.sign({ _id: savedUser.id }, Jwt_secret);
            const { _id, name, email, userName } = savedUser;

            res.json({ token, user: { _id, name, email, userName } });
        } else {
            return res.status(422).json({ error: "Invalid password" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "An error occurred during sign-in" });
    }
});

export default router;
