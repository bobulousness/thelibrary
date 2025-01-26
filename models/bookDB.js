const mongoose = require('mongoose');
const bookLKP = require('./models/bookLKPDB');

const mapSchema = new mongoose.Schema({
    name: String,
    container: String,
    floor: Number,
    used: Boolean,
    room: Number,
    hidden: Boolean,
    held: Number,
    known: Boolean
}, { collection: 'books' });

const model = mongoose.model("books", mapSchema);

module.exports.getRoomBooks = async function (room) {
    return await model.find({room: room._id});
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
        result.held = book.held;
        result.room = book.room;
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

module.exports.getBookDescriptions = async function (room){
    var books = this.getRoomBooks(room);
    var results = [];
    for(const book of books){
        results.push(bookLKP.getBookDescriptions(book));
    }
    return results;
}


module.exports.model = model;