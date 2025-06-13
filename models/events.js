const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  location: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Trip",
  },
});

module.exports = mongoose.model("Event", eventSchema);
