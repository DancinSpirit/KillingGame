const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {type: String},
    description: {type: String},
    chapter: {type: Number},
    phase: {type: String},
    day: {type: Number},
    lie: {type: Boolean, default: false},
    truthBullet: {type: mongoose.Schema.Types.ObjectId, ref: "TruthBullet"}
  },
  {timestamps: true}
)

const Model = mongoose.model("TruthBullet", schema);

module.exports = Model;