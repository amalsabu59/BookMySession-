"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv = require("dotenv");
const SessionRoute = require("./routes/session");
const AuthRoute = require("./routes/auth");
const express_session_1 = __importDefault(require("express-session"));
dotenv.config();
// Create Express app
const app = (0, express_1.default)();
app.use(express_1.default.json());
// // Set up session middleware
app.use((0, express_session_1.default)({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
}));
// Define routes
app.use("/api/session", SessionRoute);
app.use("/api/auth", AuthRoute);
// Start the server
const port = process.env.PORT; // Choose a port number
app.listen(port, () => {
    if (process.env.MONGO_URI)
        mongoose_1.default
            .connect(process.env.MONGO_URI)
            .then(() => console.log("DB Connected Succesfully !"))
            .catch((err) => console.log(err));
    console.log(`Server is running on port ${port}`);
});
