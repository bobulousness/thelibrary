const mongoose = require("mongoose");

//const game = new Phaser.Game(800,600,Phaser.AUTO,'game',{preload:preload,create:create,update:update,render:render});

async function preload(){

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