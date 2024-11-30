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
        return this.unlock();
    }

    getAmount() {
        return game[name].amount;
    }

    getTime() {
        return game[name].time;
    }
}

function cc() {
    // returns current currency
    return currencies[game.selCur];
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
            objects["drop" + i].w = 0.1 * currencies[item].sizeMulti;
            objects["drop" + i].h = 0.1 * currencies[item].sizeMulti;


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
    raindrop: new Currency("raindrop", "raindrop", () => true, () => {
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
    watercoin: new Currency("watercoin", "watercoin", () => true, () => {
        game.watercoin.fill = 0;
        game.watercoin.fillNeeded += 5;

        let amount = 1;

        game.watercoin.amount = game.watercoin.amount.add(amount);
        game.stats.totalWatercoins = game.stats.totalWatercoins.add(amount);
        if (game.watercoin.amount > game.stats.mostWatercoins) game.stats.mostWatercoins = game.watercoin.amount;
        game.stats.itemWatercoins += 1;
    }, 1, 0.8),
    raingold: new Currency("raingold", "raingold", () => game.raindrop.amount > 1e4 || postPrestige[0] > 0 || game.raingold.amount > 0, () => {
        // if (postPrestige[0] < 1) return false;

        let amount = Math.ceil(postPrestige[1]);

        game.raingold.amount = game.raingold.amount.add(amount);
        game.stats.totalRaingold = game.stats.totalRaingold.add(amount);
        if (game.raingold.amount > game.stats.mostRaingold) game.stats.mostRaingold = game.raingold.amount;
        game.stats.itemRaingold += 1;

        game.watercoin.fill++;
    }, 1.2, 0.5)
};