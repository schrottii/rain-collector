class SaveGame {
    new() {
        this.id = Math.random().toString(16).slice(2);
        this.name = "";
        this.startVer = "";

        this.selCur = "raindrop";

        // currencies start

        this.raindrop = {
            amount: new Decimal(0),
            time: 0,

            upgrades: {
                worth: 0,
                time: 0,
                auto: 0,
            }
        };

        this.watercoin = {
            amount: new Decimal(0),
            fill: 0,
            fillNeeded: 100,
            time: 0,

            tempBoostTime: 0,
            superAutoTime: 0,

            upgrades: {
                tempboost: 0,
                superauto: 0,
            }
        }

        this.raingold = {
            amount: new Decimal(0),
        }

        // currencies over

        this.achievements = [];

        this.stats = {
            playTime: 0,
            prestiges: 0,

            // currencies
            totalRaindrops: 0,
            mostRaindrops: 0,
            itemRaindrops: 0,

            totalWatercoins: 0,
            mostWatercoins: 0,
            itemWatercoins: 0,

            totalRaingold: 0,
            mostRaingold: 0,
            itemRaingold: 0,
        }

        this.settings = {
            music: false,
            bg: true,
            notation: "normal",
        }
    }
    loadFromSaveGame(sg, passive = false) {
        if (sg.startVer == undefined) {
            sg.startVer = "1.0";
            if (game.raindrop.upgrades.time >= 100 && game.raindrop.upgrades.auto >= 50) sg.startVer = "**1.0**";
        }
        else if (sg.startVer == "") sg.startVer = GAMEVERSION;

        if (!passive) {
            clearFallingItems();
            postPrestige = [0, 0];
        }

        for (let element in sg) {
            if (typeof (this[element]) == "object" && this[element].length == undefined) {
                for (let element2 in this[element]) {

                    if (typeof (this[element][element2]) == "object" && this[element][element2].mantissa == undefined) sg[element][element2] = Object.assign({}, this[element][element2], sg[element][element2]);
                }
                this[element] = Object.assign({}, this[element], sg[element]);
            }
            else this[element] = sg[element];
        }

        // break infinity loader
        for (let cur in currencies) {
            this[cur]["amount"] = numberLoader(this[cur]["amount"]);
        }
        for (let cur in this.stats) {
            if (cur.substr(0, 4) == "most" || cur.substr(0, 5) == "total") this.stats[cur] = numberLoader(this.stats[cur]);
        }
    }
}

var game = new SaveGame();
game.new();

function save() {
    localStorage.setItem("RAINCOL1", saveGame(game));

    if (objects["header"] != undefined) {
        objects["header"].preSaveText = objects["header"].text;
        objects["header"].text = "Game saved!";
    }
}

function saveGame(toSave) {
    let save = new SaveGame();
    save.new();
    save.loadFromSaveGame(toSave, true);

    // break infinity saver
    for (let cur in currencies) {
        save[cur]["amount"] = numberSaver(save[cur]["amount"]);
    }
    for (let cur in save.stats) {
        if (cur.substr(0, 4) == "most" || cur.substr(0, 5) == "total") save.stats[cur] = numberSaver(save.stats[cur]);
    }

    // heaueh uaehaeuh
    save = JSON.stringify(save);
    save = "rain601" + btoa(save);

    return save;
}

function exportGame() {
    navigator.clipboard.writeText(saveGame(game));
    alert("The save has been copied to your clipboard!");
}

function importGame() {
    let save = prompt("Insert the code here...");
    try {
        save = atob(save.slice(7));
        save = JSON.parse(save);

        game = new SaveGame();
        game.new();
        game.loadFromSaveGame(save);
    }
    catch {
        alert("Wrong!");
    }
}

function deleteGame() {
    if (confirm("Are you SURE you want to delete your save?! This cannot be undone!")) {
        if (confirm("Please consider making a backup before this. Are you really sure?!")) {
            if (confirm("If you press Yes one more time, your progress is gone. Maybe don't do that.")) {
                game = new SaveGame();
                game.new();
                game.startVer = GAMEVERSION;

                loadScene("mainmenu");

                alert("Progress dropped successfully!");
            }
        }
    }
}

function init() {
    let cachedGame = localStorage.getItem("RAINCOL1");
    if (cachedGame != undefined) {
        game.loadFromSaveGame(JSON.parse(atob(cachedGame.slice(7))));
    }
}