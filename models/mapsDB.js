const mongoose = require('mongoose');

const mapSchema = new mongoose.Schema({
    _id: {
        $oid: String
    },
    name: String,
    level: Number,
    coordinates:{
        start: {
            x: Number,
            y: Number
        },
        end:{
            x: Number,
            y: Number
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
        1: {
            name: String,
            hp: Number,
            maxhp: Number,
            floor: Number,
            hidden: Boolean,
            known: Boolean
        }
    }]
}, {collection: 'maps'});

const mapsModel = mongoose.model('maps', mapSchema);

module.exports.getMap = async function (){
    return await mapsModel.find({});
}

module.exports.updateMap = async function (room){

    var result = await mapsModel.findOne(room);

    if (result) {
        result.rsvp = rsvp;
        result.save();
        console.log("updated room");
    } else {
        room.save();
        console.log("saved new room");
    }
};