const mongoose = require('mongoose');

const mapSchema = new mongoose.Schema({
    name: String,
    container: String,
    room: Number,
    floor: Number,
    hidden: Boolean,
    known: Boolean,
    held: Number
}, { collection: 'items' });

const model = mongoose.model("items", mapSchema);

module.exports.getItem = async function (Item) {
    return await model.findById({ _id: item._id });
}

module.exports.getNewItemObject = async function () {
    let result = new model();
    return result;
}

module.exports.updateItem = async function (item) {

    var result = await model.findById({ _id: item._id });

    if (result) {
        result.container = item.container;
        result.known = item.known;
        result.hidden = item.hidden;
        result.room = item.room;
        result.held = item.held;
        result.floor = item.floor;
        result.save();
        console.log("updated item");
    } else {
        result = new model(item);
        result.save();
        console.log("saved new item");
    }
}

module.exports.additem = async function (r) {
    let newItem = new model(r);
    newItem.save();
}

module.exports.save = async function (items) {
    for (const item of items) {
        this.updateItem(item);
    }
}


module.exports.model = model;