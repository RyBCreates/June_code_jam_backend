const router = require("express").Router();
const auth = require("../middlewares/auth");

const { addEventToTrip } = require("../controllers/events");

router.post("/:tripId/events", auth, addEventToTrip);

module.exports = router;
