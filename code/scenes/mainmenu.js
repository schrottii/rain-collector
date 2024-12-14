const ITEM_LIMIT = 128;

function collectItem(i, isAuto = false) {
    if (objects["drop" + i].power == false) return false;
    objects["drop" + i].power = false;

    if (!isAuto && Math.random() * 100 < snowflakeUpgrades.freezedown.getEffect()) game.snowflake.freezedowntime = 0;

    if (isAuto == true) {
        objects["collected2"].power = true;
        objects["collected2"].x = objects["drop" + i].x;
        objects["collected2"].y = objects["drop" + i].y;
        objects["collected2"].timer = 0.25;
    }
    else {
        objects["collected"].power = true;
        objects["collected"].x = objects["drop" + i].x;
        objects["collected"].y = objects["drop" + i].y;
        objects["collected"].timer = 0.25;
    }

    getItemCur(i).onCollect(objects["drop" + i]);
}

scenes["mainmenu"] = new Scene(
    () => {
        // Init
        createSquare("bgSquare1", 0, 0, 1, 0.9, "black");
        if (game.settings.bg) createImage("bgSquare2", 0, 0, 1, 0.9, "bg");
        createSquare("bgSquare3", 0, 0.9, 1, 0.1, "darkgray");

        createSquare("autoCollectHeight", 0, 0.15, 1, 0.003, "white");

        createText("header", 0.5, 0.06, "Rain Collector v" + GAMEVERSION, { size: 60, color: "white" });

        for (let i = 1; i <= ITEM_LIMIT; i++) {
            createButton("drop" + i, -10, -10, 0.1, 0.1, "currencies/raindrop", (isAuto = false) => {
                collectItem(i, isAuto);
            }, { power: false, quadratic: true, centered: true, onHold: () => { collectItem(i, false) } });
            objects["drop" + i].power = false;
        }

        createImage("bgSquare4", 0, 0, 1, 1, "bg2");

        createImage("collected", -10, -10, 0.1, 0.1, "collected", { quadratic: true, centered: true, power: false });
        objects["collected"].timer = 0;
        createImage("collected2", -10, -10, 0.1, 0.1, "collected2", { quadratic: true, centered: true, power: false });
        objects["collected2"].timer = 0;

        // Buttons
        createButton("sceneButton1", 0, 0.9, 1 / 3, 0.1, "button", () => { loadScene("upgrading") });
        createButton("sceneButton2", 0 + 1 / 3, 0.9, 1 / 3, 0.1, "button", () => { game.selCur == "raindrop" ? game.raindrop.amount < 1e4 && game.raingold.amount < 1 ? alert("Unlocked at 10 000 Raindrops!") : loadScene("prestige") : alert("Currently only available for Raindrops!") });
        createButton("sceneButton3", 0 + 1 / 3 * 2, 0.9, 1 / 3, 0.1, "button", () => { loadScene("stats") });

        createImage("sceneImage1", 1 / 6, 0.91, 0.08, 0.08, "upgrades", { quadratic: true, centered: true });
        createImage("sceneImage2", 1 / 6 * 3, 0.91, 0.08, 0.08, "prestige", { quadratic: true, centered: true });
        createImage("sceneImage3", 1 / 6 * 5, 0.91, 0.08, 0.08, "stats", { quadratic: true, centered: true });

        createButton("currencySelectionButton", 0.825, 0.8, 0.15, 0.05, "button", () => { loadScene("currencyselection") });
        createImage("currencySelectionButtonImg", 0.9, 0.8, 0.05, 0.05, "switch", { quadratic: true, centered: true });
        objects["currencySelectionButton"].power = false;
        objects["currencySelectionButtonImg"].power = false;

        // Currency display
        createSquare("currency1", 0.2, 0.775, 0.6, 0.1, "#560000");
        createImage("currency2", 0.25, 0.775, 0.1, 0.1, "currencies/raindrop", { quadratic: true, centered: true });
        createText("currencyDisplay", 0.775, 0.775 + 0.1 * 0.66, "", { color: "#F78A8A", size: 64, align: "right" });

        // Water Coin
        createSquare("waterFillBg", 0, 0.875, 1, 0.03, "black");
        createSquare("waterFill", 0, 0.875, 0, 0.03, "#02F8FD");
        createImage("currency3", 0.05, 0.875, 0.03, 0.03, "currencies/watercoin", { quadratic: true, centered: true });
        createText("currencyDisplay2", 0.1, 0.875 + 0.05 * 0.66, "", { color: "black", size: 64, align: "left" });

        // Music
        wggjAudio.src = "audio/lofi-relax-music-lofium-123264.mp3";
        wggjAudio.volume = 0.2; // I prefer having the volume a bit down
        if (game.settings.music) wggjAudio.play();

        save();
    },
    (tick) => {
        // Loop
        if (isMobile()) {
            // Mobile
            objects["currency1"].x = 0.2;
            objects["currency1"].w = 0.6;
            objects["currency2"].x = 0.25;

            objects["currencyDisplay"].x = 0.775;
            objects["currencyDisplay"].size = 64;
        }
        else {
            // PC
            objects["currency1"].x = 0.4;
            objects["currency1"].w = 0.2;
            objects["currency2"].x = 0.4;

            objects["currencyDisplay"].x = 0.5775;
            objects["currencyDisplay"].size = 43;
        }

        // Currency displays
        objects["currencyDisplay"].text = fn(cc().getAmount());
        objects["currency2"].image = "currencies/" + cc().image;

        objects["currencyDisplay2"].text = fn(game.watercoin.amount);

        // Render falling drops
        gc().time += tick;
        game.watercoin.time += tick;

        // Collect animations
        objects["collected"].timer -= tick;
        if (objects["collected"].timer < 0) {
            objects["collected"].timer = 0;
            objects["collected"].x = -10;
            objects["collected"].y = -10;
        }
        objects["collected2"].timer -= tick;
        if (objects["collected2"].timer < 0) {
            objects["collected2"].timer = 0;
            objects["collected2"].x = -10;
            objects["collected2"].y = -10;
        }

        if (postPrestige[0] > 0) {
            if (gc().time >= 0.5) {
                gc().time = 0;
                postPrestige[0] -= 1;

                createFallingItem("raingold");
            }
        }
        else if (gc().time >= cc().spawntime()) {
            gc().time = 0;
            createFallingItem(game.selCur);
        }

        if (isChristmas()) {
            if (game.snowflake.freezedowntime != -1) game.snowflake.freezedowntime += tick;

            if (game.snowflake.freezedowntime >= 0.5) {
                game.snowflake.freezedowntime = -1;
            }
        }

        if (game.watercoin.time >= 5 && game.watercoin.fill >= game.watercoin.fillNeeded) {
            game.watercoin.time = 0;
            createFallingItem("watercoin");
        }

        if (/*currencies.bubble.isUnlocked()*/ game.stats.totalRaingold >= 500) {
            objects["currencySelectionButton"].power = true;
            objects["currencySelectionButtonImg"].power = true;
        }

        for (let i = 1; i <= ITEM_LIMIT; i++) {
            if (objects["drop" + i].power) {
                if (game.snowflake.freezedowntime <= 0) objects["drop" + i].y += tick * getItemCur(i).speedMulti / snowflakeUpgrades.slowfall.getEffect();

                if (objects["drop" + i].y > 0.1 && !objects["drop" + i].autod && objects["drop" + i].currency != "raingold" && objects["drop" + i].currency != "watercoin" && cc().auto() > 0) {
                    if (Math.random() * 100 <= cc().auto() || game.watercoin.superAutoTime > 0) {
                        objects["drop" + i].onClick(true);
                    }
                    objects["drop" + i].autod = true;
                }

                if (objects["drop" + i].y > 0.8) objects["drop" + i].power = false;
            }
        }

        objects["waterFill"].w = Math.min(1, game.watercoin.fill / game.watercoin.fillNeeded);

        game.watercoin.tempBoostTime -= tick;
        game.watercoin.superAutoTime -= tick;
    }
);