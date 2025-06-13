const mongoose = require("mongoose");
const Event = require("../models/events");
const Trip = require("../models/trips");
const {
  BAD_REQUEST,
  FORBIDDEN,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

const addEventToTrip = (req, res) => {
  const { tripId } = req.params;
  const { name, location, startTime, endTime } = req.body;

  if (!mongoose.Types.ObjectId.isValid(tripId)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid trip ID format" });
  }

  Trip.findById(tripId)
    .orFail(() => {
      const error = new Error("Trip not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((trip) => {
      if (trip.owner.toString() !== req.user._id.toString()) {
        return res
          .status(FORBIDDEN)
          .send({ message: "You are not authorized to modify this trip" });
      }

      return Event.create({
        name,
        location,
        startTime,
        endTime,
        tripId,
      });
    })
    .then((newEvent) => {
      res.status(201).send(newEvent);
    })
    .catch((err) => {
      console.error(err);
      res
        .status(err.statusCode || INTERNAL_SERVER_ERROR)
        .send({ message: err.message || "An error occurred on the server" });
    });
};

module.exports = {
  addEventToTrip,
};
