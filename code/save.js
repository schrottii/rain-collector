class SaveGame {
    new() {
        this.id = Math.random().toString(16).slice(2);
        this.name = "";
        this.startVer = "";

        this.selCur = "raindrop";
        this.selTemp = "none";

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
                economicbubble: 0,
                coinpop: 0,
            }
        }

        this.raingold = {
            amount: new Decimal(0),
        }

        this.bubble = {
            amount: new Decimal(0),
            time: 0,

            upgrades: {
                worth: 0,
                time: 0,
                auto: 0,
            }
        }

        this.glowble = {
            amount: new Decimal(0),

            upgrades: {
                bigpop: 0,
                inflatedfall: 0,
            }
        }

        // event currencies

        this.snowflake = {
            amount: new Decimal(0),
            time: 0,
            freezedowntime: 0,

            upgrades: {
                slowfall: 0,
                freezedown: 0
            }
        }

        // currencies over

        this.achievements = [];

        this.items = {
            items: [],
            eqitems: [],

            iron: 0,
            freeItemTime: "20050101"
        }

        this.stats = {
            playTime: 0,
            prestiges: 0,

            // items
            itemsGained: 0,
            itemsUses: 0,
            itemsBroken: 0,

            itemsDaily: 0,
            itemsBought: 0,
            itemsSold: 0,

            totalIron: 0,
            mostIron: 0,

            // currencies
            totalRaindrops: new Decimal(0),
            mostRaindrops: new Decimal(0),
            itemRaindrops: 0,

            totalWatercoins: new Decimal(0),
            mostWatercoins: new Decimal(0),
            itemWatercoins: 0,

            totalRaingold: new Decimal(0),
            mostRaingold: new Decimal(0),
            itemRaingold: 0,

            totalBubbles: new Decimal(0),
            mostBubbles: new Decimal(0),
            itemBubbles: 0,

            totalSnowflakes: new Decimal(0),
            mostSnowflakes: new Decimal(0),
            itemSnowflakes: 0,

            totalGlowbles: new Decimal(0),
            mostGlowbles: new Decimal(0),
            itemGlowbles: 0,
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
            // if (game.raindrop.upgrades.time >= 100 && game.raindrop.upgrades.auto >= 50) sg.startVer = "**1.0**";
        }
        else if (sg.startVer == "") sg.startVer = GAMEVERSION;

        // resetting stuff
        if (!passive) {
            clearFallingItems();
            resetPostPrestige();
        }

        // handling arrays and dicts
        for (let element in sg) {
            if (typeof (this[element]) == "object" && this[element].length == undefined) { // is {}
                for (let element2 in this[element]) {
                    if (typeof (this[element][element2]) == "object") {
                        // {} inside {}, [] inside {} do not need special treatment
                        if (this[element][element2].length == undefined && this[element][element2].mantissa == undefined) sg[element][element2] = Object.assign({}, this[element][element2], sg[element][element2]);
                    } 
                }
                // if it's number/breakinf/whatev inside {}, do it like that
                this[element] = Object.assign({}, this[element], sg[element]);
            }
            else this[element] = sg[element]; // not {}, simply set it. breakinf not supported on this layer
        }

        // break infinity loader
        for (let cur in currencies) {
            this[cur]["amount"] = numberLoader(this[cur]["amount"]);
        }
        for (let cur in this.stats) {
            if (cur.substr(0, 4) == "most" || cur.substr(0, 5) == "total") this.stats[cur] = numberLoader(this.stats[cur]);
            if (cur.substr(0, 4) == "item" && typeof (this.stats[cur]) == "string") this.stats[cur] = this.stats[cur].length > 9 ? 0 : parseInt(this.stats[cur]);
        }

        // items
        if (sg.items != undefined && sg.items.items.length > 0 && sg.items.items[0].rd != undefined) {
            for (let item in sg.items.items) {
                let loadingItem = sg.items.items[item];
                this.items.items[item] = new InventoryItem(loadingItem.id, loadingItem.rd, loadingItem.rw, loadingItem.d, loadingItem.l);
            }
        }
    }
}

var game = new SaveGame();
game.new();

function save() {
    localStorage.setItem("RAINCOL1", saveGame(game));

    if (objects["autoSaveText"] != undefined) {
        objects["autoSaveText"].y = 1;
        objects["autoSaveText"].text = "Game saved!";
    }
    else {
        createText("autoSaveText", 0.95, 1, "", { align: "right", color: "yellow", size: 40 });
    }
}

function saveGame(toSave) {
    let save = structuredClone(toSave);

    // break infinity saver
    for (let cur in currencies) {
        save[cur]["amount"] = numberSaver(save[cur]["amount"]);
    }
    for (let cur in save.stats) {
        if (cur.substr(0, 4) == "most" || cur.substr(0, 5) == "total") save.stats[cur] = numberSaver(save.stats[cur]);
    }
    for (let cur in save) {
        if (save[cur].time != undefined) save[cur].time = parseFloat(save[cur].time.toFixed(2));
    }

    // temporary selection
    if (save.selTemp != "none") {
        save.selCur = save.selTemp;
        save.selTemp = "none";
    }

    // items
    if (save.items.items.length > 0 && save.items.items[0].itemID != undefined) {
        for (let item in save.items.items) {
            save.items.items[item] = {
                id: save.items.items[item].itemID,
                rd: save.items.items[item].randomDurability,
                rw: save.items.items[item].randomWorth,
                d: save.items.items[item].uses,
                l: save.items.items[item].level
            }
        }
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
    catch (e) {
        alert("Error: <br /> " + e);
    }
}

function deleteGame() {
    if (confirm("Are you SURE you want to delete your save?! This cannot be undone!")) {
        if (confirm("Please consider making a backup before this. Are you really sure?!")) {
            if (confirm("If you press Yes one more time, your progress is gone. Maybe don't do that.")) {
                game = new SaveGame();
                game.new();
                game.startVer = GAMEVERSION;
                game.loadFromSaveGame(game);

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