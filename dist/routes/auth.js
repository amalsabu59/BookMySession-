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
const user_1 = __importDefault(require("../models/user"));
const { v4: uuidv4 } = require("uuid");
const router = express_1.default.Router();
function generateToken(type) {
    const token = uuidv4();
    return token + type;
}
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = new user_1.default({
            universityId: "STUDENTB",
            password: "abc123",
            isDean: false,
        });
        const user = yield newUser.save();
        res.status(200).send(user);
    }
    catch (err) {
        console.log(err);
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { universityId, password } = req.body;
    const user = yield user_1.default.findOne({ universityId });
    let token = "";
    if (user && user.isDean) {
        token = generateToken(":dean");
    }
    else {
        token = generateToken(":student");
    }
    if (!user)
        return res.status(404).json("user not found");
    const isVaildPassword = user.password === password;
    if (isVaildPassword) {
        req.session.bearerToken = token;
        // const bearerToken = (req.session as CustomSessionData).bearerToken
        res.status(200).json({ token, userId: user._id });
    }
}));
module.exports = router;
