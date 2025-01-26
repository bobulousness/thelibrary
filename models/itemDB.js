const mongoose = require('mongoose');

const mapSchema = new mongoose.Schema({
    name: String,
    container: String,
    floor: Number,
    hidden: Boolean,
    known: Boolean,
    held: Number
}, { collection: 'items' });

const model = mongoose.model("items", mapSchema);

module.exports.getItem = async function (Item) {
    return await model.find();
}

module.exports.getNewItemObject = async function () {
    let result = new model();
    return result;
}

module.exports.updateItem = async function (item) {

    var result = await model.findById({ _id: item._id });

    if (result) {
        result.coordinates = item.coordinates;
        result.items = item.items;
        result.creatures = item.creatures;
        result.books = result.books;
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
    for (const item of map) {
        this.updateItem(item);
    }
}


module.exports.model = model;