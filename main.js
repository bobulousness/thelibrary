const mongoose = require('mongoose');
const books = require('./models/bookDB');

const game = new Phaser.Game(800,600,Phaser.AUTO,'game',
    {preload:preload,create:create,update:update,render:render});

async function preload(){
    await mongoose.connect('mongodb://localhost:27017/Library',{useNewUrlParser: true, useUnifiedTopology: true});
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {});



    var bookList = books.getBooks();
}

function create(){


}

function update(){

}

function render(){

}