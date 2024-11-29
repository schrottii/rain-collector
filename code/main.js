// game made by schrottii, do not steal/copy bla bla bla

const GAMEVERSION = "1.2";

images = {
    button: "button.png",
    achbg: "cool-outline.png",
    locked: "locked.png",
    bg: "bg.png",
    bg2: "bg2.png",

    back: "back.png",
    upgrades: "upgrades.png",
    prestige: "prestige.png",
    stats: "stats.png",
    settings: "settings.png",
    achievements: "achievements.png",

    pencil: "pencil.png",
    music: "music.png",
    musicoff: "music-off.png",
    background: "background.png",
    backgroundoff: "backgroundoff.png",
    notation: "notation.png",
    notationoff: "notationoff.png",

    collected: "collected.png",
    collected2: "collected2.png",

    "currencies/raindrop": "currencies/raindrop.png",
    "currencies/watercoin": "currencies/watercoin.png",
    "currencies/raingold": "currencies/raingold.png",
}
GAMENAME = "Rain Collector";
FONT = "Quicksand";
wggjLoadImages();
wggjLoop();

function loadedScene() {
    wggjCTX.fillStyle = "darkblue";
    wggjCTX.fillRect(0, 0, wggjCanvasWidth, wggjCanvasHeight);

    wggjCTX.fillStyle = "white";
    wggjCTX.textBaseline = "bottom";
    wggjCTX.textAlign = "center";

    wggjCTX.font = "60px " + FONT;
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

// Notations
const upgradeColors = ["normal", "old", "custom"]
const notations = ["normal", "scientific", "engineering", "alphabet"];
const normalNotation = ["M", "B", "T", "q", "Q", "s", "S", "O", "N", "D", "UD", "DD", "TD", "qD", "QD", "sD", "SD", "OD", "ND", "V", "sV", "Tr", "UTR", "QU", "TQU", "qu", "Se", "Sp", "Oc", "No", "Améliorer", "What?!?!", "What?!?!2", "You Broke The Game", "I am crying", "no!!!", "WhyDoesFranceStillExist", "GodIsWatchingYou"];
const alphabetNotation = "a b c d e f g h i j k l m n o p q r s t u v w x y z A B C D E F G H I J K L M N O P Q R S T U V W X Y Z".split(" ")

let pre =
{
    start: ["", "K", "M", "B"],
    ones: ["", "U", "D", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "N"],
    tens: ["", "Dc", "Vg", "Tg", "Qag", "Qig", "Sxg", "Spg", "Og", "Ng"],
    hundreds: ["", "Ct", "DCt", "TCt", "QaCt", "QiCt", "SxCt", "SpCt", "OcCt", "NCt"],
    thousands: ["", "M", "DM", "TM", "qM", "QM", "sM", "SM", "OM", "NM"]
};

function fn(number) {
    if (number == undefined) return "?";

    // return basic number if it is 0 - 999 999
    if (number < 1000000) return (number < 100) ? ((number * 1).toFixed(2).substr((number * 1).toFixed(2).length - 2, 2) == "00" ? (number * 1).toFixed(2).split(".")[0] : (number * 1).toFixed(2)) : (number * 1).toFixed(0);

    // 1 million or more? do notation
    let notationSymbol = ""; // M, :joy:, etc.

    // Breakinfinity numbers
    if (number.mantissa == undefined) {
        number = new Decimal(number);
    }

    switch (game.settings.notation) {
        case "normal": // 1M, 10M
            //notationSymbol = normalNotation[Math.floor(number.exponent / 3) - 2];

            let m = (number.mantissa * Math.pow(10, number.exponent % 3)).toFixed(2);

            if (number.lt(1e12)) {
                return m + " " + pre.start[Math.floor(number.exponent / 3)];
            }
            if (number.gt(1e303)) {
                return m + " ???";
            }

            let newE = number.exponent - 3;
            let thousand = Math.floor(newE / 3000) < 10 ? pre.thousands[Math.floor(newE / 3000)] : "[" + formatNumber(Math.floor(newE / 3000)) + "]M";
            return m + " " + thousand +
                pre.hundreds[Math.floor(newE / 300) % pre.hundreds.length] +
                pre.ones[Math.floor(newE / 3) % pre.ones.length] +
                pre.tens[Math.floor(newE / 30) % pre.tens.length];
            break;

        case "scientific": // special case: 1e6, 1e7
            return number.mantissa.toString().substr(0, 4) + "e" + number.exponent.toString();
            break;
        case "engineering": // special case: 1E6, 10E6
            return (number.mantissa * Math.pow(10, number.exponent.toString() % 3)).toString().substr(0, 4) + "E" + (Math.floor(number.exponent.toString() / 3) * 3);
            break;
        case "alphabet": // 1a, 10a
            notationSymbol = alphabetNotation[Math.floor(number.exponent / 3) - 2];
            break;
    }

    let numberDisplay = (number.mantissa * (Math.pow(10, number.exponent % 3))).toString().substr(0, 4);
    if (numberDisplay.substr(2, 4) == "00") numberDisplay = numberDisplay.substr(0, 2);
    if (numberDisplay.substr(-1) == ".") numberDisplay = numberDisplay.split(".")[0];

    return numberDisplay + notationSymbol;

}

/*
function statIncrease(name, number) {
    if (game.stats[name].mantissa != undefined) {
        if (isNaN(game.stats_prestige[name])) game.stats_prestige[name] = new Decimal(0);
        if (isNaN(game.stats_today[name])) game.stats_today[name] = new Decimal(0);

        game.stats[name] = game.stats[name].add(number);
        game.stats_prestige[name] = game.stats_prestige[name].add(number);
        game.stats_today[name] = game.stats_today[name].add(number);
    }
    else {
        if (isNaN(game.stats_prestige[name])) game.stats_prestige[name] = 0;
        if (isNaN(game.stats_today[name])) game.stats_today[name] = 0;

        game.stats[name] += number;
        game.stats_prestige[name] += number;
        game.stats_today[name] += number;
    }
}


var statCurr = ["shgabb", "sw", "gs", "si", "cop", "fishvalue"];
var statTypes = ["stats", "stats_prestige", "stats_today"];
*/

function numberSaver(number) {
    if (number == undefined) number = 0;
    // turn a break infinity object (mantissa - exponent) into a simple string, for saving
    // mantissa: 1.2, exponent: 10 -> 1.2e10
    if (number.mantissa == undefined) {
        if (number.toString().split("e+")[1] != undefined) {
            number = new Decimal(number.toString().split("e+")[0] + "e" + Math.floor(number.toString().split("e+")[1]));
        }
        else {
            number = new Decimal(number);
        }
    }
    return "" + number.mantissa + "e" + number.exponent;
}

function numberLoader(number) {
    // same thing but load the saved string
    // 1.2e10 -> mantissa: 1.2, exponent: 10
    return new Decimal("" + number);
}