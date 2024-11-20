class Currency {
    constructor(name, image, unlock, onCollect) {
        this.name = name;
        this.image = image;
        this.unlock = unlock;
        this.onCollect = onCollect;
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

const currencies = {
    raindrop: new Currency("raindrop", "raindrop", () => true, () => {
        let amount = (game.raindrop.upgrades.worth + 1)
            * (game.watercoin.tempBoostTime > 0 ? watercoinUpgrades.tempboost.getEffect() : 1)
            * (1 + game.raingold.amount / 100);
        amount = Math.ceil(amount);

        game.raindrop.amount += amount;
        game.stats.totalRaindrops += amount;
        if (game.raindrop.amount > game.stats.mostRaindrops) game.stats.mostRaindrops = game.raindrop.amount;

        game.watercoin.fill++;
    }),
    watercoin: new Currency("watercoin", "watercoin", () => true, () => {
        game.watercoin.fill = 0;

        let amount = 1;

        game.watercoin.amount += amount;
        game.stats.totalWatercoins += amount;
        if (game.watercoin.amount > game.stats.mostWatercoins) game.stats.mostWatercoins = game.watercoin.amount;
    }),
    raingold: new Currency("raingold", "raingold", () => game.raindrop.amount > 1e4 || game.raingold.amount > 0, () => {
        if (postPrestige[0] < 1) return false;

        let amount = Math.ceil(postPrestige[1]);

        game.raingold.amount += amount;
        game.stats.totalRaingold += amount;
        if (game.raingold.amount > game.stats.mostRaingold) game.stats.mostRaingold = game.raingold.amount;

        game.watercoin.fill++;
    })
};