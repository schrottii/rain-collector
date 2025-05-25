class Achievement {
    constructor(ID, image, name, description, unlock) {
        this.ID = ID;
        this.image = image;
        this.name = name;
        this.description = description;
        this.unlock = unlock;
    }

    isUnlocked() {
        return game.achievements.includes(this.ID);
    }
}

function checkAchievements() {
    for (let ach in achievements) {
        if (!achievements[ach].isUnlocked() && achievements[ach].unlock() == true) {
            awardAchievement(parseInt(achievements[ach].ID));
        }
    }
}

function getAchievementByID(aid) {
    for (let ach in achievements) {
        if (achievements[ach].ID == aid) return achievements[ach];
    }
}

function awardAchievement(aid) {
    if (!game.achievements.includes(aid)) {
        game.achievements.push(aid);

        if (objects["achievementText"] != undefined) {
            objects["achievementText"].y = 1;
            objects["achievementText"].text = getAchievementByID(aid).name;
        }
        else {
            createText("achievementText", 0.95, 1, getAchievementByID(aid).name, { align: "right", color: "yellow", size: 40 });
        }
    }
}

function killAchievement(aid){
    let ID = -1;

    for (let a in game.achievements){
        if (game.achievements[a] == aid) ID = a;
    }

    if (ID != -1) game.achievements.splice(ID, 1);
}

var selectedAchievement = 0;
var achievementsPage = 0;

const achievements = [
    new Achievement(1, "currencies/raindrop", "Collector I", "Gather 100 Raindrops!", () => game.raindrop.amount.gte(100)),
    new Achievement(2, "currencies/raindrop", "Collector II", "Gather 1000 Raindrops!", () => game.raindrop.amount.gte(1000)),
    new Achievement(3, "currencies/raindrop", "Collector III", "Gather 1e6 Raindrops!", () => game.raindrop.amount.gte(1e6)),
    new Achievement(4, "currencies/raindrop", "Collector IV", "Gather 1e9 Raindrops!", () => game.raindrop.amount.gte(1e9)),
    new Achievement(5, "currencies/raindrop", "Collector V", "Gather 1e12 Raindrops!", () => game.raindrop.amount.gte(1e12)),

    new Achievement(6, "currencies/watercoin", "Money Wash I", "Collect 10 Water Coins! (total)", () => game.stats.totalWatercoins.gte(10)),
    new Achievement(7, "currencies/watercoin", "Money Wash II", "Collect 25 Water Coins! (total)", () => game.stats.totalWatercoins.gte(25)),
    new Achievement(8, "currencies/watercoin", "Money Wash III", "Collect 100 Water Coins! (total)", () => game.stats.totalWatercoins.gte(100)),
    new Achievement(9, "currencies/watercoin", "Money Wash IV", "Collect 250 Water Coins! (total)", () => game.stats.totalWatercoins.gte(250)),
    new Achievement(10, "currencies/watercoin", "Money Wash V", "Collect 1000 Water Coins! (total)", () => game.stats.totalWatercoins.gte(1000)),

    new Achievement(11, "currencies/raingold", "Golden Shower I", "Gather 100 Raingold! " + curUnlock("raingold"), () => game.raingold.amount.gte(100)),
    new Achievement(12, "currencies/raingold", "Golden Shower II", "Gather 1000 Raingold!", () => game.raingold.amount.gte(1000)),
    new Achievement(13, "currencies/raingold", "Golden Shower III", "Gather 10000 Raingold!", () => game.raingold.amount.gte(10000)),
    new Achievement(14, "currencies/raingold", "Golden Shower IV", "Gather 1e6 Raingold!", () => game.raingold.amount.gte(1e6)),
    new Achievement(15, "currencies/raingold", "Golden Shower V", "Gather 1e9 Raingold!", () => game.raingold.amount.gte(1e9)),

    new Achievement(16, "prestige", "Falling Apart", "Unlock Prestige with " + currencies.raingold.unlock[1], () => game.raindrop.amount.gte(currencies.raingold.unlock[1])),
    new Achievement(17, "prestige", "Golden Honor", "Do your first Prestige!", () => game.stats.prestiges > 0),
    new Achievement(18, "pencil", "No Nobody", "Change your name", () => game.name != ""),
    new Achievement(19, "currencies/raindrop", "Right On Time", "Max. Raindrop Time", () => raindropUpgrades.time.getLevel() == raindropUpgrades.time.getMaxLevel()),
    new Achievement(20, "currencies/raindrop", "Automation", "Max. Raindrop Auto", () => raindropUpgrades.auto.getLevel() == raindropUpgrades.auto.getMaxLevel()),
    
    new Achievement(21, "achievements", "Early Rain", "Finish the tutorial", () => game.startVer == "**1.0**"),
    new Achievement(22, "currencies/snowflake", "Gift Collector", "Play during the Christmas Event (December 15th - 28th)", () => isChristmas()),
    new Achievement(23, "currencies/snowflake", "Counter Celsius I", "Gather 100 Snowflakes!", () => game.snowflake.amount.gte(100)),
    new Achievement(24, "currencies/snowflake", "Counter Celsius II", "Gather 1000 Snowflakes!", () => game.snowflake.amount.gte(1000)),
    new Achievement(25, "currencies/snowflake", "Special Snowflake", "Max. a Snowflake Upgrade", () => snowflakeUpgrades.slowfall.isMaxed() || snowflakeUpgrades.freezedown.isMaxed()),

    new Achievement(26, "currencies/bubble", "Colandpop I", "Gather 20 Bubbles! " + curUnlock("bubble"), () => game.bubble.amount.gte(20)),
    new Achievement(27, "currencies/bubble", "Colandpop II", "Gather 400 Bubbles!", () => game.bubble.amount.gte(400)),
    new Achievement(28, "currencies/bubble", "Colandpop III", "Gather 20000 Bubbles!", () => game.bubble.amount.gte(20000)),
    new Achievement(29, "currencies/bubble", "Colandpop IV", "Gather 1e6 Bubbles!", () => game.bubble.amount.gte(1e6)),
    new Achievement(30, "currencies/bubble", "Colandpop V", "Gather 1e8 Bubbles!", () => game.bubble.amount.gte(1e8)),

    new Achievement(31, "currencies/glowble", "The Great Low I", "Gather 100 Glowbles! " + curUnlock("glowble"), () => game.glowble.amount.gte(100)),
    new Achievement(32, "currencies/glowble", "The Great Low II", "Gather 4000 Glowbles!", () => game.glowble.amount.gte(4000)),
    new Achievement(33, "currencies/glowble", "The Great Low III", "Gather 64000 Glowbles!", () => game.glowble.amount.gte(64000)),
    new Achievement(34, "currencies/glowble", "The Great Low IV", "Gather 1e6 Glowbles!", () => game.glowble.amount.gte(1e6)),
    new Achievement(35, "currencies/glowble", "The Great Low V", "Gather 1e9 Glowbles!", () => game.glowble.amount.gte(1e9)),

    new Achievement(36, "items/sword", "I (Boost) Them", "Unlock Items (1000 total Glowbles)", () => unlockedItems()),
    new Achievement(37, "items/barrel", "Item Collector I", "Get 10 Items (total)", () => game.stats.itemsGained >= 10),
    new Achievement(38, "items/barrel", "Item Collector II", "Get 25 Items (total)", () => game.stats.itemsGained >= 25),
    new Achievement(39, "items/barrel", "Item Collector III", "Get 100 Items (total)", () => game.stats.itemsGained >= 100),
    new Achievement(40, "items/barrel", "Item Collector IV", "Get 900 Items (total)", () => game.stats.itemsGained >= 900),

    new Achievement(41, "items/sword", "No Warranty", "Break an Item", () => game.stats.itemsBroken >= 1),
    new Achievement(42, "items/sword", "Taking the Trash Out", "Sell an Item", () => game.stats.itemsSold >= 1),
    new Achievement(43, "items/lantern", "Merchant I", "Buy an Item for Iron", () => game.stats.itemsBought >= 1),
    new Achievement(44, "items/lantern", "Merchant II", "Buy 10 Items for Iron", () => game.stats.itemsBought >= 10),
    new Achievement(45, "items/lantern", "Merchant III", "Buy 25 Items for Iron", () => game.stats.itemsBought >= 25),

    new Achievement(46, "currencies/iron", "Heavy Metal I", "Get your first Iron! " + curUnlock("iron"), () => game.stats.totalIron >= 1),
    new Achievement(47, "currencies/iron", "Heavy Metal II", "Gather 26 Iron!", () => game.stats.totalIron >= 26),
    new Achievement(48, "currencies/iron", "Heavy Metal III", "Gather 100 Iron!", () => game.stats.totalIron >= 100),
    new Achievement(49, "currencies/iron", "Heavy Metal IV", "Gather 500 Iron!", () => game.stats.totalIron >= 500),
    new Achievement(50, "currencies/iron", "Heavy Metal V", "Gather 2600 Iron!", () => game.stats.totalIron >= 2600),

    new Achievement(51, "egg", "Egg Collector", "Play during the Easter Event (April 15th - 28th)", () => isEaster()),
    new Achievement(52, "egg", "Egg Hunt I", "Find 5 Eggs!", () => game.stats.eggs >= 5),
    new Achievement(53, "egg", "Egg Hunt II", "Find 50 Eggs!", () => game.stats.eggs >= 50),
    new Achievement(54, "egg", "Egg Hunt III", "Find 500 Eggs!", () => game.stats.eggs >= 500),
    new Achievement(55, "egg2", "I'll Save You, Little One", "Find an Egg while Thunder strikes", () => false),

    new Achievement(56, "currencies/muddrop", "Muddy Fingers I", "Gather 15 Muddrops! " + curUnlock("muddrop"), () => game.muddrop.amount.gte(15)),
    new Achievement(57, "currencies/muddrop", "Muddy Fingers II", "Gather 500 Muddrops!", () => game.muddrop.amount.gte(500)),
    new Achievement(58, "currencies/muddrop", "Muddy Fingers III", "Gather 25000 Muddrops!", () => game.muddrop.amount.gte(25000)),
    new Achievement(59, "currencies/muddrop", "Muddy Fingers IV", "Gather 5e5 Muddrops!", () => game.muddrop.amount.gte(5e5)),
    new Achievement(60, "currencies/muddrop", "Muddy Fingers V", "Gather 5e7 Muddrops!", () => game.muddrop.amount.gte(5e7)),

];

scenes["achievements"] = new Scene(
    () => {
        // Init
        checkAchievements();



        createSquare("bgSquare1", 0, 0, 1, 0.9, "black");
        if (game.settings.bg) createImage("bgSquare2", 0, 0, 1, 0.9, "bgSettings");

        createText("header", 0.5, 0.06, "Achievements", { size: 60, color: "white" });

        createText("totalCount", 0.5, 0.1, "0/0", { size: 40, color: "white" });
        createText("achBoost", 0.5, 0.14, "Boost: +0% Raingold", { size: 40, color: "white" });

        // Buttons
        createButton("sceneButton1", 0, 0.9, 1 / 3, 0.1, "button", () => { loadScene("stats") });
        createButton("sceneButton2", 0 + 1 / 3, 0.9, 1 / 3, 0.1, "button", () => { loadScene("settings") });
        createButton("sceneButton3", 0 + 1 / 3 * 2, 0.9, 1 / 3, 0.1, "button", () => { loadScene("mainmenu") });

        createImage("sceneImage1", 1 / 6, 0.91, 0.08, 0.08, "stats", { quadratic: true, centered: true });
        createImage("sceneImage2", 1 / 6 * 3, 0.91, 0.08, 0.08, "settings", { quadratic: true, centered: true });
        createImage("sceneImage3", 1 / 6 * 5, 0.91, 0.08, 0.08, "back", { quadratic: true, centered: true });

        // Current Achievement selected
        createSquare("currentAchievementBg", 0, 0.7, 1, 0.15, "white");
        createImage("currentAchievementImgBg", 0, 0.7, 0.15, 0.15, "locked", { quadratic: true });
        createImage("currentAchievementImg", 0, 0.7, 0.15, 0.15, "back", { quadratic: true });
        createText("currentAchievementName", 0.95, 0.74, "", { align: "right", size: 40 });
        createText("currentAchievementDesc", 0.95, 0.775, "", { align: "right", size: 24 });
        createText("currentAchievementDesc2", 0.95, 0.84, "", { align: "right", size: 40, color: "red" });

        // Achievements
        createSquare("AchievementsBg", 0, 0.15, 1, 0.5, "darkgray");
        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 5; x++) {
                createButton("ach-" + x + "-" + y, 0 + 0.2 * x, 0.15 + 0.1 * y, 0.09, 0.09, "locked", () => {
                    selectedAchievement = x + (y * 5) + (achievementsPage * 25);
                }, { quadratic: true });
                createImage("achbg-" + x + "-" + y, 0 + 0.2 * x, 0.15 + 0.1 * y, 0.09, 0.09, "achbg", { quadratic: true });
            }
        }

        // Page Buttons
        createButton("pageButtonL", 0, 0.1, 0.15, 0.05, "button", () => {
            if (achievementsPage > 0) achievementsPage--;
        });
        createText("pblt", 0.0775, 0.15, "<", { size: 40, noScaling: true });
        createButton("pageButtonR", 0.85, 0.1, 0.15, 0.05, "button", () => {
            if (achievementsPage < Math.ceil(achievements.length / 25) - 1) achievementsPage++;
        });
        createText("pbrt", 0.9275, 0.15, ">", { size: 40, noScaling: true });
    },
    (tick) => {
        // Loop

        // Update total achievement count
        objects["totalCount"].text = game.achievements.length + "/" + achievements.length;
        objects["achBoost"].text = "Boost: " + (game.achievements.length * 2) + "% " + (cc().getPrestigeCurrency() != undefined ? cc().getPrestigeCurrency().renderName(true) : "");

        // Update selected Achievement
        if (selectedAchievement < achievements.length) {
            objects["currentAchievementImg"].image = achievements[selectedAchievement].image;
            objects["currentAchievementImgBg"].image = achievements[selectedAchievement].isUnlocked() ? "achbg" : "locked";
            objects["currentAchievementName"].text = "#" + achievements[selectedAchievement].ID + ": " +  achievements[selectedAchievement].name;
            objects["currentAchievementDesc"].text = achievements[selectedAchievement].description;
            objects["currentAchievementDesc2"].text = achievements[selectedAchievement].isUnlocked() ? "Unlocked" : "Locked";
            objects["currentAchievementDesc2"].color = achievements[selectedAchievement].isUnlocked() ? "green" : "red";
        }

        // Show/hide page buttons
        if (achievementsPage <= 0) objects["pageButtonL"].power = objects["pblt"].power = false;
        else objects["pageButtonL"].power = objects["pblt"].power = true;

        if (achievementsPage >= Math.ceil(achievements.length / 25) - 1) objects["pageButtonR"].power = objects["pbrt"].power = false;
        else objects["pageButtonR"].power = objects["pbrt"].power = true;
        

        // Achievement 5x5
        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 5; x++) {
                if (x + (y * 5) + (achievementsPage * 25) > achievements.length - 1) {
                    objects["achbg-" + x + "-" + y].image = "locked";
                    objects["ach-" + x + "-" + y].image = "locked";
                }
                else {
                    objects["achbg-" + x + "-" + y].image = achievements[x + (y * 5) + (achievementsPage * 25)].isUnlocked() ? "achbg" : "locked";
                    objects["ach-" + x + "-" + y].image = achievements[x + (y * 5) + (achievementsPage * 25)].image;
                }
            }
        }
    }
);