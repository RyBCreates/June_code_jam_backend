const mongoose = require("mongoose");
const validator = require("validator");

const tripSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  location: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  travel: { type: String, required: true, enum: ["plane", "car", "boat"] },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

module.exports = mongoose.model("Trip", tripSchema);
