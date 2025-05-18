var multiBuy = 1;
var economicBubbleBoost = 0;

class Upgrade {
    constructor(currency, name, displayName, description, price, effect, maxLevel, config) {
        this.currency = currency;
        this.name = name;
        this.displayName = displayName;
        this.description = description;

        this.price = price;
        this.cachedPriceDisplay = [0, false, 0];
        this.effect = effect;
        this.maxLevel = maxLevel;

        if (config) {
            this.config = config;
            if (config.unlock) this.unlock = config.unlock;
            if (config.onBuy) this.onBuy = config.onBuy;
        }
    }

    me() {
        return this.currency + this.name;
    }

    isUnlocked() {
        if (this.unlock == undefined) return true;
        return this.unlock();
    }

    canAfford(level = this.getLevel()) {
        return game[this.currency].amount.gte(this.getPrice());
    }

    getLevel() {
        return game[this.currency]["upgrades"][this.name];
    }

    getVisualPrice(level = this.getLevel()) {
        if (level == this.getMaxLevel()) {
            // upgrade is maxed
            return "MAX";
        }
        else if (this.cachedPriceDisplay[1] == true && this.cachedPriceDisplay[2] == multiBuy) {
            // the price display was cached, and multi buy or level haven't changed since, so return that
            return fn(this.cachedPriceDisplay[0]);
        }
        else {
            // recalculate
            let amount = new Decimal(0);

            if (multiBuy == 1) {
                // no multi buy, well, this is gonna be pretty easy
                amount = this.getPrice(level);
            }
            else {
                // calculate all multi buy levels
                for (let iLevel = level; iLevel < level + multiBuy && iLevel < this.getMaxLevel(); iLevel++) {
                    amount = amount.add(this.getPrice(iLevel));
                }
            }

            // set cache and return amount directly
            this.cachedPriceDisplay = [amount, true, multiBuy];
            return fn(amount);
        }
    }

    getVisualPriceColor(level = this.getLevel()) {
        if (!this.canAfford() || level == this.getMaxLevel()) {
            // red - can not afford
            return "#FF584C";
        }
        else if (multiBuy > 1 && this.canAfford() && game[this.currency].amount.lt(this.cachedPriceDisplay[0])) {
            // yellow - can afford at least one level, but not all (multi buy only)
            return "#FFFFC9";
        }
        else {
            // green - can afford
            return "#9BFF82";
        }
    }

    getPrice(level = this.getLevel()) {
        return typeof (this.price) == "function" ? Math.floor(this.price(level)) : Math.floor(this.price);
    }

    getEffect(level = this.getLevel()) {
        if (this.disabled) level = 0;
        return typeof (this.effect) == "function" ? this.effect(level) : this.effect;
    }

    getMaxLevel() {
        return this.maxLevel == 0 ? 9999999999999999999 : this.maxLevel;
    }

    isMaxed() {
        return this.getLevel() == this.getMaxLevel();
    }

    getDescription(level = this.getLevel(), part = 1) {
        let baseDescription = typeof (this.description) == "function" ? this.description(level) : this.description;
        let charLength = isMobile() ? 50 : 90;

        if (part == 1) return baseDescription.length > charLength ? baseDescription.substr(0, baseDescription.substr(0, charLength).lastIndexOf(" ")) : baseDescription;
        if (part == 2) return baseDescription.length > charLength ? baseDescription.substr(baseDescription.substr(0, charLength).lastIndexOf(" ") + 1) : "";
        return "";
    }

    createObjects(index) {
        createSquare(this.me() + "bg", 0, 0.1 + index * 0.1, 1, 0.1, index % 2 == 0 ? "#560000" : "#A83F3F");
        createSquare(this.me() + "bg2", 0, 0.15 + index * 0.1, 1, 0.05, index % 2 == 0 ? "#470000" : "#993A3A");

        if (!this.isUnlocked()) return false;
        createButton(this.me() + "button", 0.025, 0.1 + index * 0.1, 0.1, 0.1, "upgrades", () => {
            for (let i = 0; i < multiBuy; i++) {
                if (this.canAfford() && this.getLevel() < this.getMaxLevel()) {
                    // reduce currency amount
                    game[this.currency].amount = game[this.currency].amount.sub(this.getPrice());

                    // get a level, disable cache
                    game[this.currency].upgrades[this.name]++;
                    this.cachedPriceDisplay[1] = false;

                    if (this.onBuy) this.onBuy(this);
                }
            }
        }, { quadratic: true });
        createImage(this.me() + "pic", 0.025, 0.1 + index * 0.1, 0.025, 0.025, "currencies/" + currencies[this.currency].image, { quadratic: true });

        createText(this.me() + "name", 0.275, 0.13 + index * 0.1 + (isMobile() ? 0 : 0.01), this.displayName, { color: "white", size: 40, align: "left" });

        createText(this.me() + "desc", 0.275, 0.18 + index * 0.1, this.getDescription(this.getLevel(), 1), { color: "white", size: 24, align: "left" });
        createText(this.me() + "desc2", 0.275, 0.20 + index * 0.1, this.getDescription(this.getLevel(), 2), { color: "white", size: 24, align: "left" });

        createText(this.me() + "level", 0.97, 0.13 + index * 0.1 + (isMobile() ? 0 : 0.01), "L", { color: "white", size: 40, align: "right" });
        createText(this.me() + "price", 0.95, 0.15 + index * 0.1 + (isMobile() ? 0 : 0.01), "0", { color: "white", size: 32, align: "right" });
        createImage(this.me() + "price2", 0.95, 0.13 + index * 0.1 + (isMobile() ? 0 : 0.01), 0.02, 0.02, "currencies/" + currencies[this.currency].image, { quadratic: true });

        if (this.currency == "snowflake") createButton(this.me() + "disable", 0.975, 0.19 + index * 0.1, 0.025, 0.01, this.disabled ? "#FF584C" : "#9BFF82", () => {
            if (this.disabled == undefined || this.disabled == false) {
                this.disabled = true;
                objects[this.me() + "disable"].color = "#FF584C";
            }
            else {
                this.disabled = false;
                objects[this.me() + "disable"].color = "#9BFF82";
            }
        });
    }

    updateObjects() {
        if (!this.isUnlocked()) return false;
        objects[this.me() + "level"].text = "L" + this.getLevel() + (this.maxLevel != 0 ? "/" + this.maxLevel : "");
        objects[this.me() + "price"].text = this.getVisualPrice();
        objects[this.me() + "price"].color = this.getVisualPriceColor();

        objects[this.me() + "desc"].text = this.getDescription(this.getLevel(), 1);
        objects[this.me() + "desc2"].text = this.getDescription(this.getLevel(), 2);
    }
}

const raindropUpgrades = {
    worth: new Upgrade("raindrop", "worth", "Raindrop Worth", level => "Raindrops are worth more. Current worth: +" + level, level => 10 * Math.pow(level + 1, 1.08) * (level > 99 ? Math.pow(1.008, level - 99) : 1), level => level, 0),
    time: new Upgrade("raindrop", "time", "Raindrop Time", level => "Raindrops spawn more often. Current time: " + raindropUpgrades.time.getEffect(level).toFixed(2) + "s", level => 50 * Math.pow(level + 1, 1.16), level => (1 / ((level / 10) + 1)), 100),
    auto: new Upgrade("raindrop", "auto", "Raindrop Auto", level => "Raindrops can be collected automatically. Chance: " + level + "%", level => 10 * Math.pow(level + 1, 1.16), level => level, 50),
};

const watercoinUpgrades = {
    tempboost: new Upgrade("watercoin", "tempboost", "Temporary Boost", level => "Earn x" + watercoinUpgrades.tempboost.getEffect(level + 1).toFixed(1) + " for 30 seconds. Effect increases every use. Does not stack. " + (game.watercoin.tempBoostTime > 0 ? game.watercoin.tempBoostTime.toFixed(1) + "/30s" : ""), 4, level => 1.8 + (level / 5), 0, {
        onBuy: (upg) => {
            if (upg.name == "tempboost") {
                game.watercoin.tempBoostTime = 30;
            }
        }
    }),
    superauto: new Upgrade("watercoin", "superauto", "Super Auto", level => "Auto has a 100% collect rate for 30 seconds. Does not stack. " + (game.watercoin.superAutoTime > 0 ? game.watercoin.superAutoTime.toFixed(1) + "s/30s" : ""), 2, 1, 0, {
        onBuy: (upg) => {
            if (upg.name == "superauto") {
                game.watercoin.superAutoTime = 30;
            }
        }
    }),
    economicbubble: new Upgrade("watercoin", "economicbubble", "Economic Bubble", level => "Every falling currency collect is worth " + level + "% more (additive). 10% reset chance every collect. No auto.", level => 10 + 5 * level, level => level, 200, { unlock: () => currencies.bubble.isUnlocked() }),
    coinpop: new Upgrade("watercoin", "coinpop", "Coin Pop", level => (level / 20) + "% chance of Bubbles dropping a Water Coin after collected. No auto.", level => 4 + 2 * level, level => level / 20, 100, { unlock: () => currencies.glowble.isUnlocked() }),
};

const bubbleUpgrades = {
    worth: new Upgrade("bubble", "worth", "Bubble Worth", level => "Bubbles are worth more. Current worth: +" + level, level => 10 * Math.pow(level + 1, 1.06) * (level > 99 ? Math.pow(1.006, level - 99) : 1), level => level, 0),
    time: new Upgrade("bubble", "time", "Bubble Time", level => "Bubbles spawn more often. Current time: " + bubbleUpgrades.time.getEffect(level).toFixed(2) + "s", level => 40 * Math.pow(level + 1, 1.4), level => (2 / ((level / 10) + 1)), 25),
    auto: new Upgrade("bubble", "auto", "Bubble Auto", level => "Bubbles can be collected automatically. Chance: " + level + "%", level => 20 * Math.pow(level + 1, 1.4), level => level, 25),
};

const snowflakeUpgrades = {
    slowfall: new Upgrade("snowflake", "slowfall", "Slow Fall", level => "Everything falls slower during the Christmas Event. Slowdown: x" + (1 + level * 0.01), level => Math.floor(level / 10) + 1, level => isChristmas() ? 1 + level * 0.01 : 1, 400),
    freezedown: new Upgrade("snowflake", "freezedown", "Freeze Down", level => "Collecting during the Christmas Event can freeze all others for 0.5s. Chance: " + (level / 10) + "%", level => 8 * level + 8, level => isChristmas() ? level / 10 : 0, 40)
}

const glowbleUpgrades = {
    bigpop: new Upgrade("glowble", "bigpop", "Big Pop", level => "Big Bubbles are worth extra. x" + (1 + level * 0.1).toFixed(1), level => 10 + level * 10 * Math.pow(1.04, level), level => 1 + level * 0.1, 0),
    inflatedfall: new Upgrade("glowble", "inflatedfall", "Inflated Fall", level => "Adds a chance of big currencies falling (affected by Big Pop). Chance: " + (level * 0.1).toFixed(1) + "%", level => 10 + level * 10 * Math.pow(1.2, level), level => level * 0.1, 100),
}

const muddropUpgrades = {
    worth: new Upgrade("muddrop", "worth", "Muddrop Worth", level => "Muddrops are worth more. Current worth: +" + level, level => 25 * Math.pow(1.05, level), level => level, 0),
    auto: new Upgrade("muddrop", "auto", "Muddrop Auto", level => "Muddrops can be collected automatically. Chance: " + level + "%", level => 5 * Math.pow(level + 1, 2.5), level => level, 25),
    puddling: new Upgrade("muddrop", "puddling", "Muddrop Puddling", level => "Muddrops stay on the ground for longer. Lifespan: " + muddropUpgrades.puddling.getEffect(level).toFixed(2) + "s", level => 1000 * Math.pow(level + 1, 1.5), level => 5 + level, 55),
};