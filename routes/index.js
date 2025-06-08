const router = require("express").Router();
const userRouter = require("./users");
const tripsRouter = require("./trips");
const { NOT_FOUND } = require("../utils/errors");

router.use("/users", userRouter);
router.use("/trips", tripsRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).json({ message: "Requested resource not found" });
});

module.exports = router;
