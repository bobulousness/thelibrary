const mongoose = require('mongoose');


const bookSchema = new mongoose.Schema({
    name: String,
    class: String,
    requirements: String
}, {collection: 'book_lkp'});

const model = mongoose.model("book_lkp", bookSchema);

module.exports.getBooks = async function (){
    return await model.find();
}

module.exports.model = model;