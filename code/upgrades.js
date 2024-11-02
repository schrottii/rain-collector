class Upgrade {
    constructor(currency, name, displayName, description, price, effect, maxLevel) {
        this.currency = currency;
        this.name = name;
        this.displayName = displayName;
        this.description = description;

        this.price = price;
        this.effect = effect;
        this.maxLevel = maxLevel;
    }

    me() {
        return this.currency + this.name;
    }

    getLevel() {
        return game[this.currency]["upgrades"][this.name];
    }

    getPrice(level = this.getLevel()) {
        return typeof (this.price) == "function" ? Math.floor(this.price(level)) : Math.floor(this.price);
    }

    getEffect(level = this.getLevel()) {
        return typeof (this.effect) == "function" ? this.effect(level) : this.effect;
    }

    getMaxLevel() {
        return this.maxLevel == 0 ? 9999999999999999999 : this.maxLevel;
    }

    getDescription(level = this.getLevel(), part = 1) {
        let baseDescription = typeof (this.description) == "function" ? this.description(level) : this.description;
        let charLength = isMobile() ? 48 : 80;

        if (part == 1) return baseDescription.length > charLength ? baseDescription.substr(0, baseDescription.substr(0, charLength).lastIndexOf(" ")) : baseDescription;
        if (part == 2) return baseDescription.length > charLength ? baseDescription.substr(baseDescription.substr(0, charLength).lastIndexOf(" ") + 1) : "";
        return "";
    }

    createObjects(index) {
        createSquare(this.me() + "bg", 0, 0.1 + index * 0.1, 1, 0.1, index % 2 == 0 ? "#560000" : "#A83F3F");
        createButton(this.me() + "button", 0.025, 0.1 + index * 0.1, 0.1, 0.1, "upgrades", () => {
            if (game[this.currency].amount >= this.getPrice() && this.getLevel() < this.getMaxLevel()) {
                game[this.currency].amount -= this.getPrice();
                game[this.currency].upgrades[this.name]++;

                if (this.name == "tempboost") {
                    game.watercoin.tempBoostTime = 60;
                }
                if (this.name == "superauto") {
                    game.watercoin.superAutoTime = 60;
                }
            }
        }, { quadratic: true });
        createImage(this.me() + "pic", 0.025, 0.1 + index * 0.1, 0.025, 0.025, "currencies/" + currencies[this.currency].image, { quadratic: true });
        createText(this.me() + "name", 0.275, 0.14 + index * 0.1, this.displayName, { color: "white", size: 40, align: "left" });
        createText(this.me() + "desc", 0.275, 0.18 + index * 0.1, this.getDescription(this.getLevel(), 1), { color: "white", size: 32, align: "left" });
        createText(this.me() + "desc2", 0.275, 0.20 + index * 0.1, this.getDescription(this.getLevel(), 2), { color: "white", size: 32, align: "left" });

        createText(this.me() + "level", 0.95, 0.14 + index * 0.1, "L", { color: "white", size: 40, align: "right" });
        createText(this.me() + "price", 0.95, 0.16 + index * 0.1, "0", { color: "white", size: 32, align: "right" });
    }

    updateObjects() {
        objects[this.me() + "level"].text = "L" + this.getLevel() + (this.maxLevel != 0 ? "/" + this.maxLevel : "");
        objects[this.me() + "price"].text = "Price: " + this.getPrice();

        objects[this.me() + "desc"].text = this.getDescription(this.getLevel(), 1);
        objects[this.me() + "desc2"].text = this.getDescription(this.getLevel(), 2);
    }
}

const raindropUpgrades = {
    worth: new Upgrade("raindrop", "worth", "Raindrop Worth", level => "Raindrops are worth more. Current worth: +" + level, level => 10 * Math.pow(level + 1, 1.08), level => level, 0),
    time: new Upgrade("raindrop", "time", "Raindrop Time", level => "Raindrops spawn more often. Current time: " + raindropUpgrades.time.getEffect(level).toFixed(2) + "s", level => 50 * Math.pow(level + 1, 1.16), level => (1 / ((level / 10) + 1)), 100),
    auto: new Upgrade("raindrop", "auto", "Raindrop Auto", level => level == 45 ? "hello elmendaL45(.2)" : ("Raindrops can be collected automatically. Chance: " + level + "%", level => 10 * Math.pow(level + 1, 1.16)), level => level, 50),
};

const watercoinUpgrades = {
    tempboost: new Upgrade("watercoin", "tempboost", "Temporary Boost", level => "Earn x" + watercoinUpgrades.tempboost.getEffect(level).toFixed(1) + " for 60 seconds. Effect increases every use. Does not stack. " + (game.watercoin.tempBoostTime > 0 ? game.watercoin.tempBoostTime.toFixed(1) + "/s60s" : ""), 4, level => 2 + (level / 5), 0),
    superauto: new Upgrade("watercoin", "superauto", "Super Auto", level => "Auto has a 100% collect rate for 60 seconds. Does not stack. " + (game.watercoin.superAutoTime > 0 ? game.watercoin.superAutoTime.toFixed(1) + "s/60s" : ""), 2, 1, 0),
}