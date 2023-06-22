import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
const dotenv = require("dotenv")
const SessionRoute = require("./routes/session")
const AuthRoute = require("./routes/auth")
import session from 'express-session';



// Create Express app
const app = express();
app.use(express.json());


// // Set up session middleware
app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
 
  })
);

dotenv.config()
mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("DB Connected Succesfully !"))
.catch((err)=>console.log(err))


// Define routes

app.use("/api/session",SessionRoute)
app.use("/api/auth",AuthRoute)






// Start the server
const port = process.env.PORT; // Choose a port number
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
