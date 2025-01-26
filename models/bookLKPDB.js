const mongoose = require('mongoose');


const bookSchema = new mongoose.Schema({
    name: String,
    class: String,
    requirements: String
}, {collection: 'book_lkp'});

const model = mongoose.model("book_lkp", bookSchema);

module.exports.getRandomBook = async function (book){
    var all = await model.find();
    return all[Math.floor(Math.random() * all.length)];
}

module.exports.getBookDetails = async function (book){
    return await mongoose.find({name: book.name});
}
module.exports.model = model;