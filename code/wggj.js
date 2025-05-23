/*
 * WGGJ Framework file (C)
 * Made by:    Schrottii
 * VERSION:    v1.3
 * Updated on: 2025-03-18
 * 
 * DO NOT edit this file if you just copied it in -- can mess up things when updating
 * Things like images and the loading scene have to be adjusted externally
 * Everything that needs to be externally placed is provided below and in the README documentation
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



 Optional: function called customWGGJLoop() that gets executed regularly within WGGJ's own loop
 Optional: function called customWGGJInit() that initializes things (such as loading a save) before WGGJ's own init
 Optional: function called loadedScene() to replace the default scene right after starting the program

 Optional: event listeners like this:

wggjCanvas.addEventListener('keydown', event => {
    if (event.code === 'Space') {
        console.log('Space pressed');
        jump();
    }
})
*/

// VARIABLES
// canvas
var wggjCanvas = document.getElementById("wggjCanvas");
var wggjCTX = wggjCanvas.getContext("2d");
var wggjAudio = document.getElementById("wggjAudio");

// time
var wggjDelta = 0;
var wggjTime = Date.now();

// other
var wggjMouseDown = false;
var wggjTextScaling = 1;
var wggjCanvasWidth = 0;
var wggjCanvasHeight = 0;
var wggjMouse = {
    x: 0,
    y: 0
}

// change these two with some function to make the canvas not take up the entire screen, temporarily or permanent
var wggjCanvasDesiredMobileWidthMulti = 1;
var wggjCanvasDesiredPCWidthMulti = 1;
var wggjCanvasDesiredMobileHeightMulti = 1;
var wggjCanvasDesiredPCHeightMulti = 1;
var wggjCanvasDesiredSquare = false;

// things you can change if you want
var wggjRunning = true;
var wggjImageSmoothing = false;
var wggjSceneDebug = false;
var wggjStartScene = "mainmenu";

// shouuuld be set
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

// mouse stuff
wggjCanvas.addEventListener("pointerdown", wggjEventsOnClick);
wggjCanvas.addEventListener("pointerup", wggjEventsOnPointerUp);
wggjCanvas.addEventListener("pointerleave", wggjEventsOnPointerUp);
wggjCanvas.addEventListener("pointermove", wggjEventsOnPointerMove);

function wggjEventsOnClick(e) {
    wggjMouse.x = e.clientX - wggjCanvas.getBoundingClientRect().x;
    wggjMouse.y = e.clientY - wggjCanvas.getBoundingClientRect().y;
    wggjMouseDown = true;

    for (let c in objects) {
        if (objects[c] == undefined) continue;
        if (objects[c].onClick == undefined || objects[c].power == false) continue;

        if (objects[c].isHit(wggjMouse.x, wggjMouse.y)) {
            objects[c].onClick(c, e);
        }
    }
}

function wggjEventsOnPointerUp(e) {
    wggjMouseDown = false;

    for (let c in objects) {
        if (objects[c] == undefined) continue;
        if (objects[c].onUp == undefined || objects[c].power == false) continue;

        if (objects[c].isHit(wggjMouse.x, wggjMouse.y)) {
            objects[c].onUp(c, e);
        }
    }
}

function wggjEventsOnPointerMove(e) {
    wggjMouse.x = e.clientX - wggjCanvas.getBoundingClientRect().x;
    wggjMouse.y = e.clientY - wggjCanvas.getBoundingClientRect().y;

    for (let c in objects) {
        if (objects[c] == undefined) continue;
        if ((objects[c].onHold == undefined && objects[c].onMouseMove == undefined) || objects[c].power == false) continue;

        if (objects[c].isHit(wggjMouse.x, wggjMouse.y)) {
            if (wggjMouseDown && objects[c].onHold != undefined) objects[c].onHold(c, e);
            if (objects[c].onMouseMove != undefined) objects[c].onMouseMove(c, e);
        }
    }
}

function wggjEventsOnLoop(e) {
    for (let c in objects) {
        if (objects[c] == undefined) continue;
        if (objects[c].onHover == undefined || objects[c].power == false) continue;

        if (objects[c].isHit(wggjMouse.x, wggjMouse.y)) {
            objects[c].onHover(c, e);
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
    if (wggjSceneDebug) console.log("loading scene: " + sceneName)
    if (scenes[sceneName] == undefined) return false;

    currentScene = sceneName;

    objects = {};

    scenes[sceneName].init();
}

// classes: Square, Image, Text
class WGGJ_Square {
    constructor(x, y, w, h, color, config) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;

        // CONFIG
        this.power = config.power ? config.power : true;
        this.clickableOnly = config.clickableOnly ? config.clickableOnly : false;

        this.onClick = config.onClick ? config.onClick : undefined;
        this.onHold = config.onHold ? config.onHold : undefined;
        this.onMouseMove = config.onMouseMove ? config.onMouseMove : undefined;
        this.onHover = config.onHover ? config.onHover : undefined;

        this.config = config;
    }

    currentX() {
        return ~~(wggjCanvasWidth * this.x + 0.5)
            + (this.parent != undefined ? objects[this.parent].scrolledX : 0);
    }

    currentY() {
        return ~~(wggjCanvasHeight * this.y + 0.5)
            + (this.parent != undefined ? objects[this.parent].scrolledY : 0);
    }

    currentW() {
        return ~~(wggjCanvasWidth * this.w + 0.5);
    }

    currentH() {
        return ~~(wggjCanvasHeight * this.h + 0.5);
    }

    isHit(x, y) {
        // check if a point (perhaps your mouse), with its x and y, is inside this element's boundaries
        if (x > this.currentX() && y > this.currentY()
            && x < this.currentW() + this.currentX() && y < this.currentH() + this.currentY()) {
            // is in the hitbox
            return true;
        }
        return false;
    }

    render(parented = false) {
        if (this.clickableOnly == true || this.power == false) return false;
        if (this.parent != undefined && !parented) return false;

        if (this.parent != undefined) {
            let containerX = objects[this.parent].x * wggjCanvasWidth;
            let containerY = objects[this.parent].y * wggjCanvasHeight;
            let containerWidth = objects[this.parent].w * wggjCanvasWidth;
            let containerHeight = objects[this.parent].h * wggjCanvasHeight;

            wggjCTX.save();
            wggjCTX.beginPath();
            wggjCTX.rect(containerX, containerY, containerWidth, containerHeight);
            wggjCTX.clip();
        }

        wggjCTX.fillStyle = this.color;
        wggjCTX.fillRect(this.currentX(), this.currentY(), this.currentW(), this.currentH());

        if (this.parent != undefined) wggjCTX.restore();
    }
}

class WGGJ_Image {
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

        this.onClick = config.onClick ? config.onClick : undefined;
        this.onHold = config.onHold ? config.onHold : undefined;
        this.onMouseMove = config.onMouseMove ? config.onMouseMove : undefined;
        this.onHover = config.onHover ? config.onHover : undefined;

        this.config = config;
    }

    currentX() {
        let Pquadratic = this.quadratic ? wggjCanvasWidth : wggjCanvasWidth;
        let Pquadratic2 = this.quadratic ? wggjCanvasHeight : wggjCanvasWidth;
        let Pcentered = this.centered ? (Pquadratic2 * this.w / 2) : 0;
        let parentX = this.parent != undefined ? objects[this.parent].scrolledX : 0;

        return (Pquadratic * this.x) - Pcentered + parentX;
    }

    currentY() {
        let parentY = this.parent != undefined ? objects[this.parent].scrolledY : 0;

        return wggjCanvasHeight * this.y + parentY;
    }

    currentW() {
        let Pquadratic2 = this.quadratic ? wggjCanvasHeight : wggjCanvasWidth;

        return Pquadratic2 * this.w;
    }

    currentH() {
        return wggjCanvasHeight * this.h;
    }

    isHit(x, y) {
        // check if a point (perhaps your mouse), with its x and y, is inside this element's boundaries
        if (x > this.currentX() && y > this.currentY()
            && x < this.currentW() + this.currentX() && y < this.currentH() + this.currentY()) {
            // is in the hitbox
            return true;
        }
        return false;
    }

    render(parented = false) {
        // render disablers
        if (this.power == false) return false;
        if (this.parent != undefined && !parented) return false;

        // rotate 1/2 (beta)
        if (this.rotate) wggjCTX.translate(this.x + (this.w / 2), this.y + (this.h / 2)); wggjCTX.rotate(this.rotate);

        // my coordinates
        let renderX = this.currentX();
        let renderY = this.currentY();
        let renderW = this.currentW();
        let renderH = this.currentH();

        // snips
        let snipX = this.snip ? this.snip[0] : 0;
        let snipY = this.snip ? this.snip[1] : 0;
        let snipW = this.snip ? this.snip[2] : images[this.image].width;
        let snipH = this.snip ? this.snip[3] : images[this.image].height;


        if (this.parent != undefined) {
            let containerX = objects[this.parent].x * wggjCanvasWidth;
            let containerY = objects[this.parent].y * wggjCanvasHeight;
            let containerWidth = objects[this.parent].w * wggjCanvasWidth;
            let containerHeight = objects[this.parent].h * wggjCanvasHeight;

            wggjCTX.save();
            wggjCTX.beginPath();
            wggjCTX.rect(containerX, containerY, containerWidth, containerHeight);
            wggjCTX.clip();

            let overlapX = Math.max(0, containerX - renderX);
            let overlapY = Math.max(0, containerY - renderY);
            let visibleWidth = Math.min(renderW, containerX + containerWidth - renderX);
            let visibleHeight = Math.min(renderH, containerY + containerHeight - renderY);

            snipX += overlapX * (snipW / renderW);
            snipY += overlapY * (snipH / renderH);
            snipW *= visibleWidth / renderW;
            snipH *= visibleHeight / renderH;

            renderX = Math.max(renderX, containerX);
            renderY = Math.max(renderY, containerY);
            renderW = visibleWidth;
            renderH = visibleHeight;
        }

        if (this.snip || this.parent) wggjCTX.drawImage(images[this.image], snipX, snipY, snipW, snipH, renderX, renderY, renderW, renderH);
        else wggjCTX.drawImage(images[this.image], renderX, renderY, renderW, renderH);

        if (this.parent != undefined) wggjCTX.restore();

        // rotate 2/2 (beta)
        if (this.rotate) wggjCTX.translate(-this.x - (this.w / 2), -this.y - (this.h / 2)); wggjCTX.rotate(0);
    }
}

class WGGJ_Text {
    constructor(x, y, text, config) {
        this.x = x;
        this.y = y;
        this.text = text;

        // CONFIG
        this.color = config.color ? config.color : "black";
        this.size = config.size ? config.size : "12";
        this.align = config.align ? config.align : "center";
        this.power = config.power ? config.power : true;
        this.noScaling = config.noScaling ? config.noScaling : false;

        this.config = config;
    }

    getScaling() {
        // includes size, textscaling/noscaling, rounding for optimization
        let scaling = 0;
        if (this.noScaling) scaling = this.size;
        else scaling = this.size * wggjTextScaling;
        if (scaling > 60) scaling = ~~(scaling + 0.5);
        scaling *= game.settings.textscale; // EDITED!!!
        return scaling;
    }

    // placeholders
    currentX() {
        return 0;
    }

    currentY() {
        return 0;
    }

    currentW() {
        return 0;
    }

    currentH() {
        return 0;
    }

    render(parented = false) {
        if (this.power == false) return false;
        if (this.parent != undefined && !parented) return false;

        wggjCTX.fillStyle = this.color;
        wggjCTX.font = this.getScaling() + "px " + FONT;
        wggjCTX.textBaseline = "bottom";
        wggjCTX.textAlign = this.align;

        let renderX = wggjCanvasWidth * this.x;
        let renderY = wggjCanvasHeight * this.y;

        if (this.parent != undefined) {
            let containerX = objects[this.parent].x * wggjCanvasWidth;
            let containerY = objects[this.parent].y * wggjCanvasHeight;
            let containerWidth = objects[this.parent].w * wggjCanvasWidth;
            let containerHeight = objects[this.parent].h * wggjCanvasHeight;

            renderX += objects[this.parent].scrolledX;
            renderY += objects[this.parent].scrolledY;

            wggjCTX.save();
            wggjCTX.beginPath();
            wggjCTX.rect(containerX, containerY, containerWidth, containerHeight);
            wggjCTX.clip();
        }

        wggjCTX.fillText(this.text, renderX, renderY);

        if (this.parent != undefined) wggjCTX.restore();
    }
}

class WGGJ_Container {
    constructor(name, x, y, w, h, config, children) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.config = config;
        this.children = children;

        this.recentMouseX = 0;
        this.recentMouseY = 0;
        this.scrolledX = 0;
        this.scrolledY = 0;

        // CONFIG
        this.color = config.color ? config.color : false;
        this.XScroll = config.XScroll ? config.XScroll : false;
        this.YScroll = config.YScroll ? config.YScroll : false;
        this.XScrollMod = config.XScrollMod ? config.XScrollMod : 1;
        this.YScrollMod = config.YScrollMod ? config.YScrollMod : 1;
        this.XLimit = config.XLimit ? config.XLimit : [0, 0]; // left right
        this.YLimit = config.YLimit ? config.YLimit : [0, 0]; // up down
        this.limitEffect = config.limitEffect ? config.limitEffect : false;
    }

    onClick(c, e) {
        // set the start pos of a drag
        if (isNaN(e.clientX) || isNaN(e.clientY)) return false;
        if (this.XScroll == true) this.recentMouseX = e.clientX - wggjCanvas.getBoundingClientRect().x;
        if (this.YScroll == true) this.recentMouseY = e.clientY - wggjCanvas.getBoundingClientRect().y;
    }

    onHold(c, e) {
        // add the pos while dragging - done here and not in onUp so you can see it while dragging
        if (isNaN(e.clientX) || isNaN(e.clientY) || (this.recentMouseX == 0 && this.recentMouseY == 0)) return false;

        if (this.XScroll == true) {
            this.scrolledX = Math.min((this.XLimit[0] != 0 ? this.XLimit[0] : 1e7) * wggjCanvasWidth,
                Math.max((this.XLimit[1] != 0 ? -this.XLimit[1] : -1e7) * wggjCanvasWidth,
                    this.scrolledX + (e.clientX - wggjCanvas.getBoundingClientRect().x - this.recentMouseX) * this.XScrollMod));

        }
        if (this.YScroll == true) {
            this.scrolledY = Math.min((this.YLimit[0] != 0 ? this.YLimit[0] : 1e7) * wggjCanvasHeight,
                Math.max((this.YLimit[1] != 0 ? -this.YLimit[1] : -1e7) * wggjCanvasHeight,
                    this.scrolledY + (e.clientY - wggjCanvas.getBoundingClientRect().y - this.recentMouseY) * this.YScrollMod));
        }

        this.recentMouseX = e.clientX;
        this.recentMouseY = e.clientY;
    }

    resetScroll() {
        this.recentMouseX = 0;
        this.recentMouseY = 0;
        this.scrolledX = 0;
        this.scrolledY = 0;
    }

    currentX() {
        return wggjCanvasWidth * this.x;
    }

    currentY() {
        return wggjCanvasHeight * this.y;
    }

    currentW() {
        return wggjCanvasWidth * this.w;
    }

    currentH() {
        return wggjCanvasHeight * this.h;
    }

    isHit(x, y) {
        // check if a point (perhaps your mouse), with its x and y, is inside this element's boundaries
        if (x > this.currentX() && y > this.currentY()
            && x < this.currentW() + this.currentX() && y < this.currentH() + this.currentY()) {
            // is in the hitbox
            return true;
        }
        return false;
    }

    render() {
        if (this.color != false) {
            // background color
            wggjCTX.fillStyle = this.color;
            wggjCTX.fillRect(this.currentX(), this.currentY(), this.currentW(), this.currentH());
        }

        if (this.limitEffect != false && wggjMouseDown) {
            wggjCTX.fillStyle = this.limitEffect == true ? "white" : this.limitEffect;

            if (this.scrolledX == this.XLimit[0] * wggjCanvasWidth) wggjCTX.fillRect(this.currentX(), this.currentY(), 0.004 * wggjCanvasWidth, this.currentH());
            if (this.scrolledX == -this.XLimit[1] * wggjCanvasWidth) wggjCTX.fillRect(this.currentX() + this.currentW() - 0.004 * wggjCanvasWidth, this.currentY(), 0.004 * wggjCanvasWidth, this.currentH());
            if (this.scrolledY == this.YLimit[0] * wggjCanvasHeight) wggjCTX.fillRect(this.currentX(), this.currentY(), this.currentW(), 0.004 * wggjCanvasHeight);
            if (this.scrolledY == -this.YLimit[1] * wggjCanvasHeight) wggjCTX.fillRect(this.currentX(), this.currentY() + this.currentH() - 0.004 * wggjCanvasHeight, this.currentW(), 0.004 * wggjCanvasHeight);
        }

        for (let child in this.children) {
            let thisChild = objects[this.children[child]];

            // set this container as the child's parent
            if (thisChild.parent == undefined) thisChild.parent = this.name;

            // render it from here, so it gets rendered on top
            // in their individual render functions there's stuff to prevent duplicate rendering
            thisChild.render(true);
        }
    }
}

// create functions: createSquare, createImage, createText, createClickable, createButton
function createSquare(name, x, y, w, h, color, config = {}) {
    if (objects[name] == undefined) {
        objects[name] = new WGGJ_Square(x, y, w, h, color, config);
        return name;
    }
    return "";
}

function createImage(name, x, y, w, h, image, config = {}) {
    if (objects[name] == undefined) {
        objects[name] = new WGGJ_Image(x, y, w, h, image, config);
        return name;
    }
    return "";
}

function createText(name, x, y, text, config = {}) {
    if (objects[name] == undefined) {
        objects[name] = new WGGJ_Text(x, y, text, config);
        return name;
    }
    return "";
}

function createClickable(clickableName, x, y, w, h, onClick, config = {}) {
    if (objects[clickableName] == undefined) {
        objects[clickableName] = new WGGJ_Square(x, y, w, h, "white", config);
        objects[clickableName].clickableOnly = true;
        objects[clickableName].onClick = onClick;
        return name;
    }
    return "";
}

function createButton(clickableName, x, y, w, h, color, onClick, config = {}) {
    if (objects[clickableName] == undefined) {
        if (color.substr(0, 1) == "#") objects[clickableName] = new WGGJ_Square(x, y, w, h, color, config);
        else objects[clickableName] = new WGGJ_Image(x, y, w, h, color, config);
        objects[clickableName].onClick = onClick;
        return clickableName;
    }
    return "";
}

function createContainer(name, x, y, w, h, config, children) {
    if (objects[name] == undefined) {
        objects[name] = new WGGJ_Container(name, x, y, w, h, config, children);
        return name;
    }
    return "";
}

function wggjUpdateTextScaling() {
    // can be replaced if you want different scaling
    // but this one is 0.5 at 480 width, 0.4375 at 360 and 1 at 1440... roughly what you want.
    // also popular: wggjTextScaling = isMobile() ? 0.5 : 1;
    wggjTextScaling = 0.25 + 0.5 * (wggjCanvasWidth / 960);
}

// wggjLoop
function wggjLoop() {
    // The game's main loop
    // This part just does the wggj side of things, to add your own loop, define a function called customWGGJLoop()

    if (!wggjRunning) return false; // can be used to turn off the loop. start it again by calling it

    // Tick wggjTime
    wggjDelta = Date.now() - wggjTime;
    wggjTime = Date.now();

    wggjEventsOnLoop();

    // Resize the wggjCanvas
    if (window.innerWidth <= 480) {
        // mobile
        wggjCanvas.style.width = (wggjCanvasWidth = wggjCanvas.width = window.innerWidth * wggjCanvasDesiredMobileWidthMulti) + "px";
        wggjCanvas.style.height = (wggjCanvasHeight = wggjCanvas.height = (wggjCanvasDesiredSquare ? window.innerWidth : window.innerHeight) * wggjCanvasDesiredMobileHeightMulti) + "px";
    }
    else {
        // PC
        wggjCanvas.style.width = (wggjCanvasWidth = wggjCanvas.width = window.innerWidth * wggjCanvasDesiredPCWidthMulti) + "px";
        wggjCanvas.style.height = (wggjCanvasHeight = wggjCanvas.height = (wggjCanvasDesiredSquare ? window.innerWidth : window.innerHeight) * wggjCanvasDesiredPCHeightMulti) + "px";
    }

    wggjUpdateTextScaling();
    wggjCTX.imageSmoothingEnabled = wggjImageSmoothing;

    // Your own custom loop function
    if (typeof (customWGGJLoop) != "undefined") customWGGJLoop(wggjDelta);

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
    wggjCTX.fillStyle = "black";
    wggjCTX.fillRect(0, 0, wggjCanvasWidth, wggjCanvasHeight);

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
    if (typeof (customWGGJInit) != "undefined") customWGGJInit();

    wggjAudio.loop = true;

    // creates a clickable that spans the entire screen, click to start
    createClickable("startTheGame", 0, 0, 1, 1, () => {
        loadScene(wggjStartScene != undefined ? wggjStartScene : "mainmenu");
    });
}