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

const currencies = {
    raindrop: new Currency("raindrop", "raindrop", () => true, () => {
        let amount = game.raindrop.upgrades.worth + 1
            * (game.watercoin.tempBoostTime > 0 ? watercoinUpgrades.tempboost.getEffect() : 1);
        amount = Math.ceil(amount);

        game.raindrop.amount += amount;
        game.stats.totalRaindrops += amount;
        if (game.raindrop.amount > game.stats.mostRaindrops) game.stats.mostRaindrops = game.raindrop.amount;

        // temporary
        game.raindrop.amount = Math.ceil(game.raindrop.amount);
        game.stats.totalRaindrops = Math.ceil(game.stats.totalRaindrops);

        game.watercoin.fill++;
    }),
    watercoin: new Currency("watercoin", "watercoin", () => true, () => {
        game.watercoin.fill = 0;

        let amount = 1;

        game.watercoin.amount += amount;
        game.stats.totalWatercoins += amount;
        if (game.watercoin.amount > game.stats.mostWatercoins) game.stats.mostWatercoins = game.watercoin.amount;
    })
};