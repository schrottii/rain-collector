// game made by schrottii, do not steal/copy bla bla bla

images = {
    button: "button.png",
    bg: "bg.png",
    bg2: "bg2.png",

    upgrades: "upgrades.png",
    settings: "settings.png",

    pencil: "pencil.png",
    music: "music.png",
    musicoff: "music-off.png",
    background: "background.png",
    backgroundoff: "backgroundoff.png",

    "currencies/raindrop": "currencies/raindrop.png",
    "currencies/watercoin": "currencies/watercoin.png",
}
GAMENAME = "Rain Collector";
FONT = "Birdland";
wggjLoadImages();
wggjLoop();

function loadedScene() {
    wggjCTX.fillStyle = "darkblue";
    wggjCTX.fillRect(0, 0, wggjCanvasWidth, wggjCanvasHeight);

    wggjCTX.fillStyle = "white";
    wggjCTX.textBaseline = "bottom";
    wggjCTX.textAlign = "center";

    wggjCTX.font = "80px " + FONT;
    wggjCTX.fillText(GAMENAME, wggjCanvasWidth / 2, wggjCanvasHeight / 4);

    wggjCTX.font = "40px " + FONT;
    if (wggjLoadedImages == wggjLoadingImages) wggjCTX.fillText("Click to start!", wggjCanvasWidth / 2, wggjCanvasHeight / 2);
    else wggjCTX.fillText("Loaded: " + wggjLoadedImages + "/" + wggjLoadingImages, wggjCanvasWidth / 2, wggjCanvasHeight / 2);
}

var autoSaveTime = 0;

function loop(delta) {
    game.stats.playTime += delta;
    autoSaveTime += delta / 1000;
    game.watercoin.tempBoostTime -= delta / 1000;
    game.watercoin.superAutoTime -= delta / 1000;

    if (autoSaveTime >= 5) {
        save();
        autoSaveTime = 0;
    }
    else if (autoSaveTime >= 0.5) {
        if (objects["header"] != undefined && objects["header"].preSaveText != undefined) objects["header"].text = objects["header"].preSaveText;
    }
}