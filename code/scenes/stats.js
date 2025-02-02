var statDisplays = {
    playTime: ["Play Time", (stat) => Math.floor(stat / 1000 / 60 / 60) + " hours " + Math.floor(stat / 1000 / 60 % 60) + " minutes"],
    prestiges: ["Prestiges"],
    itemsGained: ["Items Gained"],
    itemsUses: ["Items Used"],
    itemsBroken: ["Items Broken"],
    itemsDaily: ["Daily Items"],
    itemsBought: ["Bought Items"],
    itemsSold: ["Sold Items"],
    totalIron: ["Total Iron"],
    mostIron: ["Most Iron"],

    totalRaindrops: ["Total Raindrops"],
    mostRaindrops: ["Most Raindrops"],
    itemRaindrops: ["Raindrops Collected"],

    totalWatercoins: ["Total Watercoins"],
    mostWatercoins: ["Most Watercoins"],
    itemWatercoins: ["Watercoins Collected"],

    totalRaingold: ["Total Raingold"],
    mostRaingold: ["Most Raingold"],
    itemRaingold: ["Raingold Collected"],

    totalBubbles: ["Total Bubbles"],
    mostBubbles: ["Most Bubbles"],
    itemBubbles: ["Bubbles Collected"],

    totalSnowflakes: ["Total Snowflakes"],
    mostSnowflakes: ["Most Snowflakes"],
    itemSnowflakes: ["Snowflakes Collected"],

    totalGlowbles: ["Total Glowbles"],
    mostGlowbles: ["Most Glowbles"],
    itemGlowbles: ["Glowbles Collected"],
}

scenes["stats"] = new Scene(
    () => {
        // Init
        createSquare("bgSquare1", 0, 0, 1, 0.9, "black");
        if (game.settings.bg) createImage("bgSquare2", 0, 0, 1, 0.9, "bgSettings");

        createContainer("statsContainer", 0.1, 0.15, 0.8, 0.6, {
            color: "black", YScroll: true, YLimit: [0.0000000001, 1]
        }, []);

        createText("header", 0.5, 0.06, "Stats", { size: 60, color: "white" });
        createText("userName", 0.5, 0.1, "", { size: 48, color: "white" });
        createText("userID", 1, 0.1, "", { size: 30, color: "white", align: "right" });

        // Buttons
        createButton("sceneButton1", 0, 0.9, 1 / 3, 0.1, "button", () => { loadScene("achievements") });
        createButton("sceneButton2", 0 + 1 / 3, 0.9, 1 / 3, 0.1, "button", () => { loadScene("settings") });
        createButton("sceneButton3", 0 + 1 / 3 * 2, 0.9, 1 / 3, 0.1, "button", () => { loadScene("mainmenu") });

        createImage("sceneImage1", 1 / 6, 0.91, 0.08, 0.08, "achievements", { quadratic: true, centered: true });
        createImage("sceneImage2", 1 / 6 * 3, 0.91, 0.08, 0.08, "settings", { quadratic: true, centered: true });
        createImage("sceneImage3", 1 / 6 * 5, 0.91, 0.08, 0.08, "back", { quadratic: true, centered: true });

        createButton("patchnotesButton", 0.3, 0.775, 0.4, 0.1, "button", () => { loadScene("patchnotes") });
        createText("patchnotesText", 0.5, 0.8375, "Patch notes", { size: 40 });

        // DYNAMIC Stats
        let statCount = 0;
        let statSize = 0.032;

        for (statCount = 0; statCount < Object.keys(game.stats).length; statCount++) {
            createText("stat" + statCount, 0.115, 0.2 + statSize * statCount, "...", { align: "left", size: isMobile() ? 40 : 24, color: "white" });
            objects["statsContainer"].children.push("stat" + statCount);
        }
        objects["statsContainer"].YLimit[1] = statSize * statCount - (0.6 - statSize * 2);
    },
    (tick) => {
        // Loop
        objects["userName"].text = game.name;
        objects["userID"].text = "(ID: " + game.id.substr(0, 6) + ") ";

        let thisStat;
        for (let statCount = 0; statCount < Object.keys(game.stats).length; statCount++) {
            thisStat = Object.keys(game.stats)[statCount];
            objects["stat" + statCount].text = statDisplays[thisStat][0] + ": " + (statDisplays[thisStat].length == 1 ? fn(game.stats[thisStat]) : statDisplays[thisStat][1](game.stats[thisStat]));
        }
    }
);