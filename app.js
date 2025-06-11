require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const { loginUser, createUser } = require("./controllers/users");

const app = express();

const { PORT = 10000, DATABASE_URL } = process.env;

app.use(express.json());
app.use(cors());

app.post("/signup", createUser);
app.post("/signin", loginUser);

app.use("/", mainRouter);

mongoose
  .connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`Hello, from Port: ${PORT}`);
});

if (!DATABASE_URL) {
  console.error("Missing DATABASE_URL environment variable!");
}

module.exports = app;
