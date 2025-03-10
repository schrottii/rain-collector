var amountBefore = 0;
const ITEM_LIMIT = 128;

function collectItem(i, isAuto = false) {
    if (objects["drop" + i].power == false) return false;
    objects["drop" + i].power = "hold";

    if (!isAuto && Math.random() * 100 < snowflakeUpgrades.freezedown.getEffect()) game.snowflake.freezedowntime = 0;

    if (isAuto == true) {
        objects["collected2"].power = true;
        objects["collected2"].x = objects["drop" + i].x;
        objects["collected2"].y = objects["drop" + i].y;
        objects["collected2"].timer = 0.25;
        objects["collected2"].image = "autocollected";
    }
    else {
        objects["collected"].power = true;
        objects["collected"].x = objects["drop" + i].x;
        objects["collected"].y = objects["drop" + i].y;
        objects["collected"].timer = 0.25;
        objects["collected"].image = "collected";
    }

    if (!isAuto && watercoinUpgrades.economicbubble.getLevel() > 0) {
        economicBubbleBoost += 1;
        if (Math.random() <= 0.1) economicBubbleBoost = 0;
    }

    if (!isAuto && getItemCur(i).name == "bubble" && watercoinUpgrades.coinpop.getLevel() > 0 && Math.random() * 100 <= watercoinUpgrades.coinpop.getEffect()) {
        setTimeout((x = objects["drop" + i].x, y = objects["drop" + i].y - 0.1) => {
            let spawnedCoin = createFallingItem("watercoin");
            objects["drop" + spawnedCoin].x = x;
            objects["drop" + spawnedCoin].y = y;
        }, 250);
    }

    if (unlockedItems() && Math.random() > 0.999) {
        createFallingItem("iron");
    }

    amountBefore = getItemCur(i).getAmount();
    getItemCur(i).onCollect(objects["drop" + i]);
    objects["latestGain"].text = "+" + fn(getItemCur(i).getAmount().sub(amountBefore));

    objects["drop" + i].power = false; // don't do it until now, because otherwise it might get replaced mid-stuff
}

scenes["mainmenu"] = new Scene(
    () => {
        // Init
        createSquare("bgSquare1", 0, 0, 1, 0.9, "black");
        if (game.settings.bg) createImage("bgSquare2", 0, 0, 1, 0.9, "bg");

        createSquare("autoCollectHeight", 0, 0.15, 1, 0.003, "white");

        createText("header", 0.5, 0.06, "Rain Collector v" + GAMEVERSION, { size: 60, color: "white" });

        for (let i = 1; i <= ITEM_LIMIT; i++) {
            createButton("drop" + i, -10, -10, 0.1, 0.1, "currencies/raindrop", () => {
                
            }, { power: false, quadratic: true, centered: true, onHover: () => { collectItem(i, false) } });
            objects["drop" + i].power = false;
        }

        createImage("bgSquare4", 0, 0, 1, 1, "bg2");

        createImage("collected", -10, -10, 0.1, 0.1, "collected", { quadratic: true, centered: true, power: false });
        objects["collected"].timer = 0;
        createImage("collected2", -10, -10, 0.1, 0.1, "autocollected", { quadratic: true, centered: true, power: false });
        objects["collected2"].timer = 0;

        // Bottom Buttons
        createButton("sceneButton1", 0, 0.9, 1 / 4, 0.1, "button", () => {
            viewUpgrades = game.selCur;
            loadScene("upgrading")
        });
        createImage("sceneImage1", 0.5 / 4, 0.91, 0.08, 0.08, "upgrades", { quadratic: true, centered: true });

        createButton("sceneButton2", 0 + 1 / 4, 0.9, 1 / 4, 0.1, "button", () => {
            if (cc().getPrestigeCurrency() == undefined) alert("There is no prestige for this currency!");
            else if (cc().getPrestigeCurrency().isUnlocked() || cc().getPrestigeCurrency().getAmount().gt(0)) loadScene("prestige");
            else alert("Collect more " + cc().renderName(true) + " to unlock!");
        });
        createImage("sceneImage2", 0.5 / 4 * 3, 0.91, 0.08, 0.08, "prestige", { quadratic: true, centered: true });
        createImage("sceneButton2locked", 0 + 1 / 4, 0.9, 1 / 4, 0.1, "locked", { power: false });

        createButton("sceneButton3", 0 + 1 / 4 * 2, 0.9, 1 / 4, 0.1, "button", () => {
            if (!unlockedItems()) alert("Unlocked at 1000 total Glowbles!");
            else loadScene("itemselection")
        });
        createImage("sceneImage3", 0.5 / 4 * 5, 0.91, 0.08, 0.08, "items/sword", { quadratic: true, centered: true });
        createImage("sceneButton3locked", 0 + 1 / 4 * 2, 0.9, 1 / 4, 0.1, "locked", { power: false });

        createButton("sceneButton4", 0 + 1 / 4 * 3, 0.9, 1 / 4, 0.1, "button", () => { loadScene("stats") });
        createImage("sceneImage4", 0.5 / 4 * 7, 0.91, 0.08, 0.08, "stats", { quadratic: true, centered: true });

        // Side button
        createButton("currencySelectionButton", 0.825, 0.8, 0.15, 0.05, "button", () => { loadScene("currencyselection") });
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
        createText("currencyDisplay2", 0.1, 0.9025, "", { color: "blue", size: 64, align: "left" });

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

        // Render falling drops
        gc().time += tick;
        game.watercoin.time += tick;

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

        if (postPrestige.amount > 0) {
            if (gc().time >= 0.5) {
                gc().time = 0;
                postPrestige.amount -= 1;

                createFallingItem(postPrestige.type);
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
                if (game.snowflake.freezedowntime <= 0) objects["drop" + i].y += tick * 0.6 * getItemCur(i).speedMulti / snowflakeUpgrades.slowfall.getEffect();

                if (objects["drop" + i].y > 0.1 && !objects["drop" + i].autod && objects["drop" + i].currency != "raingold" && objects["drop" + i].currency != "watercoin" && cc().auto() > 0) {
                    if (Math.random() * 100 <= cc().auto() || game.watercoin.superAutoTime > 0) {
                        collectItem(i, true);
                        objects["drop" + i].isAuto = true;
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