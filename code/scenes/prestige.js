var postPrestige = [0, 0]; // amount, worth

function calcRaingoldGainRough() {
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
    // how many items will fall
    if (game.raindrop.amount < 1e4 || calcRaingoldGainRough() < 1) return new Decimal(0);
    return new Decimal(calcRaingoldGainRough().ln()).ceil().add(5);
}

function calcRaingoldGainItems() {
    // gains from items
    if (game.raindrop.amount < 1e4) return new Decimal(0);
    return calcRaingoldGainRough().div(1.25).div(calcRaingoldAmount()).ceil().mul(calcRaingoldAmount());
}

function calcRaingoldGainInstant() {
    if (game.raindrop.amount < 1e4) return new Decimal(0);
    return calcRaingoldGainRough().mul(0.25).ceil();
}

function calcRaingoldGainTotal() {
    if (game.raindrop.amount < 1e4) return new Decimal(0);
    return calcRaingoldGainItems().add(calcRaingoldGainInstant());
}

scenes["prestige"] = new Scene(
    () => {
        // Init
        createSquare("bgSquare1", 0, 0, 1, 0.9, "black");
        createSquare("bgSquare2", 0, 0.9, 1, 0.1, "darkgray");

        createText("header", 0.5, 0.06, "Prestige", { size: 60, color: "white" });

        // Go back
        createClickable("bgSquare3", 0, 0.9, 1, 0.1, () => { loadScene("mainmenu") });
        createText("backText", 0.5, 0.975, "Go back", { color: "black", size: 40 });

        // Currency display
        createSquare("currency1", 0.2, 0.775, 0.6, 0.1, "#560000");
        createImage("currency2", 0.25, 0.775, 0.1, 0.1, "currencies/raingold", { quadratic: true, centered: true });
        createText("currencyDisplay", 0.775, 0.775 + 0.1 * 0.66, "", { color: "#F78A8A", size: 64, align: "right" });

        // Content
        createText("infoText", 0.5, 0.1, "Press the button below to prestige.", { color: "white", size: 32 });
        createText("infoText2", 0.5, 0.125, "Raindrops, their upgrades & Waster Coins are lost,", { color: "white", size: 32 });
        createText("infoText3", 0.5, 0.15, "Water Coin upgrades, Raingold and stats are not", { color: "white", size: 32 });

        createText("infoText4", 0.5, 0.2, "0", { color: "white", size: 32 });
        createText("infoText5", 0.5, 0.225, "0", { color: "white", size: 32 });
        createText("infoText6", 0.5, 0.25, "0", { color: "white", size: 32 });

        createButton("prestigeButton", 0.5, 0.25, 0.2, 0.2, "prestige", () => {
            if (game.raindrop.amount < 1e4) {
                alert("You need at least 10 000 Raindrops!");
                return false;
            }
            if (calcRaingoldAmount() < 1) {
                alert("You can't prestige for 0 Raingold! Keep progressing!");
                return false;
            }

            if (confirm("Do you really want to prestige for up to " + calcRaingoldGainTotal() + " Raingold?")) {
                // calculate and set the RG gains - this has to be done before anything else
                postPrestige = [calcRaingoldAmount() * 1, calcRaingoldGainItems().div(calcRaingoldAmount())]

                // Increase
                game.stats.prestiges += 1;

                let amount = calcRaingoldGainInstant();
                game.raingold.amount = game.raingold.amount.add(amount);
                game.stats.totalRaingold = game.stats.totalRaingold.add(amount);
                if (game.raingold.amount > game.stats.mostRaingold) game.stats.mostRaingold = game.raingold.amount;

                // Decrease
                game.raindrop.amount = new Decimal(0);
                game.watercoin.amount = new Decimal(0);
                game.watercoin.fill = 0;
                game.watercoin.fillNeeded = 100;

                clearFallingItems();

                for (let upg in raindropUpgrades) {
                    game.raindrop.upgrades[upg] = 0;
                }
            }
        }, { quadratic: true, centered: true });
        createText("infoText7", 0.5, 0.5, "Every Raingold boosts your Raindrop gains by 1%", { color: "white", size: 32 });
        createText("infoText8", 0.5, 0.525, "0", { color: "white", size: 32 });
        createText("infoText9", 0.5, 0.55, "0", { color: "white", size: 32 });
    },
    (tick) => {
        // Loop
        objects["currencyDisplay"].text = fn(game.raingold.amount);

        objects["infoText4"].text = "You can earn: " + fn(calcRaingoldGainTotal()) + " Raingold!";
        objects["infoText5"].text = fn(calcRaingoldGainItems()) + " will fall (" + calcRaingoldAmount() + " items)";
        objects["infoText6"].text = fn(calcRaingoldGainInstant()) + " are awarded instantly";

        objects["infoText8"].text = "Current boost: x" + (1 + game.raingold.amount / 100);
        objects["infoText9"].text = "Total prestiges: " + game.stats.prestiges;
    }
);