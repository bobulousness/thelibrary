const mongoose = require('mongoose');

const mapSchema = new mongoose.Schema({
    name: String,
    hp: Number,
    maxhp: Number,
    floor: Number,
    hidden: Boolean,
    known: Boolean,
    opinion: String,
    room: Number,
    alive: Boolean
    
}, { collection: 'creatures' });

const model = mongoose.model("creatures", mapSchema);

module.exports.getCreature = async function (creature) {
    return await model.findById(creature._id);
}

module.exports.getNewCreatureObject = async function () {
    let result = new model();
    return result;
}

module.exports.updateCreature = async function (creature) {

    var result = await model.findById({ _id: creature._id });

    if (result) {
        result.hp = creature.hp;
        result.opinion = creature.opinion;
        result.known = creature.known;
        result.floor = creature.floor;
        result.room = creature.room;
        result.alive = creature.alive;
        result.hidden = creature.hidden;
        result.maxhp = creature.maxhp;
        result.save();
        console.log("updated room");
    } else {
        result = new model(creature);
        result.save();
        console.log("saved new room");
    }
}

module.exports.addCreature = async function (r) {
    let newRoom = new model(r);
    newRoom.save();
}

module.exports.save = async function (creatures) {
    for (const creature of creatures) {
        this.updateCreature(creature);
    }
}


module.exports.model = model;