const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    default: "",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

module.exports = mongoose.model("Note", noteSchema);
