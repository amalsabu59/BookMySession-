import express, { Request, Response, Router } from "express";
import User from "../models/user";
const { v4: uuidv4 } = require("uuid");
import session, { SessionData } from "express-session";
const router: Router = express.Router();

interface CustomSessionData extends SessionData {
  bearerToken?: string;
}

function generateToken(type: string): string {
  const token = uuidv4();
  return token + type;
}

router.post("/register", async (req: Request, res: Response) => {
  try {
    const newUser = new User({
      universityId: "STUDENTB",
      password: "abc123",
      isDean: false,
    });
    const user = await newUser.save();
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { universityId, password } = req.body;

  const user = await User.findOne({ universityId });
  let token: string = "";
  if (user && user.isDean) {
    token = generateToken(":dean");
  } else {
    token = generateToken(":student");
  }
  if (!user) return res.status(404).json("user not found");

  const isVaildPassword = user.password === password;
  if (isVaildPassword) {
    (req.session as CustomSessionData).bearerToken = token;
    // const bearerToken = (req.session as CustomSessionData).bearerToken

    res.status(200).json({ token, userId: user._id });
  }
});

module.exports = router;
