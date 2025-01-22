const mongoose = require('mongoose');

const mapSchema = new mongoose.Schema({
    _id: {
        $oid: String
    },
    name: String,
    level: Number,
    angle: Number,
    coordinates:{
        start: {
            x: Number,
            y: Number,
        },
        end:{
            x: Number,
            y: Number,
        }
    },
    items: [{
        name: String,
        container: String,
        floor: Number,
        hidden: Boolean,
        known: Boolean
    }],
    creatures: [{
        name: String,
        hp: Number,
        maxhp: Number,
        floor: Number,
        hidden: Boolean,
        known: Boolean,
        alive: Boolean
    }]
}, {collection: 'maps'});

const model = mongoose.model("maps", mapSchema);

module.exports.getMap = async function (){
    return await model.find();
}

module.exports.updateRoom = async function (room){

    var result = await model.findOne(room);

    if (result) {
        result.save();
        console.log("updated room");
    } else {
        let result = new model(room);
        result.save();
        console.log("saved new room");
    }
}

module.exports.addRoom = async function (r) {
    let newRoom = new model(r);
    newRoom.save();
}


module.exports.model = model;