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

  console.log("Request body:", req.body);

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
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid item ID format" });
  }

  return Trip.findById(itemId)
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
  const { name, startDate, endDate, location, imageUrl, travel } = req.body;
  const tripId = req.params.tripId;
  const userId = req.user._id;
  const updateData = req.body;

  return Trip.findByIdAndUpdate(
    { _id: tripId, owner: userId },
    updateData,
    {
      name,
      startDate,
      endDate,
      location,
      imageUrl,
      travel,
    },
    { new: true, runValidators: true }
  )
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

module.exports = {
  getTrips,
  createTrip,
  deleteTrip,
  updateTrip,
};
