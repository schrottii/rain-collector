class Currency {
    constructor(name, image, unlock, onCollect, sizeMulti, speedMulti, config) {
        this.name = name;
        this.image = image;
        this.unlock = unlock;
        this.onCollect = onCollect;

        this.sizeMulti = sizeMulti;
        this.speedMulti = speedMulti;

        if (config) {
            this.pluralname = config.pluralname;
            this.prestigeCurrency = config.prestigeCurrency;
            this.varyingSize = config.varyingSize;

            this.onBottom = config.onBottom;

            this.prestigeFormula = config.prestigeFormula;

            this.config = config;
        }
    }

    // basic getter setter
    amount() {
        return this.getAmount();
    }

    add(amount) {
        game[this.name].amount = game[this.name].amount.add(amount);
    }

    reset() {
        game[this.name].amount = new Decimal(0);
    }

    // is methods
    isUnlocked() {
        return this.unlock[0]();
    }

    isSelected() {
        return game.selCur == this.name;
    }

    // get methods
    getAmount() {
        return game[this.name].amount;
    }

    getStat(stat) {
        // accepts: total | most | item
        return game.stats[stat + this.renderName(true)];
    }

    getPrestigeCurrency() {
        if (this.prestigeCurrency != undefined) {
            return currencies[this.prestigeCurrency];
        }
        else {
            return undefined;
        }
    }

    getTime() {
        return game[this.name].time;
    }

    getTotalUpgradeLevels(max = false) {
        // if max == false (default), it returns how many levels you HAVE
        // == true, it returns how many you can GET (max. levels)
        let amount = 0;

        for (let upg in this.upgrades()) {
            // don't count upgrades that have no max. level
            if (this.upgrades()[upg].getMaxLevel() != 9999999999999999999) {
                if (max) amount += this.upgrades()[upg].getMaxLevel();
                else amount += this.upgrades()[upg].getLevel();
            }
        }

        return amount;
    }

    // name related methods
    me() {
        return "cur" + this.name;
    }

    plural() {
        // returns the plural name... sigh
        if (this.pluralname != undefined) {
            return this.pluralname;
        }
        else return this.name; // if there is no plural, it's the same as singular
    }

    renderName(isPlural = false) {
        let nameToCut = isPlural ? ("" + this.plural()) : ("" + this.name);
        return nameToCut.substr(0, 1).toUpperCase() + nameToCut.substr(1);
    }

    // upgrade related methods
    upgrades(defaultReturn = false) {
        switch (this.name) {
            case "raindrop":
                return raindropUpgrades;
            case "watercoin":
                return watercoinUpgrades;
            case "bubble":
                return bubbleUpgrades;
            case "snowflake":
                return snowflakeUpgrades;
            case "glowble":
                return glowbleUpgrades;
            case "muddrop":
                return muddropUpgrades;
            default:
                if (defaultReturn == false) return raindropUpgrades;
                else return defaultReturn;
        }
    }

    spawntime() {
        switch (this.name) {
            case "raindrop":
                return raindropUpgrades.time.getEffect();
            case "bubble":
                return bubbleUpgrades.time.getEffect();
            default:
                return 1;
        }
    }

    auto() {
        switch (this.name) {
            case "raindrop":
                return raindropUpgrades.auto.getEffect();
            case "bubble":
                return bubbleUpgrades.auto.getEffect();
            case "muddrop":
                return muddropUpgrades.auto.getEffect();
            default:
                return 0;
        }
    }

    // rendering
    createObjects(index) {
        createSquare(this.me() + "bg", 0, 0.1 + index * 0.1, 1, 0.1, index % 2 == 0 ? "#560000" : "#A83F3F");
        createSquare(this.me() + "bg2", 0, 0.15 + index * 0.1, 1, 0.05, index % 2 == 0 ? "#470000" : "#993A3A");

        createButton(this.me() + "button", 0.025, 0.1 + index * 0.1, 0.1, 0.1, "switch2", () => {
            if (this.isUnlocked()) {
                game.selCur = this.name;
            }
            else if (this.getStat("total") > 0) {
                // Let the player see their upgrades even though they currently do not have it unlocked
                // when they leave the upgrading scene, temporaryUpgrading becomes "none" and the currency is reset
                game.selTemp = game.selCur;
                game.selCur = this.name;
                viewUpgrades = game.selCur;
                loadScene("upgrading");
            }
        }, { quadratic: true });
        createImage(this.me() + "pic", 0.125, 0.125 + index * 0.1, 0.05, 0.05, "currencies/" + currencies[this.name].image, { quadratic: true, centered: true });

        createText(this.me() + "name", 0.275, 0.13 + index * 0.1 + (isMobile() ? 0 : 0.01), "", { color: "white", size: 40, align: "left" });

        createText(this.me() + "desc", 0.275, 0.18 + index * 0.1, "", { color: "white", size: 24, align: "left" });
        //createText(this.me() + "desc2", 0.275, 0.20 + index * 0.1, "", { color: "white", size: 24, align: "left" });

        createText(this.me() + "amount", 0.95, 0.13 + index * 0.1 + (isMobile() ? 0 : 0.01), "0", { color: "white", size: 32, align: "right" });
        createImage(this.me() + "amount2", 0.95, 0.11 + index * 0.1 + (isMobile() ? 0 : 0.01), 0.02, 0.02, "currencies/" + currencies[this.name].image, { quadratic: true });

        createText(this.me() + "pamount", 0.95, 0.15 + index * 0.1 + (isMobile() ? 0 : 0.01), "0", { color: "white", size: 32, align: "right" });
        createImage(this.me() + "pamount2", 0.95, 0.13 + index * 0.1 + (isMobile() ? 0 : 0.01), 0.02, 0.02, "locked", { quadratic: true });

        createText(this.me() + "levelprog", 0.95, 0.17 + index * 0.1 + (isMobile() ? 0 : 0.01), "0", { color: "white", size: 32, align: "right" });
        createImage(this.me() + "levelprogpic", 0.95, 0.15 + index * 0.1 + (isMobile() ? 0 : 0.01), 0.02, 0.02, "upgrades", { quadratic: true });
    }

    updateObjects() {
        //objects[this.me() + "level"].text = "L" + this.getLevel() + (this.maxLevel != 0 ? "/" + this.maxLevel : "");
        objects[this.me() + "name"].text = this.isUnlocked() ? this.renderName(true) : "???";
        objects[this.me() + "amount"].text = this.isUnlocked() ? fn(this.getAmount()) : "Locked";
        objects[this.me() + "pamount"].text = this.getPrestigeCurrency() != undefined ? fn(this.getPrestigeCurrency().getAmount()) : "";
        objects[this.me() + "pamount2"].image = this.getPrestigeCurrency() != undefined ? "currencies/" + this.getPrestigeCurrency().image : "locked";
        objects[this.me() + "levelprog"].text = (this.getTotalUpgradeLevels()
            + (this.getPrestigeCurrency() != undefined && this.getPrestigeCurrency().upgrades("none") != "none" ? this.getPrestigeCurrency().getTotalUpgradeLevels() : ""))
            + "/" + (this.getTotalUpgradeLevels(true)
            + (this.getPrestigeCurrency() != undefined && this.getPrestigeCurrency().upgrades("none") != "none" ? this.getPrestigeCurrency().getTotalUpgradeLevels(true) : ""));

        objects[this.me() + "desc"].text = this.isUnlocked() ? (this.isSelected() ? "Selected" : "Unlocked") : "Locked (" + this.unlock[1] + ")";
    }
}

function cc() {
    // returns current currency
    return currencies[game.selCur];
}

function gc() {
    return game[game.selCur];
}

function getFallingX() {
    if (isMobile()) {
        // Mobile: 0.1 - 0.9
        return 0.8 * Math.random() + 0.1;
    }
    else {
        // PC: 0.3 - 0.7
        return 0.4 * Math.random() + 0.3;
    }
}

function createFallingItem(item) {
    for (let i = 1; i <= ITEM_LIMIT; i++) {
        if (fallingItems["drop" + i].power == false && currencies[item].isUnlocked()) {
            fallingItems["drop" + i].x = getFallingX();
            fallingItems["drop" + i].y = -0.1;
            fallingItems["drop" + i].w = fallingItems["drop" + i].h = 0.1
                * currencies[item].sizeMulti
                * (currencies[item].varyingSize == true ? Math.max(0.5, Math.random()) : 1);

            fallingItems["drop" + i].age = 0;

            fallingItems["drop" + i].inflated = false;
            if (glowbleUpgrades.inflatedfall.getLevel() > 0 && Math.random() * 100 <= glowbleUpgrades.inflatedfall.getEffect() && (item == "raindrop" || item == "bubble")) {
                fallingItems["drop" + i].w = fallingItems["drop" + i].h = fallingItems["drop" + i].w * 1.5;
                fallingItems["drop" + i].inflated = true;
            }

            fallingItems["drop" + i].image = "currencies/" + currencies[item].image;
            fallingItems["drop" + i].currency = item;

            fallingItems["drop" + i].isAuto = false;
            fallingItems["drop" + i].autod = false;
            fallingItems["drop" + i].power = true;

            return i; // can be used
        }
    }
}

function clearFallingItems() {
    if (fallingItems["drop4"] != undefined) {
        for (let i = 1; i <= 20; i++) {
            fallingItems["drop" + i].power = false;
        }
    }
}

function getItemCur(index) {
    // returns the currency for an item, so its onClick, speed and other can be accessed
    return currencies[fallingItems["drop" + index].currency];
}



// CURRENCIES DICT
const currencies = {
    raindrop: new Currency("raindrop", "raindrop", [() => true, "Unlocked"], (item) => {
        let amount = (game.raindrop.upgrades.worth + 1)
            * (game.watercoin.tempBoostTime > 0 ? watercoinUpgrades.tempboost.getEffect() : 1)
            * (1 + game.raingold.amount / 100)
            * getItemBoost("raindrop", true)
            * weathers[currentWeather].worthMulti
            * (item.isAuto ? 1 : (watercoinUpgrades.economicbubble.getEffect() / 100) * economicBubbleBoost + 1)
            * (item.inflated ? glowbleUpgrades.bigpop.getEffect() : 1);
        amount = Math.ceil(amount);

        game.raindrop.amount = game.raindrop.amount.add(amount);
        game.stats.totalRaindrops = game.stats.totalRaindrops.add(amount);
        if (game.raindrop.amount.gt(game.stats.mostRaindrops)) game.stats.mostRaindrops = game.raindrop.amount;
        game.stats.itemRaindrops += 1;

        game.watercoin.fill++;
    }, 1, 1, {
        pluralname: "raindrops",
        prestigeCurrency: "raingold",
    }),


    watercoin: new Currency("watercoin", "watercoin", [() => true, "Unlocked"], () => {
        game.watercoin.fill = 0;
        game.watercoin.fillNeeded += 5;

        let amount = 1;

        game.watercoin.amount = game.watercoin.amount.add(amount);
        game.stats.totalWatercoins = game.stats.totalWatercoins.add(amount);
        if (game.watercoin.amount.gt(game.stats.mostWatercoins)) game.stats.mostWatercoins = game.watercoin.amount;
        game.stats.itemWatercoins += 1;
    }, 1, 0.8, {
        pluralname: "watercoins"
    }),


    raingold: new Currency("raingold", "raingold", [() => game.raindrop.amount >= 1e4 || postPrestige.amount > 0 || game.raingold.amount >= 1, "10000 Raindrops"], () => {
        if (postPrestige.type != "raingold") return false;
        let amount = Math.ceil(postPrestige.worth
            * getItemBoost("raingold", true));

        game.raingold.amount = game.raingold.amount.add(amount);
        game.stats.totalRaingold = game.stats.totalRaingold.add(amount);
        if (game.raingold.amount.gt(game.stats.mostRaingold)) game.stats.mostRaingold = game.raingold.amount;
        game.stats.itemRaingold += 1;

        game.watercoin.fill++;
    }, 1.2, 0.5, {
        prestigeFormula: () => {
            let amount = new Decimal(game.raindrop.amount.ln());
            let totalLevels = 0;

            for (let upg in raindropUpgrades) {
                totalLevels += raindropUpgrades[upg].getLevel();
                if (raindropUpgrades[upg].getLevel() == raindropUpgrades[upg].getMaxLevel()) amount = amount.mul(2);
            }

            amount = amount.mul(totalLevels / 100);
            amount = amount.mul((game.achievements.length * 2) / 100 + 1);

            return amount;
        }
    }),


    bubble: new Currency("bubble", "bubble", [() => game.raingold.amount >= 2000, "2000 Raingold"], (item) => {
        let amount = ((game.bubble.upgrades.worth + 1)
            * (1 + game.glowble.amount / 100)
            * (item.w * 10 > 0.8 ? glowbleUpgrades.bigpop.getEffect() : 1)
            * item.w * 10)
            * (game.watercoin.tempBoostTime > 0 ? watercoinUpgrades.tempboost.getEffect() : 1)
            * (item.isAuto ? 1 : (watercoinUpgrades.economicbubble.getEffect() / 100) * economicBubbleBoost + 1)
            * getItemBoost("bubble", true)
            * weathers[currentWeather].worthMulti
            * (item.inflated ? glowbleUpgrades.bigpop.getEffect() : 1);
        amount = Math.ceil(amount);

        game.bubble.amount = game.bubble.amount.add(amount);
        game.stats.totalBubbles = game.stats.totalBubbles.add(amount);
        if (game.bubble.amount.gt(game.stats.mostBubbles)) game.stats.mostBubbles = game.bubble.amount;
        game.stats.itemBubbles += 1;

        game.watercoin.fill++;
    }, 1.4, 0.33, {
        pluralname: "bubbles",
        varyingSize: true,
        prestigeCurrency: "glowble"
    }),


    snowflake: new Currency("snowflake", "snowflake", [() => isChristmas(), "Christmas & 2000 Raingold"], () => {
        let amount = 1;

        game.snowflake.amount = game.snowflake.amount.add(amount);
        game.stats.totalSnowflakes = game.stats.totalSnowflakes.add(amount);
        if (game.snowflake.amount.gt(game.stats.mostSnowflakes)) game.stats.mostSnowflakes = game.snowflake.amount;
        game.stats.itemSnowflakes += 1;
    }, 1, 0.6, {
        pluralname: "snowflakes"
    }),


    glowble: new Currency("glowble", "glowble", [() => game.bubble.amount >= 1e5 || game.glowble.amount >= 1, "100 000 Bubbles"], (item) => {
        if (postPrestige.type != "glowble") return false;
        let amount = Math.ceil(postPrestige.worth
            * getItemBoost("glowble", true));

        game.glowble.amount = game.glowble.amount.add(amount);
        game.stats.totalGlowbles = game.stats.totalGlowbles.add(amount);
        if (game.glowble.amount.gt(game.stats.mostGlowbles)) game.stats.mostGlowbles = game.glowble.amount;
        game.stats.itemGlowbles += 1;

        game.watercoin.fill++;
    }, 1.2, 0.6, {
        pluralname: "glowbles",
        varyingSize: true,
        prestigeFormula: () => {
            let amount = new Decimal(game.bubble.amount.ln());
            let totalLevels = 0;

            for (let upg in bubbleUpgrades) {
                totalLevels += bubbleUpgrades[upg].getLevel();
                if (bubbleUpgrades[upg].getLevel() == bubbleUpgrades[upg].getMaxLevel()) amount = amount.mul(1.5);
            }

            amount = amount.mul(totalLevels / 40);
            amount = amount.mul((game.achievements.length * 2) / 100 + 1);

            return amount;
        }
    }),


    iron: new Currency("iron", "iron", [() => unlockedItems(), "1000 Glowbles"], (item) => {
        if (item.power == false) return false;
        game.iron.amount = game.iron.amount.add(1);
        game.stats.totalIron = game.stats.totalIron.add(1);
        game.stats.itemIron++;

        if (game.iron.amount > game.stats.mostIron) game.stats.mostIron = game.iron.amount;
    }, 1.5, 1),


    muddrop: new Currency("muddrop", "muddrop", [() => game.stats.totalGlowbles >= 5000, "5000 Glowbles"], (item) => {
        let amount = (game.muddrop.upgrades.worth + 1)
            * getItemBoost("muddrop", true)
            * weathers[currentWeather].worthMulti
            * (game.watercoin.tempBoostTime > 0 ? watercoinUpgrades.tempboost.getEffect() : 1)
            * (item.isAuto ? 1 : (watercoinUpgrades.economicbubble.getEffect() / 100) * economicBubbleBoost + 1)
        amount = Math.ceil(amount);

        if (item.image == "mudpuddle" || item.image == "mudpuddle2") {
            game.stats.itemMudpuddles += 1;
            weatherSecs += 2;
        }
        else {
            game.watercoin.fill += 2;
        }

        game.muddrop.amount = game.muddrop.amount.add(amount);
        game.stats.totalMuddrops = game.stats.totalMuddrops.add(amount);
        if (game.muddrop.amount.gt(game.stats.mostMuddrops)) game.stats.mostMuddrops = game.muddrop.amount;
        game.stats.itemMuddrops += 1;
    }, 1.2, 0.8, {
        pluralname: "muddrops",
        onBottom: (me) => {
            me.image = "mudpuddle";
            me.y = 0.65;

            if (me.age > muddropUpgrades.puddling.getEffect() - 2) me.image = "mudpuddle2";
            if (me.age > muddropUpgrades.puddling.getEffect()) me.y = 2;
        }
    }),
};