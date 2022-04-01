var express = require('express');
var bodypars = require('body-parser');
var session = require('express-session');
const mongoose = require('mongoose');

main().catch(err => console.log(err));

const game = new Phaser.Game(800,600,Phaser.AUTO,'game',
    {preload:preload,create:create,update:update,render:render});

async function preload(){
    await mongoose.connect('mongodb://localhost:27017/Library');
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {});

    this.load.image('background', 'assets/glock.png')

    var bookList = books.getBooks();
}

function create(){
 this.background = this.add.tileSprite(0,0,320,568, 'background');

}

function update(){

}

function render(){

}