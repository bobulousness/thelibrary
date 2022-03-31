const mongoose = require('mongoose');
const books = require('../models/bookDB');
var bodypars = require('body-parser');
var session = require('express-session');


main().catch(err => console.log(err));
async function main(){


    await mongoose.connect('mongodb://localhost:27017/Library',{useNewUrlParser: true, useUnifiedTopology: true});
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {});

    var urle = bodypars.urlencoded({extended: false});
    var app = express();
    app.use(session({secret: 'hello'}));
    app.set('view engine', 'ejs');

    app.use('/assets', express.static('assets'));


    var bookList = books.getBooks();

    app.get('/', function (req, res) {
        res.render('index', {bookList: bookList });
    });





}

function setupDB(){
    booksSet();
}

function booksSet(){

}