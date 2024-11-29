var postPrestige = [0, 0]; // amount, worth

function calcRaingoldGain() {
    if (game.raindrop.amount < 1e4) return new Decimal(0);
    let amount = new Decimal(game.raindrop.amount.ln());
    let totalLevels = 0;

    for (let upg in raindropUpgrades) {
        totalLevels += raindropUpgrades[upg].getLevel();
        if (raindropUpgrades[upg].getLevel() == raindropUpgrades[upg].getMaxLevel()) amount = amount.mul(2);
    }

    amount = amount.mul(totalLevels / 100);

    amount = amount.mul((game.achievements.length * 2) / 100 + 1);

    return amount.floor();
}

function calcRaingoldAmount() {
    return new Decimal(calcRaingoldGain().ln()).ceil().add(5);
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
        createText("infoText5", 0.5, 0.2, "(They have to be caught too!)", { color: "white", size: 32 });
        createButton("prestigeButton", 0.5, 0.2, 0.2, 0.2, "prestige", () => {
            if (game.raindrop.amount < 1e4) {
                alert("You need at least 10 000 Raindrops!");
                return false;
            }

            if (confirm("Do you really want to prestige for up to " + calcRaingoldGain().div(calcRaingoldAmount()).ceil().mul(calcRaingoldAmount()) + " Raingold?")) {
                // Increase
                game.stats.prestiges += 1;

                postPrestige = [calcRaingoldAmount() * 1, calcRaingoldGain().div(calcRaingoldAmount()).ceil()]

                // Decrease
                game.raindrop.amount = new Decimal(0);
                game.watercoin.amount = new Decimal(0);
                game.watercoin.fill = 0;

                clearFallingItems();

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
        objects["currencyDisplay"].text = fn(game.raingold.amount);
        objects["infoText4"].text = "You will earn: up to " + fn(calcRaingoldGain().div(calcRaingoldAmount()).ceil().mul(calcRaingoldAmount())) + " Raingold!";
        objects["infoText6"].text = "Current boost: x" + (1 + game.raingold.amount / 100);
        objects["infoText7"].text = "Total prestiges: " + game.stats.prestiges;
    }
);