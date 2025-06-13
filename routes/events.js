const router = require("express").Router();
const auth = require("../middlewares/auth");

const { addEventToTrip } = require("../controllers/events");

router.post("/trips/:tripId/events", auth, addEventToTrip);

module.exports = router;
