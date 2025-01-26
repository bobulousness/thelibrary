const mongoose = require('mongoose');

const mapSchema = new mongoose.Schema({
    name: String,
    hp: Number,
    maxhp: Number,
    floor: Number,
    hidden: Boolean,
    known: Boolean,
    opinion: String,
    alive: Boolean
    
}, { collection: 'creatures' });

const model = mongoose.model("creatures", mapSchema);

module.exports.getMap = async function () {
    return await model.find();
}

module.exports.getNewCreatureObject = async function () {
    let result = new model();
    return result;
}

module.exports.updateRoom = async function (creature) {

    var result = await model.findById({ _id: creature._id });

    if (result) {
        result.hp = creature.hp;
        result.items = creature.items;
        result.creatures = creature.creatures;
        result.books = result.books;
        result.save();
        console.log("updated room");
    } else {
        result = new model(creature);
        result.save();
        console.log("saved new room");
    }
}

module.exports.addRoom = async function (r) {
    let newRoom = new model(r);
    newRoom.save();
}

module.exports.save = async function (map) {
    for (const room of map) {
        this.updateRoom(room);
    }
}


module.exports.model = model;