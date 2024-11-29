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
            game.achievements.push(parseInt(achievements[ach].ID));
        }
    }
}

var selectedAchievement = 0;

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

    new Achievement(11, "currencies/raingold", "Golden Shower I", "Gather 100 Raingold!", () => game.raingold.amount.gte(100)),
    new Achievement(12, "currencies/raingold", "Golden Shower II", "Gather 1000 Raingold!", () => game.raingold.amount.gte(1000)),
    new Achievement(13, "currencies/raingold", "Golden Shower III", "Gather 10000 Raingold!", () => game.raingold.amount.gte(10000)),
    new Achievement(14, "currencies/raingold", "Golden Shower IV", "Gather 1e6 Raingold!", () => game.raingold.amount.gte(1e6)),
    new Achievement(15, "currencies/raingold", "Golden Shower V", "Gather 1e9 Raingold!", () => game.raingold.amount.gte(1e9)),

    new Achievement(16, "prestige", "Falling Apart", "Unlock Prestige", () => game.raindrop.amount.gte(10000)),
    new Achievement(17, "prestige", "Golden Honor", "Do your first Prestige!", () => game.stats.prestiges > 0),
    new Achievement(18, "pencil", "No Nobody", "Change your name", () => game.name != ""),
    new Achievement(19, "currencies/raindrop", "Right On Time", "Max. Raindrop Time", () => raindropUpgrades.time.getLevel() == raindropUpgrades.time.getMaxLevel()),
    new Achievement(20, "currencies/raindrop", "Automation", "Max. Raindrop Auto", () => raindropUpgrades.auto.getLevel() == raindropUpgrades.auto.getMaxLevel()),
    new Achievement(21, "achievements", "Early Rain", "Finish the game in v1.0", () => game.startVer == "**1.0**"),
];

scenes["achievements"] = new Scene(
    () => {
        // Init
        createSquare("bgSquare1", 0, 0, 1, 0.9, "black");
        createSquare("bgSquare2", 0, 0.9, 1, 0.1, "darkgray");

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
                    selectedAchievement = x + (y * 5);
                }, { quadratic: true });
                createImage("achbg-" + x + "-" + y, 0 + 0.2 * x, 0.15 + 0.1 * y, 0.09, 0.09, "achbg", { quadratic: true });
            }
        }
    },
    (tick) => {
        // Loop

        // Gain new Achievements
        if (Math.random() > 0.9) checkAchievements(); // feel free to murder me

        // Update total achievement count
        objects["totalCount"].text = game.achievements.length + "/" + achievements.length;
        objects["achBoost"].text = "Boost: " + (game.achievements.length * 2) + "%";

        // Update selected Achievement
        if (selectedAchievement < achievements.length) {
            objects["currentAchievementImg"].image = achievements[selectedAchievement].image;
            objects["currentAchievementImgBg"].image = achievements[selectedAchievement].isUnlocked() ? "achbg" : "locked";
            objects["currentAchievementName"].text = "#" + achievements[selectedAchievement].ID + ": " +  achievements[selectedAchievement].name;
            objects["currentAchievementDesc"].text = achievements[selectedAchievement].description;
            objects["currentAchievementDesc2"].text = achievements[selectedAchievement].isUnlocked() ? "Unlocked" : "Locked";
            objects["currentAchievementDesc2"].color = achievements[selectedAchievement].isUnlocked() ? "green" : "red";
        }

        // Achievement 5x5
        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 5; x++) {
                if (x + (y * 5) > achievements.length - 1) {
                    objects["achbg-" + x + "-" + y].image = "locked";
                    objects["ach-" + x + "-" + y].image = "locked";
                }
                else {
                    objects["achbg-" + x + "-" + y].image = achievements[x + (y * 5)].isUnlocked() ? "achbg" : "locked";
                    objects["ach-" + x + "-" + y].image = achievements[x + (y * 5)].image;
                }
            }
        }
    }
);