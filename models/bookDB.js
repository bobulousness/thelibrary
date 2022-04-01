import * as mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    name: String,
    class: String,
    requirements: String
}, {collection: 'books'});

const model = mongoose.model("books", bookSchema);

module.exports.getBooks = async function (){
    return await model.find();
}