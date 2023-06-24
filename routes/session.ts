import express, {
  RequestHandler,
  Request,
  Response,
  Router,
  response,
} from "express";
import Session from "../models/Session";
import BookSession, { IBookSession } from "../models/bookSession";
import {
  checkAuthTokenAndGrandPermission,
  isDeanLoggedin,
} from "../helpers/helpers";
import mongoose from "mongoose";

const router: Router = express.Router();

const sessionsData = [
  {
    date: new Date("2023-06-30T10:00:00"),
    isBooked: false,
  },
  {
    date: new Date("2023-05-07T10:00:00"),
    isBooked: false,
  },
  {
    date: new Date("2023-05-14T10:00:00"),
    isBooked: false,
  },
  {
    date: new Date("2023-05-21T10:00:00"),
    isBooked: false,
  },
  {
    date: new Date("2023-05-28T10:00:00"),
    isBooked: false,
  },
];

router.get("/insertSession", (req: Request, res: Response) => {
  Session.insertMany(sessionsData)
    .then(() => {
      res.send("Sessions added successfully to the master table.");
    })
    .catch((error) => {
      res.send(error);
    });
});

router.get("/all-sessions", async (req: Request, res: Response) => {
  try {
    if (!checkAuthTokenAndGrandPermission(req, res)) return;

    const sessions = await Session.find();

    res.status(200).json({ sessions });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});
router.post("/book-session", async (req: Request, res: Response) => {
  try {
    if (!checkAuthTokenAndGrandPermission(req, res)) return;

    const findAlreadyBooked = await Session.findById(req.body.sessionId);

    if (findAlreadyBooked && findAlreadyBooked.isBooked)
      return res.status(400).json({ message: "Session already booked" });

    const updateTimeSlot = await Session.findOneAndUpdate(
      {
        _id: req.body.sessionId,
      },
      {
        isBooked: true,
      },
      { new: true }
    );

    if (!updateTimeSlot) {
      // Session not found
      return res.status(404).json({ message: "Session not found" });
    }

    const newBookedSession = new BookSession({
      sessionId: req.body.sessionId,
      userId: req.body.userId,
      isDeanApproved: false,
    });
    mongoose.set("debug", true);

    const bookSession = await newBookedSession.save();

    res.status(200).json({ message: "Session booked", data: bookSession });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/requested-session", async (req: Request, res: Response) => {
  try {
    if (!checkAuthTokenAndGrandPermission(req, res)) return;

    if (!isDeanLoggedin(req, res)) {
      return res.status(403).json({
        message: "Access Denied: You don't have the privileges to access this",
      });
    }

    const currentDate = new Date();

    const allRequestedSession = await BookSession.find({
      isDeanApproved: false,
    });

    const sessionIds = allRequestedSession.map((session) => session.sessionId);

    const futureSessions = await Session.find({
      _id: { $in: sessionIds },
      date: { $gt: currentDate },
    });

    res.status(200).json(futureSessions);

    // res.status(200).json(allRequestedSession);
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/approve-session", async (req: Request, res: Response) => {
  try {
    if (!checkAuthTokenAndGrandPermission(req, res)) return;

    if (!isDeanLoggedin(req, res)) {
      return res.status(403).json({
        message: "Access Denied: You don't have the privilege to approve",
      });
    }

    const approveBooking = await BookSession.findByIdAndUpdate(
      {
        _id: req.body.bookingId,
      },
      {
        isDeanApproved: true,
      },
      { new: true }
    );

    if (!approveBooking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res
      .status(200)
      .json({ message: "Booking approved by dean", data: approveBooking });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
