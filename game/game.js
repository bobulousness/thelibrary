const config = {
    width: 1600,
    height: 900,
    type: Phaser.AUTO,
    parent: "game",
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
}

//import { mapsModel } from "../models/mapsDB";
var map = {};
const block = 55;
const origin = 400;
var levels = [
    {
        z: -3,
        rooms: []
    },
    {
        z: -2,
        rooms: []
    },
    {
        z: -1,
        rooms: []
    },
    {
        z: 0,
        rooms: []
    },
    {
        z: 1,
        rooms: []
    },
    {
        z: 2,
        rooms: []
    },
    {
        z: 3,
        rooms: []
    }
];
// const maps = mongoose.model("maps", mapSchema);
var cLevel = 0;
var levelRooms = [];
var selectSprites = [];
const roomRarity = [1, 1, 1, 1, 2, 2, 2, 3];
const itemRarity = [1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 4, 4, 5];

const game = new Phaser.Game(config);

function preload() {
    this.load.image('background', '../assets/grey.png');

    //small rooms
    this.load.image('standardRoom', '../assets/baseRoom.png');
    this.load.image('tallRoom', '../assets/tallRoom1.png');
    this.load.image('tallRoom2', '../assets/tallRoom2.png');

    //large rooms
    this.load.image('balconyRoom', '../assets/balconyRoom2.png');
    this.load.image('largeShortRoom', '../assets/largeShortRoom.png');
    this.load.image('balconyRoomStair', '../assets/balconyRoomStair1.png');
    this.load.image('balconyRoomStair2', '../assets/balconyRoomStair2.png');
    this.load.image('fountainRoom', '../assets/fountainRoom.png');

    //long rooms
    this.load.image('chapel', '../assets/chapel.png');
    this.load.image('chapel2', '../assets/chapel2.png');
    this.load.image('longRoom', '../assets/longRoom.png')

    //giant rooms
    this.load.image('giantRoom', '../assets/giantRoom1.png');
    this.load.image('giantRoom2', '../assets/giantRoom2.png');

    //buttons
    this.load.image('save', '../assets/save.png');
    this.load.image('newRoom', '../assets/newRoom.png');

    //selects
    this.load.spritesheet('selectRoom', '../assets/selectRoom.png', {frameHeight: 54, frameWidth: 54});
    this.load.spritesheet('select', '../assets/select.png', {frameHeight: 54, frameWidth: 54})
}

function create() {
    //make static sprites
    this.background = this.add.image(800, 450, 'background');

    var selectRoomAnim = {
        key: 'selectRoomAnim',
        frames: this.anims.generateFrameNumbers('selectRoom', {start: 0, end: 1, first: 0}),
        frameRate: 2,
        repeat: -1
    }
    var selectAnim = {
        key: 'selectAnim',
        frames: this.anims.generateFrameNumbers('select', {start: 0, end: 1, first: 0}),
        frameRate: 2,
        repeat: -1
    }

    this.anims.create(selectRoomAnim);
    this.anims.create(selectAnim);

    this.selectRoomSprite = this.add.sprite(100, 500, 'selectRoom')
        .play('selectRoomAnim')
        .setOrigin(0)
        .setDepth(1);

    this.save = this.add.sprite(80, 80, "save")
        .setOrigin(0)
        .setInteractive()
        .on('pointerdown', pointer => save());

    this.newRoom = this.add.sprite(458, 124, 'newRoom')
        .setOrigin(0)
        .setInteractive()
        .on('pointerdown', pointer => startNewRoom(this));

    //fetch maps and render level 0
    fetch("/map")
        //parse map
        .then(response => response.json())
        .then(response => JSON.stringify(response))
        //store map
        .then(response => {
            map = JSON.parse(response);
            for (let i = 0; i < map.length; i++) {
                levels[map[i].level + 3].rooms.push(map[i]);
            }
            console.log(map);
        })
        //render level 0
        .then(r => {
            let rooms = levels[3].rooms;
            console.log("part 2: " + rooms[0].coordinates.start.x + ", " + rooms[0].coordinates.start.y + ", " + rooms[0].name);
            for (let i = 0; i < rooms.length; i++) {
                let start = rooms[i].coordinates.start;
                let name = rooms[i].name;
                console.log("hit");
                levelRooms[i] = {
                    image: this.add.sprite(calculatePosition(start.x), calculatePosition(start.y), name).setOrigin(0)
                    .setInteractive(),
                    selected: false
                };
                levelRooms[i].image.on('pointerdown', pointer => selectRoom(levelRooms[i], this.selectRoomSprite));
            }
        });
}

function renderLevel(level) {
    levelRooms = [];
    cLevel = level;
    let rooms = levels[level + 3].rooms;
    console.log(rooms.length)
    for (let i = 0; i < rooms.length; i++) {
        console.log(i);
        let coords = rooms[i].coordinates;
        let name = rooms[i].name;
        levelRooms[i].push({
            image: this.add.sprite(calculatePosition(coords.start.x), calculatePosition(coords.start.y), name)
                .setOrigin(0),
            selected: false
        });
        levelRooms[i].image.on('pointerdown', pointer => selectRoom(levelRooms[i], this.selectRoomSprite));
    }
}

function update() {


}

function selectRoom(pointer, sel) {
    sel.x = pointer.image.x;
    sel.y = pointer.image.y;
    for (let i = 0; i < levelRooms.length; i++) {
        if (levelRooms[i].selected === true) {
            levelRooms[i].selected = false;
        }
        if (levelRooms[i].image.x === sel.x && levelRooms[i].image.y === sel.y) {
            pointer.selected = true;
        }
    }

}

function startNewRoom(context) {
    let sRoom = findSelectedRoom()
    if(sRoom != null) {
        let rSize = determineRoomSize(sRoom);
        killSelectSprites();
        selectSprites = [];

        //horizontal selectors
        for (let i = 0; i < rSize[0]; i++) {

            //top
            selectSprites.push(
                context.add.sprite(calculatePosition(sRoom.coordinates.end.x - i), calculatePosition(sRoom.coordinates.start.y - 1), 'select')
                    .play('selectAnim')
                    .setOrigin(0)
                    .setDepth(1)
                    .setInteractive()
                    .on('pointerdown', pointer => {
                        makeNewRoom(context, sRoom);
                    })
            );

            //bottom
            selectSprites.push(
                context.add.sprite(calculatePosition(sRoom.coordinates.end.x - i), calculatePosition(sRoom.coordinates.end.y + 1), 'select')
                    .play('selectAnim')
                    .setOrigin(0)
                    .setDepth(1)
                    .setInteractive()
                    .on('pointerdown', pointer => {
                        makeNewRoom(context, sRoom);
                    })
            );
        }

        //vertical selectors

        for (let i = 0; i < rSize[1]; i++) {
            selectSprites.push(
                context.add.sprite(calculatePosition(sRoom.coordinates.start.x - 1), calculatePosition(sRoom.coordinates.end.y - i) + 1, 'select')
                    .play('selectAnim')
                    .setOrigin(0)
                    .setDepth(1)
                    .setInteractive()
                    .on('pointerdown', pointer => {
                        makeNewRoom(context, sRoom);
                    })
            );

            selectSprites.push(
                context.add.sprite(calculatePosition(sRoom.coordinates.end.x + 1), calculatePosition(sRoom.coordinates.end.y + i), 'select')
                    .play('selectAnim')
                    .setOrigin(0)
                    .setDepth(1)
                    .setInteractive()
                    .on('pointerdown', pointer => {
                        makeNewRoom(context, sRoom);
                    })
            );
        }
        for (let i = 0; i < levelRooms.length; i++) {
            for (let q = 0; q < selectSprites.length; q++) {
                if (Phaser.Geom.Intersects.RectangleToRectangle(selectSprites[q].getBounds(), levelRooms[i].image.getBounds())) {
                    selectSprites[q].destroy();
                    selectSprites.splice(q, 1);
                    q--;
                }
            }
        }

        return selectSprites;
    }else{
        console.log("no room selected");
    }
}

function makeNewRoom(context, sRoom) {
    let rarity = roomRarity[Math.floor(Math.random() * 8)];
    let roomList;
    fetch("/getRooms", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({rare: rarity})
    })
        .then(response => JSON.stringify(response))
        .then(response =>{
            roomList = JSON.parse(response);
            let choice = roomList[Math.floor(Math.random()*roomList.length-1)];
            
        });


}

function findSelectedRoom() {
    for (let i = 0; i < levelRooms.length; i++) {
        if (levelRooms[i].selected === true) {
            return levels[cLevel + 3].rooms[i];
        }
    }

    return null;
}

function determineRoomSize(room) {
    let start = room.coordinates.start;
    let end = room.coordinates.end;
    let rsize = [Math.abs(end.x - start.x)+1, Math.abs(end.y - start.y)+1];

    return rsize;
}

function calculatePosition(value) {
    return origin + (block * value);
}

function killSelectSprites(){
    if(selectSprites.length>0){
        for(let i=0;i< selectSprites.length;i){
            selectSprites[selectSprites.length-1].destroy();
            selectSprites.pop();
        }
        selectSprites = []
    }
}

function save(pointer) {
    fetch("/save", {
        "method": "POST",
        "headers": {
            "content-type": "application/json"
        },
        "body": JSON.stringify(map)
    }).then(console.log("saved"));
}