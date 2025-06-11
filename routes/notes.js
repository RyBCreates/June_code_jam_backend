const router = require("express").Router();
const auth = require("../middlewares/auth");
const { getNoteByDate, upsertNote } = require("../controllers/notes");

router.get("/:date", auth, getNoteByDate);
router.post("/:date", auth, upsertNote);

module.exports = router;
