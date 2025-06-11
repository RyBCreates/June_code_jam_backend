require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const notesRouter = require("./routes/notes");
const { loginUser, createUser } = require("./controllers/users");

const app = express();

const { PORT = 10000, DATABASE_URL } = process.env;

app.use(express.json());
app.use(
  cors({
    origin: "https://rybcreates.github.io",
  })
);

app.post("/signup", createUser);
app.post("/signin", loginUser);

app.use("/", mainRouter);
app.use("/notes", notesRouter);

mongoose
  .connect(DATABASE_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`Hello, from Port: ${PORT}`);
});

if (!DATABASE_URL) {
  console.error("Missing DATABASE_URL environment variable!");
}

module.exports = app;
