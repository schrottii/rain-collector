scenes["upgrading"] = new Scene(
    () => {
        // Init
        createSquare("bgSquare1", 0, 0, 1, 0.9, "black");
        createSquare("bgSquare2", 0, 0.9, 1, 0.1, "darkgray");

        createText("header", 0.5, 0.06, "Raindrop Upgrades", { size: 60, color: "white" });
        createText("header2", 0.5, 0.46, "Water Coin Upgrades", { size: 60, color: "white" });

        // Go back
        createClickable("bgSquare2", 0, 0.9, 1, 0.1, () => { loadScene("mainmenu") });
        createText("backText", 0.5, 0.975, "Go back", { color: "black", size: 40 });

        // Upgrades
        for (let upg in raindropUpgrades) {
            raindropUpgrades[upg].createObjects(Object.keys(raindropUpgrades).indexOf(upg));
        }
        for (let upg in watercoinUpgrades) {
            watercoinUpgrades[upg].createObjects(4 + Object.keys(watercoinUpgrades).indexOf(upg));
        }

        // Currency display
        createSquare("currency1", 0.2, 0.775, 0.6, 0.1, "#560000");
        createImage("currency2", 0.25, 0.775, 0.1, 0.1, "currencies/raindrop", { quadratic: true, centered: true });
        createText("currencyDisplay", 0.775, 0.775 + 0.1 * 0.66, "", { color: "#F78A8A", size: 64, align: "right" });
    },
    (tick) => {
        // Loop
        for (let upg in raindropUpgrades) {
            raindropUpgrades[upg].updateObjects();
        }
        for (let upg in watercoinUpgrades) {
            watercoinUpgrades[upg].updateObjects();
        }

        objects["currencyDisplay"].text = game.raindrop.amount;
    }
);