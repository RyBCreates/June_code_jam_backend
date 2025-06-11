const mongoose = require("mongoose");
const Trip = require("../models/trips");
const {
  BAD_REQUEST,
  FORBIDDEN,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

// Get all Trips
const getTrips = (req, res) => {
  Trip.find({})
    .then((trips) => res.send(trips))
    .catch((err) => {
      console.error(err);
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// Create a new Trip
const createTrip = (req, res) => {
  const { name, startDate, endDate, location, imageUrl, travel } = req.body;
  const owner = req.user._id;

  return Trip.create({
    name,
    startDate,
    endDate,
    location,
    imageUrl,
    travel,
    owner,
  })
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);

      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data passed to create trip" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// Delete a Trip
const deleteTrip = (req, res) => {
  const { tripId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(tripId)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid item ID format" });
  }

  return Trip.findById(tripId)
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((item) => {
      if (item.owner.toString() !== req.user._id.toString()) {
        return res
          .status(FORBIDDEN)
          .send({ message: "You are not authorized to delete this!" });
      }
      return item.deleteOne().then(() => res.send(item));
    })
    .catch((err) => {
      console.error(err);
      return res.status(err.statusCode || INTERNAL_SERVER_ERROR).send({
        message: err.message || "An error has occurred on the server",
      });
    });
};

//Update a Trip
const updateTrip = (req, res) => {
  const { tripId } = req.params;
  const owner = req.user._id;
  const updateData = req.body;

  if (!mongoose.Types.ObjectId.isValid(tripId)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid item ID format" });
  }

  return Trip.findOneAndUpdate({ _id: tripId, owner }, updateData, {
    new: true,
    runValidators: true,
  })
    .then((trip) => {
      if (!trip) {
        return res.status(NOT_FOUND).send({ message: "Trip not found" });
      }
      return res.send(trip);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data passed to update trip" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

// Add an Event to a Trip
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

      const newEvent = { name, location, startTime, endTime };
      trip.events.push(newEvent);

      return trip.save().then((updatedTrip) => res.send(updatedTrip));
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(err.statusCode || INTERNAL_SERVER_ERROR)
        .send({ message: err.message || "An error occurred on the server" });
    });
};

module.exports = {
  getTrips,
  createTrip,
  deleteTrip,
  updateTrip,
  addEventToTrip,
};
