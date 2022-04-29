const express = require('express');
const BodyParser = require('body-parser');
const Cors = require("cors")
const mongoose = require('mongoose');
const engines = require('consolidate');

const mapDB = require('./models/mapsDB');
const bookDB = require('./models/bookDB');
const roomDB = require('./models/roomDB');
const bodyParser = require("body-parser");

const server = express()
server.use(BodyParser.json());
const urle = BodyParser.urlencoded({ extended: false });

server.set('views', __dirname + '/views');
server.engine('html',engines.mustache);
server.set('view engine', 'html');

server.use(Cors());
server.use('/game', express.static('game'));
server.use('/assets', express.static('assets'));
server.use('/models', express.static('models'));
server.use('/node_modules', express.static('node_modules'));

const connection = mongoose.connect('mongodb://localhost:27017/Library')
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
});



server.get("/map", async (request, response) => {
    mapDB.getMap().then(map => {
        console.log(map)
        response.send(map);
    });
});

server.post("/getRooms", urle, async (request, response) => {

    var q = request.body.rare;
    console.log("rare: " +q);
    roomDB.getRoomsByRarity(q).then(rooms => {
        console.log(rooms)
        response.send(rooms);
    });
});

server.get("/", async (request, response, next) => {
    response.render('index');
});

server.post("/save", async (request, response, next) => {
    response.render('index');
});

server.listen("3030", async () => {
    try {
        console.log("Listening at :3030...");
    } catch (e) {
        console.error(e);
    }
});