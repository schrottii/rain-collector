scenes["upgrading"] = new Scene(
    () => {
        // Init
        createSquare("bgSquare1", 0, 0, 1, 0.9, "black");
        createSquare("bgSquare2", 0, 0.9, 1, 0.1, "darkgray");

        createText("header", 0.5, 0.06, "Raindrop Upgrades", { size: 60, color: "white" });

        // Go back
        createClickable("bgSquare3", 0, 0.9, 1, 0.1, () => { loadScene("mainmenu") });
        createText("backText", 0.5, 0.975, "Go back", { color: "black", size: 40 });

        // Upgrades
        for (let upg in cc().upgrades()) {
            cc().upgrades()[upg].createObjects(Object.keys(cc().upgrades()).indexOf(upg));
        }
        if (game.selCur == "raindrop") {
            createText("header2", 0.5, 0.46, "Water Coin Upgrades", { size: 60, color: "white" });
            for (let upg in watercoinUpgrades) {
                watercoinUpgrades[upg].createObjects(4 + Object.keys(watercoinUpgrades).indexOf(upg));
            }
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
        createImage("currency2", 0.25, 0.775, 0.1, 0.1, "currencies/raindrop", { quadratic: true, centered: true });
        createText("currencyDisplay", 0.775, 0.775 + 0.1 * 0.66, "", { color: "#F78A8A", size: 64, align: "right" });
    },
    (tick) => {
        // Loop
        for (let upg in cc().upgrades()) {
            cc().upgrades()[upg].updateObjects();
        }
        if (game.selCur == "raindrop") {
            for (let upg in watercoinUpgrades) {
                watercoinUpgrades[upg].updateObjects();
            }
        }

        // Multi buy
        for (let i = 1; i <= 4; i++) {
            objects["multiBuyText" + i].color = multiBuy == [1, 5, 25, 100][i - 1] ? "green" : "white";
        }

        objects["header"].text = cc().renderName() + " Upgrades";

        objects["currencyDisplay"].text = fn(cc().getAmount());
        objects["currency2"].image = "currencies/" + cc().image;

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
    }
);