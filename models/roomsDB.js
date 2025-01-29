const mongoose = require('mongoose');
const roomRelations = require('./roomRelationsDB.js');

const mapSchema = new mongoose.Schema({
    name: String,
    level: Number,
    angle: Number,
    coordinates: {
        start: {
            x: Number,
            y: Number,
        },
        end: {
            x: Number,
            y: Number,
        }
    },
    items: [],
    creatures: [],
    books: []
}, { collection: 'rooms' });

const model = mongoose.model("rooms", mapSchema);

module.exports.getMap = async function () {
    return await model.find();
}

module.exports.getNewRoomObject = async function () {
    let result = new model();
    return result;
}

module.exports.updateRoom = async function (room) {

    var result = await model.findById({ _id: room._id });

    if (result) {
        result.coordinates = room.coordinates;
        result.items = room.items;
        result.creatures = room.creatures;
        result.books = room.books;
        result.save();
        console.log("updated room");
    } else {
        result = new model(room);
        result.save();
        console.log("saved new room");
    }
}

module.exports.addRooms = async function (r) {
    var results = [];
    for (const room of r) {
        let newRoom = new model(room);
        newRoom.save();
        results.push(newRoom);
    }
    results.push(roomRelations.makeRoomRelation(results));

    return results;
}

module.exports.save = async function (map) {
    for (const room of map) {
        this.updateRoom(room);
    }
}


module.exports.model = model;