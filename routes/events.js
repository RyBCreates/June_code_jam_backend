const router = require("express").Router();
const auth = require("../middlewares/auth");

const { getEvents, addEventToTrip } = require("../controllers/events");

router.get("/", getEvents);
router.post("/:tripId/events", auth, addEventToTrip);

module.exports = router;
