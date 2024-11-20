var postPrestige = [0, 0]; // amount, worth

function calcRaingoldGain() {
    if (game.raindrop.amount < 1e4) return 0;
    let amount = Math.log(game.raindrop.amount);
    let totalLevels = 0;

    for (let upg in raindropUpgrades) {
        totalLevels += raindropUpgrades[upg].getLevel();
        if (raindropUpgrades[upg].getLevel() == raindropUpgrades[upg].getMaxLevel()) amount *= 2;
    }

    amount *= totalLevels / 100;

    return Math.floor(amount);
}

scenes["prestige"] = new Scene(
    () => {
        // Init
        createSquare("bgSquare1", 0, 0, 1, 0.9, "black");
        createSquare("bgSquare2", 0, 0.9, 1, 0.1, "darkgray");

        createText("header", 0.5, 0.06, "Prestige", { size: 60, color: "white" });

        // Go back
        createClickable("bgSquare2", 0, 0.9, 1, 0.1, () => { loadScene("mainmenu") });
        createText("backText", 0.5, 0.975, "Go back", { color: "black", size: 40 });

        // Currency display
        createSquare("currency1", 0.2, 0.775, 0.6, 0.1, "#560000");
        createImage("currency2", 0.25, 0.775, 0.1, 0.1, "currencies/raingold", { quadratic: true, centered: true });
        createText("currencyDisplay", 0.775, 0.775 + 0.1 * 0.66, "", { color: "#F78A8A", size: 64, align: "right" });

        // Content
        createText("infoText", 0.5, 0.1, "Press the button below to prestige.", { color: "white", size: 32 });
        createText("infoText2", 0.5, 0.125, "Raindrops, their upgrades & Waster Coins are lost,", { color: "white", size: 32 });
        createText("infoText3", 0.5, 0.15, "Water Coin upgrades, Raingold and stats are not", { color: "white", size: 32 });
        createText("infoText4", 0.5, 0.175, "0", { color: "white", size: 32 });
        createButton("prestigeButton", 0.5, 0.2, 0.2, 0.2, "prestige", () => {
            if (game.raindrop.amount < 1e4) {
                alert("You need at least 10 000 Raindrops!");
                return false;
            }

            if (confirm("Do you really want to prestige for ~" + calcRaingoldGain() + " Raingold?")) {
                // Increase
                game.stats.prestiges += 1;

                let amount = 5 + Math.ceil(Math.log(calcRaingoldGain()));
                postPrestige = [amount, Math.ceil(calcRaingoldGain() / amount)]

                // Decrease
                game.raindrop.amount = 0;
                game.watercoin.amount = 0;
                game.watercoin.fill = 0;

                for (let upg in raindropUpgrades) {
                    game.raindrop.upgrades[upg] = 0;
                }
            }
        }, { quadratic: true, centered: true });
        createText("infoText5", 0.5, 0.45, "Every Raingold boosts your Raindrop gains by 1%", { color: "white", size: 32 });
        createText("infoText6", 0.5, 0.475, "0", { color: "white", size: 32 });
        createText("infoText7", 0.5, 0.5, "0", { color: "white", size: 32 });
    },
    (tick) => {
        // Loop
        objects["currencyDisplay"].text = game.raingold.amount;
        objects["infoText4"].text = "You will earn: ~" + calcRaingoldGain() + " Raingold!";
        objects["infoText6"].text = "Current boost: x" + (1 + game.raingold.amount / 100);
        objects["infoText7"].text = "Total prestiges: " + game.stats.prestiges;
    }
);