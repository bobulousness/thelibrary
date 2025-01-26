//config the game
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

//global setup for map
var map = {};
const block = 55;
const origin = 400;
var levels = [
    { z: -3, rooms: [] },
    { z: -2, rooms: [] },
    { z: -1, rooms: [] },
    { z: 0, rooms: [] },
    { z: 1, rooms: [] },
    { z: 2, rooms: [] },
    { z: 3, rooms: [] }
];
var cLevel = 0;
var levelRooms = [];
var selectSprites = [];
const roomRarity = [1, 1, 1, 1, 2, 2, 2, 3];
const itemRarity = [1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 4, 4, 5];
const standardTextCSS = { font: "20px Arial", color: "#ffffff" };

//start the game
const game = new Phaser.Game(config);

//preload all images
function preload() {
    this.load.image('background', '../assets/grey.png');

    //small rooms
    this.load.image('baseRoom', '../assets/baseRoom.png');
    this.load.image('tallRoom1', '../assets/tallRoom1.png');
    this.load.image('tallRoom2', '../assets/tallRoom2.png');

    //large rooms
    this.load.image('balconyRoom2', '../assets/balconyRoom2.png');
    this.load.image('balconyRoom1', '../assets/largeShortRoom.png');
    this.load.image('largeShortRoom', '../assets/largeShortRoom.png');
    this.load.image('balconyRoomStair1', '../assets/balconyRoomStair1.png');
    this.load.image('balconyRoomStair2', '../assets/balconyRoomStair2.png');
    this.load.image('fountainRoom', '../assets/fountainRoom.png');

    //long rooms
    this.load.image('chapel1', '../assets/chapel.png');
    this.load.image('chapel2', '../assets/chapel2.png');
    this.load.image('longRoom', '../assets/longRoom.png')

    //giant rooms
    this.load.image('giantRoom1', '../assets/giantRoom1.png');
    this.load.image('giantRoom2', '../assets/giantRoom2.png');

    //buttons
    this.load.image('save', '../assets/save.png');
    this.load.image('newRoom', '../assets/newRoom.png');
    this.load.image('infoButton', '../assets/infoButton.png');

    //selects
    this.load.spritesheet('selectRoom', '../assets/SelectRoom.png', { frameHeight: 54, frameWidth: 54 });
    this.load.spritesheet('select', '../assets/Select.png', { frameHeight: 54, frameWidth: 54 })
}

function create() {
    //make static sprites
    this.background = this.add.image(800, 450, 'background');

    var selectRoomAnim = {
        key: 'selectRoomAnim',
        frames: this.anims.generateFrameNumbers('selectRoom', { start: 0, end: 1, first: 0 }),
        frameRate: 2,
        repeat: -1
    }
    var selectAnim = {
        key: 'selectAnim',
        frames: this.anims.generateFrameNumbers('select', { start: 0, end: 1, first: 0 }),
        frameRate: 2,
        repeat: -1
    }

    this.anims.create(selectRoomAnim);
    this.anims.create(selectAnim);

    this.selectRoomSprite = this.add.sprite(0, 0, 'selectRoom')
        .play('selectRoomAnim')
        .setOrigin(0)
        .setDepth(1);

    this.save = this.add.sprite(4, 4, "save")
        .setOrigin(0)
        .setInteractive()
        .on('pointerdown', pointer => save());

    this.newRoom = this.add.sprite(59, 4, 'newRoom')
        .setOrigin(0)
        .setInteractive()
        .on('pointerdown', pointer => startNewRoom(this));

    this.infoButton = this.add.sprite(115, 4, 'infoButton')
        .setOrigin(0)
        .setInteractive()
        .on('pointerdown', pointer => getRoomDescription(this));

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
        })
        //render level 0
        .then(r => {
            let rooms = levels[3].rooms;
            console.log("part 2: " + rooms[0].coordinates.start.x + ", " + rooms[0].coordinates.start.y + ", " + rooms[0].name);
            for (let i = 0; i < rooms.length; i++) {
                let start = rooms[i].coordinates.start;
                let name = rooms[i].name;
                levelRooms[i] = {
                    image: this.add.sprite(calculatePosition(start.x), calculatePosition(start.y), name).setOrigin(0)
                        .setInteractive(),
                    selected: false
                };
                levelRooms[i].image.on('pointerdown', pointer => selectRoom(levelRooms[i], this.selectRoomSprite));
                levelRooms[i].image.angle = rooms[i].angle;
            }
        });
}

//render a level of the map
function renderLevel(level) {
    levelRooms = [];
    cLevel = level;
    let rooms = levels[level + 3].rooms;
    console.log(rooms.length)
    for (let i = 0; i < rooms.length; i++) {
        console.log(i);
        let start = rooms[i].coordinates;
        let name = rooms[i].name;
        levelRooms[i].push({
            image: this.add.sprite(calculatePosition(start.x), calculatePosition(start.y), name)
                .setOrigin(0)
                .setInteractive(),
            selected: false
        });
        levelRooms[i].image.on('pointerdown', pointer => selectRoom(levelRooms[i], this.selectRoomSprite));
        levelRooms[i].image.angle = rooms[i].angle;
    }
}

function update() {


}

//set room to be selected (green)
function selectRoom(pointer, sel) {
    sel.x = pointer.image.x;
    sel.y = pointer.image.y;
    sel.angle = pointer.image.angle;


    for (let i = 0; i < levelRooms.length; i++) {
        //unselect the selected room
        if (levelRooms[i].selected === true) {
            levelRooms[i].selected = false;
        }
        //select the chosen room
        if (levelRooms[i].image.x === sel.x && levelRooms[i].image.y === sel.y) {
            pointer.selected = true;
        }
    }

}

//click event function for creating new room, by making the select boxes(blue)
function startNewRoom(context) {
    //get the selected room
    let sRoom = findSelectedRoom()
    console.log(sRoom);
    //if the room exists..
    if (sRoom != null) {
        //get the size of the room, get rid of any existing select sprites, and get the angle adjustments
        let rSize = determineRoomSize(sRoom);
        killSelectSprites();
        let theta = angleFullPosition(-sRoom.angle, 1, 1);
        console.log(theta + ", " + (-sRoom.angle));
        let start = sRoom.coordinates.start;
        let end = sRoom.coordinates.end;
        console.log("start: " + start.x + ", " + start.y + ", end" + end.x + ", " + end.y);

        let negx = start.x - end.x > 0 ? -1 : 1;
        let negy = start.y - end.y > 0 ? -1 : 1;

        //horizontal selectors
        for (let i = 0; i < rSize[0]; i++) {

            //top
            selectSprites.push(
                context.add.sprite(calculatePosition(end.x - (i * negx)), calculatePosition(start.y - theta[1]), 'select')
                    .play('selectAnim')
                    .setOrigin(0)
                    .setDepth(1)
                    .setInteractive()
                    .on('pointerdown', pointer => {
                        makeNewRoom(context, {
                            x: calculatePosition(end.x - (i * negx)),
                            y: calculatePosition(start.y - theta[1])
                        });
                    })
            );

            //bottom
            selectSprites.push(
                context.add.sprite(calculatePosition(end.x - (i * negx)), calculatePosition(end.y + theta[1]), 'select')
                    .play('selectAnim')
                    .setOrigin(0)
                    .setDepth(1)
                    .setInteractive()
                    .on('pointerdown', pointer => {
                        makeNewRoom(context, {
                            x: calculatePosition(end.x - (i * negx)),
                            y: calculatePosition(end.y + theta[1])
                        });
                    })
            );
        }

        //vertical selectors

        for (let i = 0; i < rSize[1]; i++) {
            selectSprites.push(
                context.add.sprite(calculatePosition(start.x - theta[0]), calculatePosition(end.y - (i * negy)), 'select')
                    .play('selectAnim')
                    .setOrigin(0)
                    .setDepth(1)
                    .setInteractive()
                    .on('pointerdown', pointer => {
                        makeNewRoom(context, {
                            x: calculatePosition(start.x - theta[0]),
                            y: calculatePosition(end.y - (i * negy))
                        });
                    })
            );

            selectSprites.push(
                context.add.sprite(calculatePosition(end.x + theta[0]), calculatePosition(end.y - (i * negy)), 'select')
                    .play('selectAnim')
                    .setOrigin(0)
                    .setDepth(1)
                    .setInteractive()
                    .on('pointerdown', pointer => {
                        makeNewRoom(context, {
                            x: calculatePosition(end.x + theta[0]),
                            y: calculatePosition(end.y - (i * negy))
                        });
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
    } else {
        console.log("no room selected");
    }
}

//click event function on click of slect sprites (blue)
function makeNewRoom(context, object) {
    //generate room rarity
    let rarity = roomRarity[Math.floor(Math.random() * 8)];
    let roomList;
    //get the roomlist, based on rarity
    fetch("/getRooms", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rare: rarity })
    })
        .then(response => response.json())
        .then(response => JSON.stringify(response))
        .then(response => {
            roomList = JSON.parse(response);
            //setup for loop
            let result = false;
            let n;
            let choice;
            let found = true;
            let again = [];
            while (result === false) {
                //pick a random room that hasn't already been picked
                while (found) {
                    found = false;
                    n = Math.floor(Math.random() * (roomList.length));
                    for (let i = 0; i < again.length; i++) {
                        if (n === again[i]) {
                            found = true;
                        }
                    }
                }
                again.push(n);
                //get the room from the list
                choice = roomList[n];
                //add the room to the map
                addRoomToMap(choice, context, object);
                found = true;
                //if it didnt work, try again
                if (again.length === roomList.length) {
                    console.log("no compatible room found")
                    result = true;
                    break;
                }
            }
            //add to level

        });
}

//function to fully implement a new room to the map and game
function addRoomToMap(choice, context, object) {
    let numOfRooms = levelRooms.length;
    let height = "";
    let pos;

    //create sprite for short rooms
    if (choice.height === 1) {
        levelRooms.push({
            image: context.add.sprite(object.x, object.y, choice.code)
                .setOrigin(0)
                .setInteractive(),
            selected: false
        });
        //create sprite for taller rooms
    } else {
        height = Math.floor(Math.random() * (choice.height)) + 1;
        levelRooms.push({
            image: context.add.sprite(object.x, object.y, choice.code + height)
                .setOrigin(0)
                .setInteractive(),
            selected: false
        });
    }
    //setup click event for room sprite
    levelRooms[numOfRooms].image.on('pointerdown', pointer => selectRoom(levelRooms[numOfRooms], context.selectRoomSprite));

    //check for collisions
    let attempt = levelRooms[numOfRooms].image;
    for (let q = 0; q < 4; q++) {
        for (let i = 0; i < levelRooms.length - 1; i++) {
            //on collide..
            if (Phaser.Geom.Intersects.RectangleToRectangle(attempt.getBounds(), levelRooms[i].image.getBounds())) {
                //adjust the angle and the position accordingly
                attempt.angle -= 90;
                pos = angleIncPosition(attempt.angle, block - 1);
                attempt.x += pos[0];
                attempt.y += pos[1];
                //if it can't fit, get rid of it
                if (q === 3) {
                    levelRooms.pop().image.destroy();
                    console.log(choice.code + " failed");
                    return false;
                }
            }
        }
    }
    console.log("angle: " + attempt.angle);

    //create the object for the new room based on angle
    let newRoom = createRoomFromAngle(attempt, choice, height);

    //create rooms above or below, based on height
    if (choice.height > 1) {
        switch (height) {
            case 1:
        }
    }

    //add room to the levels and the map
    fetch("/newRoom")
        .then(response => response.json())
        .then(response => JSON.stringify(response))
        .then(response => {
            let roomObj = JSON.parse(response);
            roomObj.name = newRoom.name;
            roomObj.angle = newRoom.angle;
            roomObj.level = cLevel;
            roomObj.coordinates = newRoom.coordinates;
            levels[cLevel + 3].rooms.push(roomObj);
            map.push(roomObj);
            killSelectSprites();
        });
}

function createRoomFromAngle(attempt, choice, height) {
    switch (attempt.angle) {
        case 0:
        case 360:
            return {
                name: choice.code + height,
                angle: attempt.angle,
                coordinates: {
                    start: {
                        x: (attempt.x - origin) / block,
                        y: (attempt.y - origin) / block
                    },
                    end: {
                        x: ((attempt.x - origin) / block) + choice.length - 1,
                        y: ((attempt.y - origin) / block) + choice.width - 1
                    }
                }
            }
            break;
        case 90:
        case -90:
            return {
                name: choice.code + height,
                angle: attempt.angle,
                coordinates: {
                    start: {
                        x: (attempt.x - origin) / block,
                        y: (attempt.y - origin) / block
                    },
                    end: {
                        x: ((attempt.x - origin) / block) + (choice.width - 1),
                        y: ((attempt.y - origin) / block) - (choice.length - 1)
                    }
                }
            }
            break;
        case 180:
        case -180:
            return {
                name: choice.code + height,
                angle: attempt.angle,
                coordinates: {
                    start: {
                        x: (attempt.x - origin) / block,
                        y: (attempt.y - origin) / block
                    },
                    end: {
                        x: ((attempt.x - origin) / block) - (choice.length - 1),
                        y: ((attempt.y - origin) / block) - (choice.width - 1)
                    }
                }
            }
            break;
        case 270:
        case -270:
            return {
                name: choice.code + height,
                angle: attempt.angle,
                coordinates: {
                    start: {
                        x: (attempt.x - origin) / block,
                        y: (attempt.y - origin) / block
                    },
                    end: {
                        x: ((attempt.x - origin) / block) - choice.length - 1,
                        y: ((attempt.y - origin) / block) + choice.width - 1
                    }
                }
            }
            break;
    }
}

//return position mods for incremental rotations
function angleIncPosition(angle, inc) {
    let result = [];
    switch (angle) {
        case -90:
            result.push(0);
            result.push(inc);
            break;
        case 90:
            result.push(0);
            result.push(-inc);
            break;
        case -180:
            result.push(inc);
            result.push(0);
            break;
        case 180:
            result.push(-inc);
            result.push(0);
            break;
        case -270:

            result.push(0);
            result.push(inc);
            break;
        case 270:
            result.push(0);
            result.push(-inc);
            break;
        default:
            result.push(0);
            result.push(0);
            break;
    }
    return result;
}

//return position mods for direct rotations
function angleFullPosition(angle, inc, low) {
    let result = [];
    switch (angle) {
        case -90:
            console.log("hit negative")
            result.push(low);
            result.push(inc);
            break;
        case 90:
            console.log("hit 90");
            result.push(low);
            result.push(-inc);
            break;
        case -180:
            result.push(inc);
            result.push(inc);
            break;
        case 180:
            result.push(-inc);
            result.push(-inc);
            break;
        case -270:
            result.push(low);
            result.push(inc);
            break;
        case 270:
            result.push(low);
            result.push(-inc);
            break;
        default:
            result.push(low);
            result.push(low);
            break;
    }
    return result;
}

//returns currently selected room
function findSelectedRoom() {
    for (let i = 0; i < levelRooms.length; i++) {
        if (levelRooms[i].selected === true) {
            return levels[cLevel + 3].rooms[i];
        }
    }
    console.log("no selected room");
    return null;
}

//calculates room size
function determineRoomSize(room) {
    let start = room.coordinates.start;
    let end = room.coordinates.end;
    let rsize = [Math.abs(end.x - start.x) + 1, Math.abs(end.y - start.y) + 1];

    return rsize;
}

//calculate greater position based on low value grid numbers
function calculatePosition(value) {
    return origin + (block * value);
}

//kills all select sprites(blue) onscreen
function killSelectSprites() {
    if (selectSprites.length > 0) {
        for (let i = 0; i < selectSprites.length; i) {
            selectSprites[selectSprites.length - 1].destroy();
            selectSprites.pop();
        }
        selectSprites = []
    }
}

function getRoomDescription(context) {
    let sRoom = findSelectedRoom();
    if (sRoom) {
        fetch("/roomData", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code: sRoom.name.replace(/[0-9]/g, '') })
        })
            .then(response => response.json())
            .then(response => JSON.stringify(response))
            .then(response => JSON.parse(response))
            .then(response => {
                console.log(response);
                var creatureList = "Creatures: \n";
                for (const creature of sRoom.creatures) {
                    creatureList += creature.name + "\n"
                        + creature.hp + "/" + creature.maxhp + "hp     is on floor #" + creature.floor + "     ";
                    creatureList += creature.hidden ? "\nhidden     " : "\nvisible     ";
                    creatureList += creature.known ? "known     \n" : "unknown     \n";
                }

                var itemList = "Items: \n";
                for (const item of sRoom.items) {
                    itemList += item.name + "\n";
                    if (item.container == "" || item.container == null) {
                        itemList += "is lying out ";
                    } else {
                        itemList += item.container + " ";
                    }
                    itemList += " on floor " + item.floor;
                    itemList += item.hidden ? "\nhidden     " : "\nvisible     ";
                    itemList += item.known ? "known     \n" : "unknown     \n";
                }
                var bookList = "Books: \n";
                for (const book of sRoom.books) {
                    bookList += book.name + "\n";
                    if (book.container == "" || book.container == null) {
                        bookList += "on the floor ";
                    } else {
                        bookList += book.container + " ";
                    }
                    bookList += " on floor " + book.floor;
                    bookList += book.hidden ? "\nhidden     " : "\nvisible     ";
                    bookList += book.known ? "known     \n" : "unknown     \n";
                }


                context.roomDesc = context.add.text(10, 60, response[0].name, standardTextCSS);
                context.roomItems = context.add.text(10, 260, itemList, standardTextCSS);
                context.roomCreatures = context.add.text(10, 460, creatureList, standardTextCSS);
                context.roomCreatures = context.add.text(10, 660, bookList, standardTextCSS);

            });
    }
}

//save the map to the database
function save(pointer) {
    fetch("/save", {
        "method": "POST",
        "headers": {
            "content-type": "application/json"
        },
        "body": JSON.stringify({ mappy: map })
    });
}