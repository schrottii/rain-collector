var amountBefore = 0;
const ITEM_LIMIT = 128;

function leaveMainMenu() {
    for (let i = 1; i <= ITEM_LIMIT; i++) {
        fallingItems["drop" + i] = objects["drop" + i];
    }
}

function collectItem(i, isAuto = false) {
    if (fallingItems["drop" + i].power == false) return false;
    fallingItems["drop" + i].power = "hold";

    if (!isAuto && Math.random() * 100 < snowflakeUpgrades.freezedown.getEffect()) game.snowflake.freezedowntime = 0;

    if (objects["collected"] != undefined) {
        if (isAuto == true) {
            objects["collected2"].power = true;
            objects["collected2"].x = fallingItems["drop" + i].x;
            objects["collected2"].y = fallingItems["drop" + i].y;
            objects["collected2"].timer = 0.25;
            objects["collected2"].image = "autocollected";
        }
        else {
            objects["collected"].power = true;
            objects["collected"].x = fallingItems["drop" + i].x;
            objects["collected"].y = fallingItems["drop" + i].y;
            objects["collected"].timer = 0.25;
            objects["collected"].image = "collected";
        }
    }

    if (!isAuto && watercoinUpgrades.economicbubble.getLevel() > 0) {
        economicBubbleBoost += 1;
        if (Math.random() <= 0.1) economicBubbleBoost = 0;
    }

    if (!isAuto && getItemCur(i).name == "bubble" && watercoinUpgrades.coinpop.getLevel() > 0 && Math.random() * 100 <= watercoinUpgrades.coinpop.getEffect()) {
        setTimeout((x = fallingItems["drop" + i].x, y = fallingItems["drop" + i].y - 0.1) => {
            let spawnedCoin = createFallingItem("watercoin");
            fallingItems["drop" + spawnedCoin].x = x;
            fallingItems["drop" + spawnedCoin].y = y;
        }, 250);
    }

    if (unlockedItems() && Math.random() > 0.999) {
        createFallingItem("iron");
    }

    amountBefore = getItemCur(i).getAmount();
    getItemCur(i).onCollect(fallingItems["drop" + i]);
    if (objects["latestGain"] != undefined) objects["latestGain"].text = "+" + fn(getItemCur(i).getAmount().sub(amountBefore));

    fallingItems["drop" + i].power = false; // don't do it until now, because otherwise it might get replaced mid-stuff
}

scenes["mainmenu"] = new Scene(
    () => {
        // Init
        createSquare("bgSquare1", 0, 0, 1, 0.9, "black");
        if (game.settings.bg) createImage("bgSquare2", 0, 0, 1, 0.9, "bg");

        createSquare("autoCollectHeight", 0, 0.15, 1, 0.003, "white");

        for (let i = 1; i <= ITEM_LIMIT; i++) {
            createButton("drop" + i, -10, -10, 0.1, 0.1, "currencies/raindrop", () => {

            }, { power: false, quadratic: true, centered: true, onHover: () => { collectItem(i, false) } });
            objects["drop" + i].power = false;

            if (fallingItems["drop" + i] == undefined) {
                // generated them for the first time
                fallingItems["drop" + i] = objects["drop" + i];
            }
            else {
                // load from the fallingItems
                objects["drop" + i] = fallingItems["drop" + i];
            }
        }

        createImage("bgSquare4", 0, 0, 1, 1, "bg2");

        createImage("collected", -10, -10, 0.1, 0.1, "collected", { quadratic: true, centered: true, power: false });
        objects["collected"].timer = 0;
        createImage("collected2", -10, -10, 0.1, 0.1, "autocollected", { quadratic: true, centered: true, power: false });
        objects["collected2"].timer = 0;

        // Bottom Buttons
        createButton("sceneButton1", 0, 0.9, 1 / 4, 0.1, "button", () => {
            viewUpgrades = game.selCur;
            leaveMainMenu();
            loadScene("upgrading");
        });
        createImage("sceneImage1", 0.5 / 4, 0.91, 0.08, 0.08, "upgrades", { quadratic: true, centered: true });

        createButton("sceneButton2", 0 + 1 / 4, 0.9, 1 / 4, 0.1, "button", () => {
            if (cc().getPrestigeCurrency() == undefined) notification_Alert("Not available", "There is no prestige for this currency!");
            else if (cc().getPrestigeCurrency().isUnlocked() || cc().getPrestigeCurrency().getAmount().gt(0)) {
                leaveMainMenu();
                loadScene("prestige");
            }
            else notification_Alert("Locked", "Collect more " + cc().renderName(true) + " to unlock! (" + cc().getAmount() + "/" + cc().getPrestigeCurrency().unlock[1] + ")", "currencies/" + cc().image);
        });
        createImage("sceneImage2", 0.5 / 4 * 3, 0.91, 0.08, 0.08, "prestige", { quadratic: true, centered: true });
        createImage("sceneButton2locked", 0 + 1 / 4, 0.9, 1 / 4, 0.1, "locked", { power: false });

        createButton("sceneButton3", 0 + 1 / 4 * 2, 0.9, 1 / 4, 0.1, "button", () => {
            if (!unlockedItems()) notification_Alert("Locked", "Unlocked at 1000 total Glowbles!", "currencies/glowble");
            else {
                leaveMainMenu();
                loadScene("itemselection");
            }
        });
        createImage("sceneImage3", 0.5 / 4 * 5, 0.91, 0.08, 0.08, "items/sword", { quadratic: true, centered: true });
        createImage("sceneButton3locked", 0 + 1 / 4 * 2, 0.9, 1 / 4, 0.1, "locked", { power: false });

        createButton("sceneButton4", 0 + 1 / 4 * 3, 0.9, 1 / 4, 0.1, "button", () => {
            leaveMainMenu();
            loadScene("stats");
        });
        createImage("sceneImage4", 0.5 / 4 * 7, 0.91, 0.08, 0.08, "stats", { quadratic: true, centered: true });

        // Side button
        createButton("currencySelectionButton", 0.825, 0.8, 0.15, 0.05, "button", () => {
            leaveMainMenu();
            loadScene("currencyselection");
        });
        createImage("currencySelectionButtonImg", 0.9, 0.8, 0.05, 0.05, "switch", { quadratic: true, centered: true });
        objects["currencySelectionButton"].power = false;
        objects["currencySelectionButtonImg"].power = false;

        // Currency display
        createSquare("currency1", 0.2, 0.775, 0.6, 0.1, "#560000");
        createImage("currency2", 0.25, 0.775, 0.1, 0.1, "currencies/raindrop", { quadratic: true, centered: true });
        createText("currencyDisplay", 0.775, 0.775 + 0.1 * 0.66, "", { color: "#F78A8A", size: 64, align: "right" });

        createText("latestGain", 0.775, 0.7 + 0.1 * 0.66, "", { color: "white", size: 40, align: "right" });

        // Water Coin
        createSquare("waterFillBg", 0, 0.875, 1, 0.025, "black");
        createSquare("waterFill", 0, 0.875, 0, 0.025, "#02F8FD");
        createImage("currency3", 0.05, 0.875, 0.025, 0.025, "currencies/watercoin", { quadratic: true, centered: true });
        createText("currencyDisplay2", 0.1, 0.9025, "", { color: "blue", size: 32, align: "left", noScaling: true });

        // Top / Weather
        createSquare("topBG", 0, 0, 1, 0.05, "#560000");
        createText("header", 0.975, 0.025, "Rain Collector", { size: 30, color: "white", align: "right" });
        createText("header2", 0.975, 0.045, "v"
            + GAMEVERSION
            + (isChristmas() ? " (Christmas)" : "")
            + (isEaster() ? " (Easter)" : "")
            , { size: 30, color: "white", align: "right" });

        createButton("weatherDisplay", 0, 0, 0.05, 0.05, "weather-thunder", () => {
            notification_Alert("Weather: " + weathers[currentWeather].displayName,
                "x" + weathers[currentWeather].worthMulti + " worth, "
                + "x" + weathers[currentWeather].fallSpeedMulti + " fall speed, "
                + "x" + weathers[currentWeather].spawnRateMulti + " spawn rate");
        }, { quadratic: true });
        createText("weatherText", 0.12, 0.025, "Weather: Thunder", { size: 30, color: "white", align: "left" });
        createSquare("weatherBarBG", 0.12, 0.03, 0.28, 0.02, "black");
        createSquare("weatherBarFill", 0.12, 0.03, 0.28, 0.02, "lightblue");

        createImage("thunderStrike", 0.5, 0.05, 0.2, 0.6, "thunder", { quadratic: true, centered: true });
        objects["thunderStrike"].power = false;

        // Music
        wggjAudio.src = "audio/lofi-relax-music-lofium-123264.mp3";
        wggjAudio.volume = 0.2; // I prefer having the volume a bit down
        if (game.settings.music) wggjAudio.play();

        save();
    },
    (tick) => {
        // Loop
        for (let i = 1; i <= ITEM_LIMIT; i++) {
            objects["drop" + i].power = fallingItems["drop" + i].power;
            if (fallingItems["drop" + i].power) {
                objects["drop" + i].x = fallingItems["drop" + i].x;
                objects["drop" + i].y = fallingItems["drop" + i].y;
                objects["drop" + i].w = fallingItems["drop" + i].w;
                objects["drop" + i].h = fallingItems["drop" + i].h;
            }
        }

        // Adjust display depending on mobile or pc
        if (isMobile()) {
            // Mobile
            objects["currency1"].x = 0.2;
            objects["currency1"].w = 0.6;
            objects["currency2"].x = 0.25;

            objects["currencyDisplay"].x = 0.775;
        }
        else {
            // PC
            objects["currency1"].x = 0.4;
            objects["currency1"].w = 0.2;
            objects["currency2"].x = 0.4;

            objects["currencyDisplay"].x = 0.5775;
        }

        // Currency displays
        objects["currencyDisplay"].text = fn(cc().getAmount());
        objects["currency2"].image = "currencies/" + cc().image;

        objects["currencyDisplay2"].text = fn(game.watercoin.amount);

        objects["sceneButton2locked"].power = !(cc().getPrestigeCurrency() != undefined && cc().getPrestigeCurrency().isUnlocked());
        objects["sceneButton3locked"].power = !(unlockedItems());

        // Collect animations
        objects["collected"].timer -= tick;
        if (objects["collected"].timer < 0.125) objects["collected"].image = "collected2";
        if (objects["collected"].timer < 0) {
            objects["collected"].timer = 0;
            objects["collected"].x = -10;
            objects["collected"].y = -10;
        }
        objects["collected2"].timer -= tick;
        if (objects["collected2"].timer < 0.125) objects["collected2"].image = "autocollected2";
        if (objects["collected2"].timer < 0) {
            objects["collected2"].timer = 0;
            objects["collected2"].x = -10;
            objects["collected2"].y = -10;
        }

        // handle generation of prestige currency, it is here so the player doesn't miss it
        if (postPrestige.amount > 0) {
            if (gc().time >= 0.5) {
                gc().time = 0;
                postPrestige.amount -= 1;

                createFallingItem(postPrestige.type);
            }
        }

        if (/*currencies.bubble.isUnlocked()*/ game.stats.totalRaingold >= 500) {
            objects["currencySelectionButton"].power = true;
            objects["currencySelectionButtonImg"].power = true;
        }

        objects["waterFill"].w = Math.min(1, game.watercoin.fill / game.watercoin.fillNeeded);
    }
);