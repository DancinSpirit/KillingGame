const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    firstName: {type: String, default: "???"},
    lastName: {type: String, default: "???"},
    image: {type: String},
    avatar: {type: String},
    friendshipFragments: {type: Number, default: 0},
    height: {type: String, default: "???"},
    weight: {type: String, default: "???"},
    age: {type: String, default: "???"},
    dateOfBirth: {type: String, default: "???"},
    likes: {type: String, default: "???"},
    dislikes: {type: String, default: "???"},
    ultimate: {
      name: {type: String, default: "???"}, 
      description:{type: String, default: "???"}
    },
  },
  {timestamps: true}
)

const Model = mongoose.model("ReportCard", schema);

module.exports = Model;