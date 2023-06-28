const mongoose = require("mongoose");
require("dotenv").config()
const dbUrl = process.env.MONGODB_URI;

mongoose.connect(dbUrl, {
   useNewUrlParser: true,
   useUnifiedTopology: true
});

mongoose.connection.on("disconnected", function(){
    console.log("Mongodb disconnected");
});

mongoose.connection.on("connected", function(){
    console.log("Mongodb connected");
});

mongoose.connection.on("error", function(err){
    console.log("Mongodb error: ", err);
});

module.exports = {
    User: require("./User"),
    Day: require("./Day"),
    Character: require("./Character"),
    ReportCard: require("./ReportCard"),
    RuleSet: require("./RuleSet"),
    GameState: require("./GameState"),
    TruthBullet: require("./TruthBullet")
}