/*
 * WGGJ Framework file
 * Made by Schrottii
 * VERSION: v1.0
 * 
 * DO NOT edit this file
 * Things like images and the loading scene have to be adjusted externally
 * Everything that needs to be externally placed is provided below
 */

/*
 Things to put in the index.html:
 <audio id="wggjAudio" type="audio/ogg" preload="auto"></audio>
 <canvas id="wggjCanvas"></canvas>
 <script src="code/wggj.js"></script>
 and the respective scene loading files. if the wggj.js is not in a dir called code you may have to change the path. it should be loaded before your other scripts (such as main.js)



 Things to put in main.js or similar:
 Define every image that will be used and the name of the game/app:

images = {
   placeholder: "placeholder.png",
}
GAMENAME = "name of your game or app here";
FONT = "name of your font";        - - - optional, only if you have a custom font
wggjLoadImages();
wggjLoop();



 Optional: function called loop() that gets executed regularly within WGGJ's own loop
 Optional: function called init() that initializes things (such as loading a save) before WGGJ's own init
 Optional: function called loadedScene() to replace the default scene right after starting the program

 Optional: event listeners like this:

document.addEventListener('keydown', event => {
    if (event.code === 'Space') {
        console.log('Space pressed');
        jump();
    }
})

 */

// variables
var wggjCanvas = document.getElementById("wggjCanvas");
var wggjCTX = wggjCanvas.getContext("2d");
var wggjAudio = document.getElementById("wggjAudio");

var wggjDelta = 0;
var wggjTime = Date.now();

var wggjTextScaling = 1;
var wggjCanvasWidth = 0;
var wggjCanvasHeight = 0;

var FONT = "Times";
var GAMENAME = "";
var currentScene = "none";

// Images have to be loaded before they can be placed on a canvas
var images = {

}

// Scenes are different parts of the visual part of the game, for example a main menu and a shop
var scenes = {

}

// This contains all objects in the current scene: image objects, buttons, etc.
var objects = {

}

// This contains all clickable areas in the current scene, they are generated seperately from objects
var clickables = {

}

// loading stuff
var wggjLoadingImages = 0;
var wggjLoadedImages = 0;

function wggjLoadImages() {
    for (let image in images) {
        let img = new Image();
        img.src = "images/" + images[image];
        img.onload = () => {
            wggjLoadedImages++;
            if (wggjLoadingImages == wggjLoadedImages) {
                console.log("WGGJ: all images loaded");
                wggjInit(); // start game
            }
        }
        images[image] = img;
        wggjLoadingImages++;
    }
}

wggjCanvas.addEventListener("pointerdown", onClick);
function onClick(e) {
    let mouseX = e.clientX;
    let mouseY = e.clientY;

    for (c in clickables) {
        if (clickables[c] == undefined) return false;
        if (mouseX > clickables[c][0] && mouseY > clickables[c][1]
            && mouseX < clickables[c][0] + clickables[c][2] && mouseY < clickables[c][1] + clickables[c][3]) {
            // is in the hitbox
            clickables[c][4](c);
        }
    }
}

// scene stuff
class Scene {
    constructor(init, loop) {
        this.init = init;
        this.loop = loop;
    }
}

function loadScene(sceneName) {
    console.log("loading scene: " + sceneName)
    if (scenes[sceneName] == undefined) return false;

    currentScene = sceneName;

    objects = {};
    clickables = {};

    scenes[sceneName].init();
}

// classes: Square, Picture, Text
class Square {
    constructor(x, y, w, h, color, config) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;

        // CONFIG
        this.power = config.power ? config.power : true;

        this.config = config;
    }

    render() {
        if (this.power == false) return false;

        wggjCTX.fillStyle = this.color;
        wggjCTX.fillRect(wggjCanvasWidth * this.x, wggjCanvasHeight * this.y, wggjCanvasWidth * this.w, wggjCanvasHeight * this.h);
    }
}

class Picture {
    constructor(x, y, w, h, image, config) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.image = image;

        // CONFIG
        this.quadratic = config.quadratic ? config.quadratic : false;
        this.centered = config.centered ? config.centered : false;
        this.power = config.power ? config.power : true;

        this.config = config;
    }

    render() {
        if (this.power == false) return false;

        if (this.rotate) wggjCTX.translate(this.x + (this.w / 2), this.y + (this.h / 2)); wggjCTX.rotate(this.rotate);

        let Pquadratic = this.quadratic ? (wggjCanvasWidth * this.x) : wggjCanvasWidth * this.x;
        let Pquadratic2 = this.quadratic ? wggjCanvasHeight * this.w : wggjCanvasWidth * this.w;
        let Pcentered = this.centered ? (Pquadratic2 / 2) : 0;

        if (this.snip) wggjCTX.drawImage(images[this.image], this.snip[0], this.snip[1], this.snip[2], this.snip[3], Pquadratic - Pcentered, wggjCanvasHeight * this.y, Pquadratic2, wggjCanvasHeight * this.h);
        else wggjCTX.drawImage(images[this.image], Pquadratic - Pcentered, wggjCanvasHeight * this.y, Pquadratic2, wggjCanvasHeight * this.h);
        if (this.rotate) wggjCTX.translate(-this.x - (this.w / 2), -this.y - (this.h / 2)); wggjCTX.rotate(0);
    }
}

class Text {
    constructor(x, y, text, config) {
        this.x = x;
        this.y = y;
        this.text = text;

        // CONFIG
        this.color = config.color ? config.color : "black";
        this.size = config.size ? config.size : "12";
        this.align = config.align ? config.align : "center";
        this.power = config.power ? config.power : true;

        this.config = config;
    }

    render() {
        if (this.power == false) return false;

        wggjCTX.fillStyle = this.color;
        wggjCTX.font = (this.size * wggjTextScaling) + "px " + FONT;
        wggjCTX.textBaseline = "bottom";
        wggjCTX.textAlign = this.align;

        wggjCTX.fillText(this.text, wggjCanvasWidth * this.x, wggjCanvasHeight * this.y);
    }
}

// create functions: createSquare, createImage, createText, createClickable, createButton
function createSquare(name, x, y, w, h, color, config = {}) {
    if (objects[name] == undefined) objects[name] = new Square(x, y, w, h, color, config);
}

function createImage(name, x, y, w, h, image, config = {}) {
    if (objects[name] == undefined) objects[name] = new Picture(x, y, w, h, image, config);
}

function createText(name, x, y, text, config = {}) {
    if (objects[name] == undefined) objects[name] = new Text(x, y, text, config);
}

function createClickable(clickableName, x, y, w, h, onClick) {
    if (clickables[clickableName] == undefined) {
        clickables[clickableName] = [wggjCanvasWidth * x, wggjCanvasHeight * y, wggjCanvasWidth * w, wggjCanvasHeight * h, onClick];
    }
}

function createButton(clickableName, x, y, w, h, color, onClick, config = {}) {
    if (objects[clickableName] == undefined && clickables[clickableName] == undefined) {
        if (color.substr(0, 1) == "#") objects[clickableName] = new Square(x, y, w, h, color, config);
        else objects[clickableName] = new Picture(x, y, w, h, color, config);
        clickables[clickableName] = [wggjCanvasWidth * x - (config.centered ? ((config.quadratic ? wggjCanvasHeight * h : wggjCanvasWidth * w) / 2) : 0), wggjCanvasHeight * y, config.quadratic ? wggjCanvasHeight * h : wggjCanvasWidth * w, wggjCanvasHeight * h, onClick];
    }

}

// wggjLoop
function wggjLoop() {
    // The game's main loop
    // This part just does the wggj side of things, to add your own loop, define a function called loop()

    // Tick wggjTime
    wggjDelta = Date.now() - wggjTime;
    wggjTime = Date.now();

    // Resize the wggjCanvas
    wggjCanvas.style.width = (wggjCanvas.width = window.innerWidth) + "px";
    wggjCanvas.style.height = (wggjCanvas.height = window.innerHeight) + "px";

    wggjCanvasWidth = window.innerWidth;
    wggjCanvasHeight = window.innerHeight;

    wggjTextScaling = isMobile() ? 0.5 : 1;
    wggjCTX.imageSmoothingEnabled = false;

    // Your own custom loop function
    if (typeof (loop) != "undefined") loop(wggjDelta);

    if (currentScene != "none") {
        // render the current scene
        scenes[currentScene].loop(wggjDelta / 1000);

        // normal objects
        for (o in objects) {
            if (!objects[o].config?.foreground) objects[o].render();
        }
        // foreground objects
        for (o in objects) {
            if (objects[o].config?.foreground) objects[o].render();
        }
    }
    else {
        // Loading images / no scene selected
        // if you want to adjust it, create your own function called loadedScene()
        if (typeof (loadedScene) != "undefined") loadedScene();
        else wggjLoadedScene();
    }

    requestAnimationFrame(wggjLoop);
}

function wggjLoadedScene() {
    wggjCTX.font = "40px " + FONT;
    wggjCTX.fillStyle = "white";
    wggjCTX.textBaseline = "bottom";
    wggjCTX.textAlign = "center";

    wggjCTX.fillText(GAMENAME, wggjCanvasWidth / 2, wggjCanvasHeight / 4);
    if (wggjLoadedImages == wggjLoadingImages) wggjCTX.fillText("Click to start!", wggjCanvasWidth / 2, wggjCanvasHeight / 2);
    else wggjCTX.fillText("Loaded: " + wggjLoadedImages + "/" + wggjLoadingImages, wggjCanvasWidth / 2, wggjCanvasHeight / 2);
}

function isMobile() {
    return /Mobi/i.test(window.navigator.userAgent) || wggjCanvasWidth <= 480;
}

// initialize the game
wggjCTX.imageSmoothingEnabled = false;

function wggjInit() {
    // Your own custom init function
    if (typeof (init) != "undefined") init();

    wggjAudio.loop = true;

    // creates a clickable that spans the entire screen, click to start
    createClickable("startTheGame", 0, 0, 1, 1, () => {
        loadScene("mainmenu");
    });
}