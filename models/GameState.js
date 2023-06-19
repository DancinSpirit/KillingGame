const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    day: {type: Number},
    phase: {type: String}
  },
  {timestamps: true}
)

const Model = mongoose.model("GameState", schema);

module.exports = Model;