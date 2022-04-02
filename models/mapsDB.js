const mongoose = require("mongoose");

const mapSchema = new mongoose.Schema({
    _id: {
        $oid: String
    },
    coordinates:{
        start: {
            x: Number,
            y: Number,
            z: Number
        },
        end:{
            x: Number,
            y: Number,
            z: Number
        }
    },
    items: [{
            name: String,
            container: String,
            floor: Number,
            state:String
    }],
    creatures: [{
        1: {
            name: String,
            hp: Number,
            maxhp: Number,
            floor: Number
        }
    }]
}, {collection: 'maps'});

const model = mongoose.model("maps", mapSchema);

module.exports.getMap = async function (){
    return await model.find();
}


module.exports.model = model;