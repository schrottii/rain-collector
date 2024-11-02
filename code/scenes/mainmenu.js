scenes["mainmenu"] = new Scene(
    () => {
        // Init
        createSquare("bgSquare1", 0, 0, 1, 0.9, "black");
        if (game.settings.bg) createImage("bgSquare2", 0, 0, 1, 0.9, "bg");
        createSquare("bgSquare3", 0, 0.9, 1, 0.1, "darkgray");

        createText("header", 0.5, 0.06, "Rain Collector v1.0", { size: 60, color: "white" });

        for (let i = 1; i <= 20; i++) {
            createButton("drop" + i, -10, -10, 0.1, 0.1, "currencies/raindrop", () => {
                if (objects["drop" + i].power == false) return false;
                objects["drop" + i].power = false;

                currencies[objects["drop" + i].currency].onCollect();

            }, { power: false, quadratic: true });
            objects["drop" + i].power = false;
        }

        createImage("bgSquare4", 0, 0, 1, 1, "bg2");

        // Buttons
        createButton("sceneButton1", 0, 0.9, 1 / 2, 0.1, "button", () => { loadScene("upgrading") });
        createButton("sceneButton2", 0 + 1 / 2, 0.9, 1 / 2, 0.1, "button", () => { loadScene("settings") });
        createImage("sceneImage1", 0.25, 0.91, 0.08, 0.08, "upgrades", { quadratic: true, centered: true });
        createImage("sceneImage2", 0.75, 0.91, 0.08, 0.08, "settings", { quadratic: true, centered: true });

        // Currency display
        createSquare("currency1", 0.2, 0.775, 0.6, 0.1, "#560000");
        createImage("currency2", 0.25, 0.775, 0.1, 0.1, "currencies/raindrop", { quadratic: true, centered: true });
        createText("currencyDisplay", 0.775, 0.775 + 0.1 * 0.66, "", { color: "#F78A8A", size: 64, align: "right" })

        // Water Coin
        createSquare("waterFillBg", 0, 0.875, 1, 0.03, "black");
        createSquare("waterFill", 0, 0.875, 0, 0.03, "#02F8FD");
        createImage("currency3", 0.05, 0.875, 0.03, 0.03, "currencies/watercoin", { quadratic: true, centered: true });
        createText("currencyDisplay2", 0.1, 0.875 + 0.05 * 0.66, "", { color: "black", size: 64, align: "left" })

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

        objects["currencyDisplay"].text = game.raindrop.amount;
        objects["currencyDisplay2"].text = game.watercoin.amount;

        // Render falling drops
        game.raindrop.time += tick;
        game.watercoin.time += tick;
        
        if (game.raindrop.time >= 1 / raindropUpgrades.time.getEffect()) {
            game.raindrop.time = 0;
            for (let i = 1; i <= 20; i++) {
                if (objects["drop" + i].power == false) {
                    objects["drop" + i].x = 0.8 * Math.random() + 0.1;
                    objects["drop" + i].y = -0.1;
                    objects["drop" + i].image = "currencies/" + cc().image;
                    objects["drop" + i].currency = game.selCur;

                    objects["drop" + i].autod = false; // auto'd
                    objects["drop" + i].power = true;
                    break;
                }
            }
        }

        if (game.watercoin.time >= 5 && game.watercoin.fill >= 100) {
            game.watercoin.time = 0;
            for (let i = 1; i <= 20; i++) {
                if (objects["drop" + i].power == false) {
                    objects["drop" + i].x = 0.8 * Math.random() + 0.1;
                    objects["drop" + i].y = -0.1;
                    objects["drop" + i].image = "currencies/" + currencies.watercoin.image;
                    objects["drop" + i].currency = "watercoin";

                    objects["drop" + i].autod = false; // auto'd
                    objects["drop" + i].power = true;
                    break;
                }
            }
        }

        for (let i = 1; i <= 10; i++) {
            if (objects["drop" + i].power) {
                objects["drop" + i].y += tick;
                clickables["drop" + i][0] = objects["drop" + i].x * wggjCanvasWidth;
                clickables["drop" + i][1] = objects["drop" + i].y * wggjCanvasHeight;

                if (objects["drop" + i].y > 0.4 && !objects["drop" + i].autod && objects["drop" + i].currency == "raindrop" && game.raindrop.upgrades.auto > 0) {
                    if (Math.random() * 100 <= game.raindrop.upgrades.auto || game.watercoin.superAutoTime > 0) {
                        clickables["drop" + i][4]();
                    }
                    objects["drop" + i].autod = true;
                }

                if (objects["drop" + i].y > 0.8) objects["drop" + i].power = false;
            }
        }

        objects["waterFill"].w = Math.min(1, 1 * (0.01 * game.watercoin.fill));
    }
);