const mongoose = require('mongoose');

const mapSchema = new mongoose.Schema({
    name: String,
    container: String,
    floor: Number,
    used: Boolean,
    room: Number,
    hidden: Boolean,
    known: Boolean
}, { collection: 'books' });

const model = mongoose.model("books", mapSchema);

module.exports.getRoomBooks = async function (room) {
    return await model.find();
}

module.exports.getNewBookObject = async function () {
    let result = new model();
    return result;
}

module.exports.updateBook = async function (book) {

    var result = await model.findById({ _id: book._id });

    if (result) {
        result.container = book.container
        result.floor = book.floor;
        result.used = book.used;
        result.hidden = book.hidden;
        result.save();
        console.log("updated room");
    } else {
        result = new model(book);
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