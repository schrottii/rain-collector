class SaveGame {
    new() {
        this.id = Math.random().toString(16).slice(2);
        this.name = "";
        this.startVer = "";

        this.selCur = "raindrop";

        this.raindrop = {
            amount: 0,
            time: 0,

            upgrades: {
                worth: 0,
                time: 0,
                auto: 0,
            }
        };

        this.watercoin = {
            amount: 0,
            fill: 0,
            time: 0,

            tempBoostTime: 0,
            superAutoTime: 0,

            upgrades: {
                tempboost: 0,
                superauto: 0,
            }
        }

        this.raingold = {
            amount: 0,
        }

        this.stats = {
            playTime: 0,
            prestiges: 0,

            // currencies
            totalRaindrops: 0,
            mostRaindrops: 0,
            totalWatercoins: 0,
            mostWatercoins: 0,
            totalRaingold: 0,
            mostRaingold: 0,
        }

        this.settings = {
            music: false,
            bg: true,
        }
    }
    loadFromSaveGame(sg) {
        if (sg.startVer == undefined) {
            sg.startVer = "1.0";
            if (game.raindrop.upgrades.time >= 100 && game.raindrop.upgrades.auto >= 50) sg.startVer = "**1.0**";
        }
        else if (sg.startVer == "") sg.startVer = GAMEVERSION;

        if (objects["drop4"] != undefined) {
            for (let i = 1; i <= 20; i++) {
                objects["drop" + i].power = false;
            }
        }
        postPrestige = [0, 0];

        for (let element in sg) {
            if (typeof (this[element]) == "object") {
                for (let element2 in this[element]) {
                    if (typeof (this[element][element2]) == "object") sg[element][element2] = Object.assign({}, this[element][element2], sg[element][element2]);
                }
                this[element] = Object.assign({}, this[element], sg[element]);
            }
            else this[element] = sg[element];
        }
    }
}

var game = new SaveGame();
game.new();

function save() {
    localStorage.setItem("RAINCOL1", "rain601" + btoa(JSON.stringify(game)));

    if (objects["header"] != undefined) {
        objects["header"].preSaveText = objects["header"].text;
        objects["header"].text = "Game saved!";
    }
}

function exportGame() {
    let save = game;
    save = JSON.stringify(save);
    save = "rain601" + btoa(save);
    navigator.clipboard.writeText(save);
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