var postPrestige;

function resetPostPrestige() {
    postPrestige = {
        amount: 0,
        worth: 0,
        type: ""
    };
}
resetPostPrestige();

function calcPrestigeGainRough() {
    // roughly how many you will get, used for other functions
    if (!cc().getPrestigeCurrency().isUnlocked()) return new Decimal(0);

    return cc().getPrestigeCurrency().prestigeFormula().floor();
}

function calcPrestigeAmount() {
    // how many items will fall
    if (!cc().getPrestigeCurrency().isUnlocked() || calcPrestigeGainRough() < 1) return new Decimal(0);
    return new Decimal(calcPrestigeGainRough().ln()).ceil().add(5);
}

function calcPrestigeGainItems() {
    // gains from items (75%)
    if (!cc().getPrestigeCurrency().isUnlocked()) return new Decimal(0);
    return calcPrestigeGainRough().div(1.25).div(calcPrestigeAmount()).ceil().mul(calcPrestigeAmount());
}

function calcPrestigeGainInstant() {
    // gains from instant (25%)
    if (!cc().getPrestigeCurrency().isUnlocked()) return new Decimal(0);
    return calcPrestigeGainRough().mul(0.25).ceil();
}

function calcPrestigeGainTotal() {
    // total gains (fall + instant)
    if (!cc().getPrestigeCurrency().isUnlocked()) return new Decimal(0);
    return calcPrestigeGainItems().add(calcPrestigeGainInstant());
}

scenes["prestige"] = new Scene(
    () => {
        // Init
        createSquare("bgSquare1", 0, 0, 1, 0.9, "black");
        if (game.settings.bg) createImage("bgSquare2", 0, 0, 1, 0.9, "bgShop");

        createText("header", 0.5, 0.06, "Prestige", { size: 60, color: "white" });

        // Go back
        createButton("backSquare", 0, 0.9, 1, 0.1, "button", () => { loadScene("mainmenu") });
        createText("backText", 0.5, 0.9625, "Go back", { color: "black", size: 64 });

        // Currency display
        createSquare("currency1", 0.2, 0.775, 0.6, 0.1, "#560000");
        createImage("currency2", 0.25, 0.775, 0.1, 0.1, "currencies/" + cc().getPrestigeCurrency().name, { quadratic: true, centered: true });
        createText("currencyDisplay", 0.775, 0.775 + 0.1 * 0.66, "", { color: "#F78A8A", size: 64, align: "right" });

        // Content
        createText("infoText", 0.5, 0.1, "Press the button below to prestige.", { color: "white", size: 32 });
        createText("infoText2", 0.5, 0.125, cc().renderName(true) + ", their upgrades & Waster Coins are lost,", { color: "white", size: 32 });
        createText("infoText3", 0.5, 0.15, "Water Coin upgrades, " + cc().getPrestigeCurrency().renderName(true) + " and stats are not", { color: "white", size: 32 });

        createText("infoText4", 0.5, 0.2, "0", { color: "white", size: 32 });
        createText("infoText5", 0.5, 0.225, "0", { color: "white", size: 32 });
        createText("infoText6", 0.5, 0.25, "0", { color: "white", size: 32 });

        createButton("prestigeButton", 0.5, 0.25, 0.2, 0.2, "prestige", () => {
            if (!cc().getPrestigeCurrency().isUnlocked()) {
                notification_Alert("Locked", "You need to collect more " + cc().renderName(true) + "!");
                return false;
            }
            if (calcPrestigeAmount() < 1) {
                notification_Alert("Zero", "You can't prestige for 0 " + cc().getPrestigeCurrency().renderName(true) + "! Keep progressing!");
                return false;
            }

            if (confirm("Do you really want to prestige for up to " + calcPrestigeGainTotal() + " " + cc().getPrestigeCurrency().renderName(true) + "?")) {
                // calculate and set the RG gains - this has to be done before anything else
                postPrestige = {
                    amount: calcPrestigeAmount() * 1,
                    worth: calcPrestigeGainItems().div(calcPrestigeAmount()),
                    type: cc().getPrestigeCurrency().name
                }

                // Increase
                game.stats.prestiges += 1;

                let amount = calcPrestigeGainInstant();
                cc().getPrestigeCurrency().add(amount);
                game.stats["total" + cc().getPrestigeCurrency().renderName(true)] = game.stats["total" + cc().getPrestigeCurrency().renderName(true)].add(amount);
                if (cc().getPrestigeCurrency().getAmount() > game.stats["most" + cc().getPrestigeCurrency().renderName(true)]) game.stats["most" + cc().getPrestigeCurrency().renderName(true)] = cc().getPrestigeCurrency().getAmount();

                // Decrease
                cc().reset();

                game.watercoin.amount = new Decimal(0);
                game.watercoin.fill = 0;
                game.watercoin.fillNeeded = 100;

                game.watercoin.tempBoostTime = 0;
                game.watercoin.superAutoTime = 0;

                clearFallingItems();

                for (let upg in game[cc().name].upgrades) {
                    game[cc().name].upgrades[upg] = 0;
                }
            }
        }, { quadratic: true, centered: true });
        createText("infoText7", 0.5, 0.5, "Every " + cc().getPrestigeCurrency().renderName() + " boosts your " + cc().renderName() + " gains by 1%", { color: "white", size: 32 });
        createText("infoText8", 0.5, 0.525, "0", { color: "white", size: 32 });
        createText("infoText9", 0.5, 0.55, "0", { color: "white", size: 32 });

        if (game.selCur == "bubble") {
            createButton("upgradesAccess", 0.5, 0.6, 0.1, 0.1, "upgrades", () => {
                viewUpgrades = "glowble",
                loadScene("upgrading");
            }, { quadratic: true, centered: true });
        }
    },
    (tick) => {
        // Loop
        objects["currencyDisplay"].text = fn(cc().getPrestigeCurrency().getAmount());

        objects["infoText4"].text = "You can earn: " + fn(calcPrestigeGainTotal()) + " " + cc().getPrestigeCurrency().renderName(true) + "!";
        objects["infoText5"].text = fn(calcPrestigeGainItems()) + " will fall (" + calcPrestigeAmount() + " items)";
        objects["infoText6"].text = fn(calcPrestigeGainInstant()) + " are awarded instantly";

        objects["infoText8"].text = "Current boost: x" + (1 + cc().getPrestigeCurrency().getAmount() / 100);
        objects["infoText9"].text = "Total prestiges: " + game.stats.prestiges;
    }
);