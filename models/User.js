const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    firstName: {type: String},
    lastName: {type: String},
    gamemaster: {type: Boolean},
    //gamemasteronly:
    currentUser: {type: String},
    despair: {
      reportCards: [{type: mongoose.Schema.Types.ObjectId, ref: "ReportCard"}],
      presents: [],
      mononekoReports: [],
      truthBullets: [],
      chapters: [{days:[{type: mongoose.Schema.Types.ObjectId, ref: "Day"}]}],
      //Story record in discord
      currentChapter: {type: Number},
      currentDay: {type: Number},
      currentPhase: {type: String},
      currentLine: {type: Number},
    },
    settings: {
      textSpeed: {type: Number, default: 50},
      pageSpeed: {type: Number, default: 1000},
      musicVolume: {type: Number, default: 0.25},
      soundVolume: {type: Number, default: 0.25},
      pageScroll: {type: Boolean, default: true}
    },
    discord: {
      id: {type: String},
      channels: {
        story: {type: String},
        reAct: {type: String},
        disccusion: {type: String}
      }
    }
  },
  {timestamps: true}
)

schema.methods.fullName = function fullname(){
  return this.firstName + " " + this.lastName;
}

const Model = mongoose.model("User", schema);

module.exports = Model;