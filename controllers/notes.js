const Note = require("../models/note");

const { BAD_REQUEST, INTERNAL_SERVER_ERROR } = require("../utils/errors");

const getNoteByDate = (req, res) => {
  const { date } = req.params;
  const owner = req.user._id;

  Note.findOne({ date, owner }).then((note) => {
    if (!note) {
      return res.status(404).send({ message: "Note not found" });
    }
    res.send(note);
  });
};

const upsertNote = (req, res) => {
  const { date } = req.params;
  const { text } = req.body;
  const owner = req.user._id;

  Note.findOneAndUpdate(
    { date, owner },
    { text },
    { new: true, upsert: true, runValidators: true }
  )
    .then((note) => res.send(note))
    .catch((err) => {
      console.error(err);
      res.status(BAD_REQUEST).send({ message: "Invalid data for note" });
    });
};

module.exports = { getNoteByDate, upsertNote };
