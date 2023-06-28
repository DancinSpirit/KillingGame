const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {type: String},
    description: {type: String},
    chapter: {type: Number},
    phase: {type: String},
    day: {type: Number}
  },
  {timestamps: true}
)

const Model = mongoose.model("TruthBullet", schema);

module.exports = Model;