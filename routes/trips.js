const router = require("express").Router();
const auth = require("../middlewares/auth");

const { getTrips, createTrip, deleteTrip } = require("../controllers/trips");

router.get("/", getTrips);
router.post("/", auth, createTrip);
router.delete("/:itemId", auth, deleteTrip);

module.exports = router;
