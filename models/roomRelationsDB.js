const mongoose = require('mongoose');

const mapSchema = new mongoose.Schema({
    _id: {
        $oid: String
    },
    rooms:[{
        id: Number,
        floor: Number,
        level: number
    }]
}, {collection: 'room_Relations'});

const model = mongoose.model("room_Relations", mapSchema);

module.exports.getRelatedRooms = async function (room){
    return model.findOne({room:{id: room.id}});
}


module.exports.model = model;