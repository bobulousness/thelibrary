const mongoose = require('mongoose');

const mapSchema = new mongoose.Schema({
    name: String,
    code: String,
    readName: String,
    doors: Number,
    length: Number,
    width: Number,
    height: Number,
    volume: Number,
    features: String,
    rarity: String
}, {collection: 'room_lkp'});

const model = mongoose.model("room_lkp", mapSchema);

module.exports.getRooms = async function (){
    return model.find();
}

module.exports.getRoomsByRarity = async function(rare){
        switch(rare){
            case 1:
                return model.find({rarity: "common"});
                break;
            case 2:
                return model.find({rarity: "uncommon"});
                break;
            case 3:
                return model.find({rarity: 'rare'});
        }
}

module.exports.getRoomData = async function(code){
    return model.find({code: code});
}


module.exports.model = model;