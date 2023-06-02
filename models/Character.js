const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    firstName: {type: String},
    lastName: {type: String},
    japanese: {type: Boolean, default: false},
    image: {type: String},
    avatar: {type: String},
    ultimate: {
      name: {type: String}, 
      description:{type: String}
    },
    charisma: {type: Number},
    combatStrength: {type: Number},
    intellect: {type: Number},
    skillPoints: {
      current: {type: Number},
      max: {type: Number}
    },
    startingSkills: {},
    learnedSkills: {},
    nekoCoins: {type: Number},
    likes: {type: String},
    dislikes: {type: String},
  },
  {timestamps: true}
)

const Model = mongoose.model("Character", schema);

module.exports = Model;