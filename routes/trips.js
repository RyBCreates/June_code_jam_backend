const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  getTrips,
  createTrip,
  deleteTrip,
  updateTrip,
} = require("../controllers/trips");

router.get("/", getTrips);
router.post("/", auth, createTrip);
router.delete("/:tripId", auth, deleteTrip);
router.patch("/:tripId", auth, updateTrip);

module.exports = router;
