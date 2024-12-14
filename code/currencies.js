class Currency {
    constructor(name, image, unlock, onCollect, sizeMulti, speedMulti) {
        this.name = name;
        this.image = image;
        this.unlock = unlock;
        this.onCollect = onCollect;

        this.sizeMulti = sizeMulti;
        this.speedMulti = speedMulti;
    }

    isUnlocked() {
        return this.unlock[0]();
    }

    isSelected() {
        return game.selCur == this.name;
    }

    getAmount() {
        return game[this.name].amount;
    }

    getTime() {
        return game[this.name].time;
    }

    renderName() {
        return this.name.substr(0, 1).toUpperCase() + this.name.substr(1);
    }

    upgrades() {
        switch (this.name) {
            case "raindrop":
                return raindropUpgrades;
            case "bubble":
                return bubbleUpgrades;
            case "snowflake":
                return snowflakeUpgrades;
            default:
                return raindropUpgrades;
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
            default:
                return 0;
        }
    }

    me() {
        return "cur" + this.name;
    }
     
    createObjects(index) {
        createSquare(this.me() + "bg", 0, 0.1 + index * 0.1, 1, 0.1, index % 2 == 0 ? "#560000" : "#A83F3F");
        createSquare(this.me() + "bg2", 0, 0.15 + index * 0.1, 1, 0.05, index % 2 == 0 ? "#470000" : "#993A3A");

        createButton(this.me() + "button", 0.025, 0.1 + index * 0.1, 0.1, 0.1, "switch2", () => {
            if (this.isUnlocked()) {
                game.selCur = this.name;
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
    }

    updateObjects() {
        //objects[this.me() + "level"].text = "L" + this.getLevel() + (this.maxLevel != 0 ? "/" + this.maxLevel : "");
        objects[this.me() + "name"].text = this.isUnlocked() ? this.renderName() : "???";
        objects[this.me() + "amount"].text = this.isUnlocked() ? fn(this.getAmount()) : "Locked";
        objects[this.me() + "pamount"].text = this.name == "raindrop" && currencies.raingold.isUnlocked() ? fn(currencies.raingold.getAmount()) : "";
        objects[this.me() + "pamount2"].image = this.name == "raindrop" && currencies.raingold.isUnlocked() ? "currencies/" + currencies["raingold"].image : "locked";

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
        if (objects["drop" + i].power == false) {
            objects["drop" + i].x = getFallingX();
            objects["drop" + i].y = -0.1;
            objects["drop" + i].w = objects["drop" + i].h = 0.1 * currencies[item].sizeMulti * (item == "bubble" ? Math.max(0.5, Math.random()) : 1);


            objects["drop" + i].image = "currencies/" + currencies[item].image;
            objects["drop" + i].currency = item;

            objects["drop" + i].autod = false;
            objects["drop" + i].power = true;
            break;
        }
    }
}

function clearFallingItems() {
    if (objects["drop4"] != undefined) {
        for (let i = 1; i <= 20; i++) {
            objects["drop" + i].power = false;
        }
    }
}

function getItemCur(index) {
    // returns the currency for an item, so its onClick, speed and other can be accessed
    return currencies[objects["drop" + index].currency];
}

const currencies = {
    raindrop: new Currency("raindrop", "raindrop", [() => true, "Unlocked"], () => {
        let amount = (game.raindrop.upgrades.worth + 1)
            * (game.watercoin.tempBoostTime > 0 ? watercoinUpgrades.tempboost.getEffect() : 1)
            * (1 + game.raingold.amount / 100);
        amount = Math.ceil(amount);

        game.raindrop.amount = game.raindrop.amount.add(amount);
        game.stats.totalRaindrops = game.stats.totalRaindrops.add(amount);
        if (game.raindrop.amount > game.stats.mostRaindrops) game.stats.mostRaindrops = game.raindrop.amount;
        game.stats.itemRaindrops += 1;

        game.watercoin.fill++;
    }, 1, 1),
    watercoin: new Currency("watercoin", "watercoin", [() => true, "Unlocked"], () => {
        game.watercoin.fill = 0;
        game.watercoin.fillNeeded += 5;

        let amount = 1;

        game.watercoin.amount = game.watercoin.amount.add(amount);
        game.stats.totalWatercoins = game.stats.totalWatercoins.add(amount);
        if (game.watercoin.amount > game.stats.mostWatercoins) game.stats.mostWatercoins = game.watercoin.amount;
        game.stats.itemWatercoins += 1;
    }, 1, 0.8),
    raingold: new Currency("raingold", "raingold", [() => game.raindrop.amount >= 1e4 || postPrestige[0] > 0 || game.raingold.amount >= 1, "1000 Raindrops"], () => {
        // if (postPrestige[0] < 1) return false;

        let amount = Math.ceil(postPrestige[1]);

        game.raingold.amount = game.raingold.amount.add(amount);
        game.stats.totalRaingold = game.stats.totalRaingold.add(amount);
        if (game.raingold.amount > game.stats.mostRaingold) game.stats.mostRaingold = game.raingold.amount;
        game.stats.itemRaingold += 1;

        game.watercoin.fill++;
    }, 1.2, 0.5),
    bubble: new Currency("bubble", "bubble", [() => game.raingold.amount >= 2000, "2000 Raingold"], (item) => {
        let amount = (game.bubble.upgrades.worth
            * item.w * 10)
            + 1;
        amount = Math.ceil(amount);

        game.bubble.amount = game.bubble.amount.add(amount);
        game.stats.totalBubbles = game.stats.totalBubbles.add(amount);
        if (game.bubble.amount > game.stats.mostBubbles) game.stats.mostBubbles = game.bubble.amount;
        game.stats.itemBubbles += 1;
    }, 1.4, 0.33),
    snowflake: new Currency("snowflake", "snowflake", [() => isChristmas(), "Christmas & 2000 Raingold"], () => {
        let amount = 1;

        game.snowflake.amount = game.snowflake.amount.add(amount);
        game.stats.totalSnowflakes = game.stats.totalSnowflakes.add(amount);
        if (game.snowflake.amount > game.stats.mostSnowflakes) game.stats.mostSnowflakes = game.snowflake.amount;
        game.stats.itemSnowflakes += 1;
    }, 1, 0.6),
};