var viewUpgrades = "raindrop";
var justClickedWaterCoinButton = 0;

scenes["upgrading"] = new Scene(
    () => {
        // Init
        createSquare("bgSquare1", 0, 0, 1, 0.9, "black");
        if (game.settings.bg) createImage("bgSquare2", 0, 0, 1, 0.9, "bgShop");

        createText("header", 0.5, 0.06, "Upgrades", { size: 60, color: "white" });

        // Water Coin
        let showWaterCoinButton = viewUpgrades == "raindrop" || viewUpgrades == "bubble";
        if (showWaterCoinButton) {
            createButton("wcSquare", 0.8, 0.9, 0.2, 0.1, "button", () => {
                justClickedWaterCoinButton = 0.33; // do not directly leave, for 0.33s
                viewUpgrades = "watercoin";
                loadScene("upgrading");
            });
            createImage("wcText", 0.9, 0.925, 0.05, 0.05, "currencies/watercoin", { quadratic: true, centered: true });
        }

        // Go back
        createButton("backSquare", 0, 0.9, showWaterCoinButton ? 0.8 : 1, 0.1, "button", () => { 
            if (justClickedWaterCoinButton > 0) return false;
            if (game.selTemp != "none") {
                // player is here temporarily, currency is locked
                game.selCur = game.selTemp;
                game.selTemp = "none";
                loadScene("currencyselection")
            }
            else {
                // normal return
                loadScene("mainmenu")
            }
        });
        createText("backText", showWaterCoinButton ? 0.4 : 0.5, 0.9625, "Go back", { color: "black", size: 64 });

        // Upgrades
        for (let upg in currencies[viewUpgrades].upgrades()) {
            currencies[viewUpgrades].upgrades()[upg].createObjects(Object.keys(currencies[viewUpgrades].upgrades()).indexOf(upg));
        }

        // Multi buy
        createButton("multiBuyButton1", 0.1, 10, 0.2, 0.05, "#212121", () => { multiBuy = 1; });
        createText("multiBuyText1", 0.2, 10, "x1", { color: "white", size: 40 });
        createButton("multiBuyButton2", 0.3, 10, 0.2, 0.05, "#404040", () => { multiBuy = 5; });
        createText("multiBuyText2", 0.4, 10, "x5", { color: "white", size: 40 });
        createButton("multiBuyButton3", 0.5, 10, 0.2, 0.05, "#212121", () => { multiBuy = 25; });
        createText("multiBuyText3", 0.6, 10, "x25", { color: "white", size: 40 });
        createButton("multiBuyButton4", 0.7, 10, 0.2, 0.05, "#404040", () => { multiBuy = 100; });
        createText("multiBuyText4", 0.8, 10, "x100", { color: "white", size: 40 });

        // Currency display
        createSquare("currency1", 0.2, 0.775, 0.6, 0.1, "#560000");
        createImage("currency2", 0.25, 0.775, 0.1, 0.1, "currencies/" + currencies[viewUpgrades], { quadratic: true, centered: true });
        createText("currencyDisplay", 0.775, 0.775 + 0.1 * 0.66, "", { color: "#F78A8A", size: 64, align: "right" });
    },
    (tick) => {
        // Loop
        for (let upg in currencies[viewUpgrades].upgrades()) {
            currencies[viewUpgrades].upgrades()[upg].updateObjects();
        }

        // Multi buy
        for (let i = 1; i <= 4; i++) {
            objects["multiBuyText" + i].color = multiBuy == [1, 5, 25, 100][i - 1] ? "green" : "white";
        }

        objects["header"].text = currencies[viewUpgrades].renderName() + " Upgrades";

        objects["currencyDisplay"].text = fn(currencies[viewUpgrades].getAmount());
        objects["currency2"].image = "currencies/" + currencies[viewUpgrades].image;

        if (game.stats.prestiges > 0) {
            for (let i = 1; i < 5; i++) {
                objects["multiBuyButton" + i].y = 0.705;
                objects["multiBuyText" + i].y = 0.74;
            }
        }
        else {
            for (let i = 1; i < 5; i++) {
                objects["multiBuyButton" + i].y = 10;
                objects["multiBuyText" + i].y = 10;
            }
            multiBuy = 1;
        }

        justClickedWaterCoinButton -= tick;
    }
);