/* Server Setup */
const express = require("express");
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const ejs = require('ejs');
const despairBot = require("./despairBot.js")
const cardBot = require("./cardBot.js")
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({extended:true}));

/* Authorization Setup */
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require("bcryptjs");

/* Database Setup */
const db = require("./models");

/* Variable Setup */
require("dotenv").config();
const PORT = process.env.PORT;

/* Create Session */
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 * 1
    }  
}));

/* Send User Information */
app.use(async function(req,res,next){
    if(req.session.currentUser){
        app.locals.user = req.session.currentUser;
    }else{
        app.locals.user = false;
    }
    next();
})

/* Login */
app.post("/login", async function(req, res){
    const foundUser = await db.User.findOne({username: req.body.username});
    if(!foundUser) return res.send({loggedIn: false, error: "That username doesn't exist!"})
    const match = await bcrypt.compare(req.body.password, foundUser.password);
    if(!match) return res.send({loggedIn: false, error: "Password Invalid"});
    req.session.currentUser = foundUser;
    app.locals.user = req.session.currentUser;
    return res.send({loggedIn: true, user: app.locals.user});
})
/* Register */
app.post("/register", async function(req, res){
    const foundUser = await db.User.findOne({username: req.body.username});
    if(foundUser) return res.send({registered: false, error: "This username already exists!"});
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    req.body.password = hash;
    const newUser = await db.User.create(req.body);
    req.session.currentUser = newUser;
    app.locals.user = req.session.currentUser;
    return res.send({registered: true, user: app.locals.user});
})
/* Logout */
app.post("/logout", async function(req,res){
    req.session.currentUser = {settings:{pageSpeed:1000}};
    return res.send(req.session.currentUser);
})
/* Discord Bot */
app.post("/despair-bot", async function(req, res){
    console.log(req.body.command)
    eval(`despairBot.${req.body.command}`)
})

/* Home Page Loading */
app.get("/", async function(req,res){    
    let gameState = await db.GameState.findOne({});
    res.render('base',{states: ["start","entrance"], databaseObjects: [false], customData: [false], gameState: gameState});
})

/* Database Loading By Property */
app.get("/data/:databaseObject/:property/:name", async function(req,res){
    const data = await db[req.params.databaseObject.charAt(0).toUpperCase() + req.params.databaseObject.slice(1)].findOne({[req.params.property]: req.params.name});
    res.send(data);
})

/* Database Loading */
app.get("/data/:databaseObject/:id", async function(req,res){
    const data = await db[req.params.databaseObject.charAt(0).toUpperCase() + req.params.databaseObject.slice(1)].findById(req.params.id);
    res.send(data);
})

/* Return ALL From Database */
app.get("/data/:databaseObject", async function(req,res){
    const data = await db[req.params.databaseObject.charAt(0).toUpperCase() + req.params.databaseObject.slice(1)].find();
    res.send(data);
})

/* Page Loading */
app.get("/*", async function(req, res){
    let states = [];
    for(let x=1; x<req.url.split("/").length; x++){
        states.push(req.url.split("/")[x]);
    }
    let databaseObjects = [];
    let customData = [];
    if(req.body.databaseObjects){
        databaseObjects = req.body.databaseObjects;
    }else{
        for(let x=0; x<states.length; x++){
            databaseObjects[x] = false;
        }
    }
    if(req.body.customData){
        customData = req.body.customData;
    }else{
        for(let x=0; x<states.length; x++){
            customData[x] = false;
        }
    }
    let gameState = await db.GameState.findOne({});
    res.render('base',{states: states, databaseObjects: databaseObjects, customData: customData, gameState: gameState});
})

/* Database Updating */
app.post("/update/:databaseObject/:id", async function(req,res){
    let databaseObject = req.params.databaseObject.charAt(0).toUpperCase() + req.params.databaseObject.slice(1);
    let foundObject = await db[databaseObject].findByIdAndUpdate(req.params.id, req.body);
    res.send(foundObject);
})

app.post("/update2/:databaseObject/:id", async function(req,res){
    let update = {};
    update[req.body.updateKey] = req.body.updateValue;
    let update2 = {}
    update2[req.body.updateType] = update;
    console.log(update2);
    console.log(req.body.settings);
    update = update2;
    let databaseObject = req.params.databaseObject.charAt(0).toUpperCase() + req.params.databaseObject.slice(1);
    let foundObject = await db[databaseObject].findByIdAndUpdate(req.params.id, update, req.body.settings);
    res.send(foundObject);
})

/* Database Creating */
app.post("/create/:databaseObject", async function(req,res){
    let databaseObject = req.params.databaseObject.charAt(0).toUpperCase() + req.params.databaseObject.slice(1);
    let createdObject = await db[databaseObject].create(req.body);
    res.send(createdObject);
})

/* Component Loading */
app.post("/component/:path", async function(req,res){
    let data = {};
    let url = `${req.params.path.toLowerCase().replaceAll("|","/")}`;
    if((req.body.customData != "false")&&(typeof req.body.customData != "undefined")){
        data = req.body.customData;
    }
    if(req.body.databaseObjects != "false"&&(typeof req.body.databaseObjects != "undefined")){
        for(let x=0; x<req.body.databaseObjects.length; x++){ 
            data[req.body.databaseObjects[x].name.toLowerCase()]  = await db[req.body.databaseObjects[x].name].findById(req.body.databaseObjects[x].id);
        }
    }
    data.user = app.locals.user;
    ejs.renderFile("views/"+url.replace("/component","")+".ejs", data, (err, result) => {
        if (err) {
            console.log(err)
            res.render("error",{error:err});
        }
            res.send(result);
    });
})

/* Socket.IO */
io.on('connection', (socket) => {
    console.log('User Connected!');
});

http.listen(PORT, function(){
    console.log(`Live at http://localhost:${PORT}/`);
})

