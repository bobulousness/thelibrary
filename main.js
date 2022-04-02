const express = require('express');
const BodyParser = require('body-parser');
const Cors = require("cors")
const mongoose = require('mongoose');
const { MongoClient, ObjectID } = require("mongodb");
const path = require("path");
const engines = require('consolidate');

const server = express()
server.use(BodyParser.json());
const urle = BodyParser.urlencoded({ extended: false });
server.use(Cors());
server.set('views', __dirname + '/views');
server.engine('html',engines.mustache);
server.set('view engine', 'html');
server.use('/assets', express.static('assets'));

const connection = mongoose.connect('mongodb://localhost:27017/Library')
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
});



server.post("/map",urle, async (request, response, next) => {


});
server.get("/", async (request, response, next) => {
    response.render('index');
});

server.listen("3030", async () => {
    try {
        console.log("Listening at :3030...");
    } catch (e) {
        console.error(e);
    }
});