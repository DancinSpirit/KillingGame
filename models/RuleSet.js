const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {type: String},
  },
  {timestamps: true}
)

const Model = mongoose.model("RuleSet", schema);

module.exports = Model;