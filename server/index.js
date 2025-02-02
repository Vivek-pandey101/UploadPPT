const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const s3Router = require("./routes/s3Upload");
const MongoStore = require("connect-mongo");
const userRouter = require("./routes/userRouter");
const session = require("express-session");
const { json } = require("body-parser");

const app = express();

const MONGO_URI = process.env.MONGO_URI;
const SESSION_SECRET = process.env.SESSION_SECRET;

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
    }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);

// Set up CORS properly
app.use(cors({
  origin: 'http://localhost:5173', // The URL of your frontend
  credentials: true, // Allow cookies to be sent with the request
}));


app.use(express.json());

app.use("/", s3Router);

app.use("/register", userRouter)

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(3000, () => console.log("Server started running on 3000"));
