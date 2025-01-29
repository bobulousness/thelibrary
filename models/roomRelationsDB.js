const mongoose = require('mongoose');

const mapSchema = new mongoose.Schema({
    _id: {
        $oid: String
    },
    rooms:[{
        id: Number,
        floor: Number,
        level: Number
    }]
}, {collection: 'room_Relations'});

const model = mongoose.model("room_Relations", mapSchema);

module.exports.getRelatedRooms = async function (room){
    return model.findOne({room:{id: room.id}});
}

module.exports.makeRoomRelation = async function (rooms){
    let relation = new model();
    for(i = 0; i < rooms.length -1; i++){
        relation.rooms[i].id = rooms[i].id;
        relation.rooms[i].floor = rooms[i].floor;
        relation.rooms[i].level = room[i].level;
    }
    relation.save()
    return relation;
}

module.exports.model = model;