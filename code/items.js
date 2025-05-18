// Items
const maxItems = 9; // how many items you can have at once
var selectedItem = 0; // for the scene

// MAIN ITEM CLASS
// this is for the item definitions, the ones you can get - NOT the ones in your inventory
// there are OTHER classes for InventoryItem and ItemObject (rendering)
// methods are sorted by the same order as in constructor
class Item {
    constructor(ID, rarity, name, img, baseDurability, baseWorth, config) {
        this.ID = ID;
        this.rarity = rarity;
        this.name = name;
        this.img = img;
        this.baseDurability = baseDurability;
        this.baseWorth = baseWorth;
        this.config = config;
    }

    // CORE
    getConfig(name, falseReturn = false) {
        if (this.config == undefined || this.config[name] == undefined) return falseReturn;
        return this.config[name];
    }

    // ID
    isUnlocked() {
        if (!unlockedItems()) return false;

        for (let item in game.items.items) {
            if (game.items.items[item].id == this.ID) return true;
        }
        return false;
    }

    isEquipped() {
        return game.items.eqitems.includes(this.ID);
    }

    // RARITY
    getRarityName() {
        switch (this.rarity) {
            case 0:
                return "Unobtainable";
            case 1:
                return "Common";
            case 2:
                return "Uncommon";
            case 3:
                return "Rare";
            case 4:
                return "Epic";
        }
    }

    // DURABILITY

    // WORTH

    // CONFIG
    getBoost(currencyName, falseReturn = 0) {
        if (this.config == undefined || this.config.boosts == undefined) return falseReturn;

        let myBoost = 1;
        if (typeof (currencyName) == "string") myBoost = this.config.boosts[currencyName];
        else myBoost = this.config.boosts[Object.keys(this.config.boosts)[currencyName]];

        if (myBoost == undefined || isNaN(myBoost)) return falseReturn;
        else return ((myBoost - 1) * (this.randomWorth != undefined ? this.randomWorth : 1)) + 1;
    }

    getBoostName() {
        if (this.config == undefined || this.config.boosts == undefined) return "";
        return Object.keys(this.config.boosts)[0];
    }
}

// for items in your inventory
// game.items.items has these
// game.items.eqitems is just the IDs of the equipped items, something like { 12, 8, 14 }
class InventoryItem extends Item {
    constructor(itemID, randomDurability, randomWorth, uses, level) {
        super();
        this.itemID = itemID;
        this.randomDurability = randomDurability;
        this.randomWorth = randomWorth;
        this.uses = uses;
        this.level = level;

        let ogi /* OG item */ = items[itemID];
        this.ID = ogi.ID;
        this.rarity = ogi.rarity;
        this.name = ogi.name;
        this.img = ogi.img;
        this.baseDurability = ogi.baseDurability;
        this.baseWorth = ogi.baseWorth;
        this.config = ogi.config;
    }

    getInventoryID() {
        return game.items.items.indexOf(this);
    }

    // DURABILITY
    getDurability() {
        return Math.floor(this.baseDurability * this.randomDurability) + 5;
    }

    getRemainingDurability() {
        return this.getDurability() - this.uses;
    }

    renderDurability() {
        return this.getRemainingDurability() + "/" + this.getDurability() + " Durability";
    }

    reduceDurability() {
        this.uses++;

        if (this.uses >= this.getDurability()) {
            this.destroyItem();
            game.stats.itemsBroken++;
        }
    }

    destroyItem() {
        if (game.items.eqitems.includes(this.getInventoryID())) game.items.eqitems.splice(game.items.eqitems.indexOf(this.getInventoryID()), 1);
        game.items.items.splice(this.getInventoryID(), 1);
        if (selectedItem == this.getInventoryID()) selectedItem = 0;
    }

    // WORTH
    getWorth() {
        return Math.ceil((Math.ceil(this.baseWorth * this.randomWorth) + 3)
            * (this.getRemainingDurability() / this.getDurability()));
    }

    renderWorth() {
        return "Worth " + fn(this.getWorth());
    }
}

// this one is just for rendering
class ItemObject {
    constructor(x, y, type, nr) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.nr = nr;
    }

    getID() {
        let emptyItem = items[0].ID;
        try {
            switch (this.type) {
                case "equipped":
                    return game.items.eqitems[this.nr] != undefined ? game.items.items[game.items.eqitems[this.nr]].itemID : emptyItem;
                case "inventory":
                    return game.items.items[this.nr] != undefined ? game.items.items[this.nr].itemID : emptyItem;
                case "selected":
                    return game.items.items[selectedItem].itemID;
            }
        }
        catch (e) {
            return emptyItem;
        }
    }

    getInventoryID() {
        switch (this.type) {
            case "equipped":
                return game.items.eqitems[this.nr] != undefined ? game.items.eqitems[this.nr] : -1;
            case "inventory":
                return game.items.items[this.nr] != undefined ? this.nr : -1;
            case "selected":
                return Object.keys(game.items.items).indexOf("" + selectedItem);
        }
    }

    getItem() {
        return items[this.getID()];
    }

    me() {
        return "item" + this.x + "x" + this.y;
    }

    createObjects() {
        createButton(this.me() + "bg", this.x, this.y, 0.1, 0.1, "common", () => {
            if (this.getInventoryID() != -1) {
                selectedItem = this.getInventoryID();
            }
            else selectedItem = 0;
        }, { quadratic: true, centered: true });
        createImage(this.me() + "pic", this.x, this.y, 0.1, 0.1, "items/sword", { quadratic: true, centered: true });
        createSquare(this.me() + "bar", this.x - 0.05, this.y + 0.09, 0.1, 0.01, "black");
        createSquare(this.me() + "barfill", this.x - 0.05, this.y + 0.09, 0, 0.01, "red");
    }

    updateObjects() {
        //if (!this.getItem().isUnlocked()) return false;

        objects[this.me() + "bg"].image = this.getItem().getRarityName().toLowerCase();
        objects[this.me() + "pic"].image = this.getItem().img;
        if (this.getInventoryID() >= 0) objects[this.me() + "barfill"].w = 0.1 * (game.items.items[this.getInventoryID()].getRemainingDurability() / game.items.items[this.getInventoryID()].getDurability());
    }
}

/*
 * also relevant: save.js -> game.items.items (what you own) and game.items.eqitems (what you equipped)
 * items are not unique - like Artifacts in SC, where you can get each thing only once
 * here, you can have the same item multiple times, and it always has a different durability and worth
 */

// IMPORTANT ITEM RELATED FUNCTIONS
function getItem(itemID) {
    return items[itemID];
}

function unlockedItems() {
    return game.stats.totalGlowbles.gte(1000);
}

function equippedItem(inventoryID) {
    // check if an item is equipped
    for (let item in game.items.eqitems) {
        if (game.items.eqitems[item] == inventoryID) return true;
    }
    return false;
}

function getItemBoost(currencyName, consume = false) {
    // get the amount of how much a currency (or other thing) is boosted by the equipped items
    if (game.items.eqitems.length == 0) return 1;

    let amount = 1;

    for (let item in game.items.eqitems) {
        let thisItem = game.items.items[game.items.eqitems[item]];

        let amountBefore = amount;
        amount += thisItem.getBoost(currencyName, 0);
        if (consume && amountBefore != amount) {
            // Reduce durability, the item gets used
            thisItem.reduceDurability();
            game.stats.itemsUses++;
        }
    }

    return amount;
}

function rollRandomItemRarity(multi = 1) {
    /*
     * EPIC     - 1/256 chance
     * RARE     - 3/256 chance
     * UNCOMMON - 28/256 chance
     * COMMON   - 224/256 chance
     */

    let randy = Math.random() / multi;

    if (randy < 1 / 256) {
        // EPIC
        return 4;
    }
    else if (randy < 1 / 64) {
        // RARE
        return 3;
    }
    else if (randy < 1 / 8) {
        // UNCOMMON
        return 2;
    }
    else {
        // COMMON
        return 1;
    }
}

function awardItem(itemID) {
    // gives the player an item, based on it's ID. it's very direct
    // does not work if you are full
    if (game.items.items.length >= maxItems) return false;

    let rd = parseFloat((0.5 + Math.random()).toPrecision(3));
    let rw = parseFloat((0.5 + Math.random()).toPrecision(3));

    game.stats.itemsGained++;
    game.items.items.push(new InventoryItem(itemID, rd, rw, 0, 1));
}

function awardRandomItem(multi = 1) {
    // this picks a random item from a random rarity and gives it to the player
    let rarity = rollRandomItemRarity(multi);

    let availableItems = [];

    for (let item in items) {
        if (items[item].rarity == rarity) availableItems.push(item); // add the ID
    }

    let pickRandomItem = Math.floor(Math.random() * availableItems.length);

    //console.log(rarity, pickRandomItem, availableItems[pickRandomItem], availableItems);
    awardItem(availableItems[pickRandomItem]);
}

// ALL ITEMS
const items = [
    /*
    new Item(0, 0, "PlaceHolder", "items/sword", 10, 10, {
        boosts: { "raindrop": 2 }
    }),

    new Item(1, 0, "sydfsd", "switch", 10, 10, {
        boosts: { "raindrop": 2 }
    }),
    new Item(2, 1, "PlajgfjgceHolder", "pencil", 10, 10, {
        boosts: { "raindrop": 2 }
    }),
    */
    new Item(0, 0, "No item", "locked", 10, 10), // this one is the empty item, you can't get it normally

    new Item(1, 1, "Barrel", "items/barrel", 200, 3, {
        boosts: { "raindrop": 2 }
    }),

    new Item(2, 2, "Golden Barrel", "items/goldenbarrel", 150, 30, {
        boosts: { "raingold": 1.5 }
    }),

    new Item(3, 2, "Licky Tongue", "items/tongue", 80, 20, {
        boosts: { "raindrop": 5 }
    }),

    new Item(4, 3, "Golden Tongue", "items/goldentongue", 20, 40, {
        boosts: { "raingold": 3 }
    }),

    new Item(5, 1, "Bubble Sword", "items/sword", 160, 10, {
        boosts: { "bubble": 4 }
    }),

    new Item(6, 4, "Excalibur", "items/sword", 90, 50, {
        boosts: { "bubble": 64 }
    }),

    new Item(7, 2, "Glow Lantern", "items/lantern", 80, 10, {
        boosts: { "glowble": 2 }
    }),

    new Item(8, 3, "Wicked Shortglow", "items/lantern", 20, 20, {
        boosts: { "glowble": 4 }
    }),
];