const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    chapter: {type: Number},
    number: {type: Number},
    morning: [{type: String}],
    freeTime: [{type: String}],
    startingBackground: {type: String},
    startingMusic: {type: String}
  },
  {timestamps: true}
)

const Model = mongoose.model("Day", schema);

module.exports = Model;