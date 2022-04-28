const mongoose = require('mongoose');

const mapSchema = new mongoose.Schema({
    _id: {
        $oid: String
    },
    name: String,
    doors: Number,
    length: Number,
    width: Number,
    height: Number,
    volume: Number,
    rarity: String
}, {collection: 'rooms'});

const model = mongoose.model("rooms", mapSchema);

module.exports.getRooms = async function (){
    return model.find();
}

module.exports.getRoomsByRarity = async function(rare){
    return model.find({rarity: rare});
}


module.exports.model = model;