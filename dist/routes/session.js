"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Session_1 = __importDefault(require("../models/Session"));
const bookSession_1 = __importDefault(require("../models/bookSession"));
const helpers_1 = require("../helpers/helpers");
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
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
router.get("/insertSession", (req, res) => {
    Session_1.default.insertMany(sessionsData)
        .then(() => {
        res.send("Sessions added successfully to the master table.");
    })
        .catch((error) => {
        res.send(error);
    });
});
router.get("/all-sessions", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(0, helpers_1.checkAuthTokenAndGrandPermission)(req, res))
            return;
        const sessions = yield Session_1.default.find();
        res.status(200).json({ sessions });
    }
    catch (error) {
        return res.status(500).json({ message: error });
    }
}));
router.post("/book-session", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(0, helpers_1.checkAuthTokenAndGrandPermission)(req, res))
            return;
        const findAlreadyBooked = yield Session_1.default.findById(req.body.sessionId);
        if (findAlreadyBooked && findAlreadyBooked.isBooked)
            return res.status(400).json({ message: "Session already booked" });
        const updateTimeSlot = yield Session_1.default.findOneAndUpdate({
            _id: req.body.sessionId,
        }, {
            isBooked: true,
        }, { new: true });
        if (!updateTimeSlot) {
            // Session not found
            return res.status(404).json({ message: "Session not found" });
        }
        const newBookedSession = new bookSession_1.default({
            sessionId: req.body.sessionId,
            userId: req.body.userId,
            isDeanApproved: false,
        });
        mongoose_1.default.set("debug", true);
        const bookSession = yield newBookedSession.save();
        res.status(200).json({ message: "Session booked", data: bookSession });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
router.get("/requested-session", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(0, helpers_1.checkAuthTokenAndGrandPermission)(req, res))
            return;
        if (!(0, helpers_1.isDeanLoggedin)(req, res)) {
            return res.status(403).json({
                message: "Access Denied: You don't have the privileges to access this",
            });
        }
        const currentDate = new Date();
        const allRequestedSession = yield bookSession_1.default.find({
            isDeanApproved: false,
        });
        const sessionIds = allRequestedSession.map((session) => session.sessionId);
        const futureSessions = yield Session_1.default.find({
            _id: { $in: sessionIds },
            date: { $gt: currentDate },
        });
        res.status(200).json(futureSessions);
        // res.status(200).json(allRequestedSession);
    }
    catch (error) {
        console.error(error); // Log the error for debugging purposes
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
router.post("/approve-session", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(0, helpers_1.checkAuthTokenAndGrandPermission)(req, res))
            return;
        if (!(0, helpers_1.isDeanLoggedin)(req, res)) {
            return res.status(403).json({
                message: "Access Denied: You don't have the privilege to approve",
            });
        }
        const approveBooking = yield bookSession_1.default.findByIdAndUpdate({
            _id: req.body.bookingId,
        }, {
            isDeanApproved: true,
        }, { new: true });
        if (!approveBooking) {
            return res.status(404).json({
                message: "Booking not found",
            });
        }
        res
            .status(200)
            .json({ message: "Booking approved by dean", data: approveBooking });
    }
    catch (error) {
        console.error(error); // Log the error for debugging purposes
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
module.exports = router;
