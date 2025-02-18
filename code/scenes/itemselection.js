var renderItems = [];

scenes["itemselection"] = new Scene(
    () => {
        // Init
        createSquare("bgSquare1", 0, 0, 1, 0.9, "black");
        if (game.settings.bg) createImage("bgSquare2", 0, 0, 1, 0.9, "bgShop");

        createText("header", 0.5, 0.06, "Items", { size: 60, color: "white" });

        // Go back
        createButton("backSquare", 0, 0.9, 1, 0.1, "button", () => { loadScene("mainmenu") });
        createText("backText", 0.5, 0.9625, "Go back", { color: "black", size: 64 });

        // Claim / Shop
        createButton("shopSquare", 0.8, 0.05, 0.05, 0.05, "button", () => { loadScene("itemshop") }, { quadratic: true });
        createImage("shopImage", 0.8, 0.05, 0.05, 0.05, "items/sword", { quadratic: true });

        // Equipped Items
        createText("header2", 0.5, 0.11, "Equipped Items", { size: 30, color: "white", noScaling: true });
        createSquare("square1", 0.1, 0.12, 0.8, 0.12, "black");

        let itemCreateCounter = 0;
        for (let i = 0.25; i <= 0.75; i += 0.25) {
            renderItems.push(new ItemObject(i, 0.13, "equipped", itemCreateCounter));
            itemCreateCounter++;
        }

        // Inventory (3 rows)
        createText("header3", 0.5, 0.29, "Item Inventory", { size: 30, color: "white", noScaling: true });
        createSquare("square2", 0.1, 0.30, 0.8, 0.36, "black");

        itemCreateCounter = 0;
        for (let j = 0.31; j <= 0.55; j += 0.12) {
            for (let i = 0.25; i <= 0.75; i += 0.25) {
                renderItems.push(new ItemObject(i, j, "inventory", itemCreateCounter));
                itemCreateCounter++;
            }
        }

        // What Am I Looking At
        createText("header4", 0.5, 0.70, "Selected Item Info", { size: 30, color: "white", noScaling: true });
        createSquare("square3", 0.1, 0.71, 0.8, 0.15, "black");

        renderItems.push(new ItemObject(0.2, 0.735, "selected", 0));
        createText("selItemName", 0.31, 0.73, "", { size: 40, color: "white", align: "left" });
        createText("selItemDurability", 0.31, 0.76, "", { size: 40, color: "white", align: "left" });
        createText("selItemWorth", 0.31, 0.79, "", { size: 40, color: "white", align: "left" });
        createText("selItemBoostType", 0.31, 0.82, "", { size: 40, color: "white", align: "left" });
        createText("selItemBoostAmount", 0.31, 0.85, "", { size: 40, color: "white", align: "left" });
        createText("selItemInventoryID", 0.875, 0.73, "", { size: 40, color: "white", align: "right" });
        createText("selItemRarity", 0.875, 0.75, "", { size: 40, color: "white", align: "right" });

        createButton("selItemSell", 0.65, 0.78, 0.25, 0.04, "button", () => {
            if (game.items.items.length < 1) return false;
            let amount = game.items.items[selectedItem].getWorth();

            game.items.iron += amount;
            game.stats.totalIron += amount;
            if (game.items.iron > game.stats.mostIron) game.stats.mostIron = game.items.iron;

            game.stats.itemsSold++;
            game.items.items[selectedItem].destroyItem();
        });
        createText("selItemSellText", 0.775, 0.81, "Sell", { size: 40, color: "black", align: "center" });

        createButton("selItemEquip", 0.65, 0.82, 0.25, 0.04, "button", () => {
            if (!equippedItem(selectedItem)) {
                // Equip
                if (game.items.eqitems.length < 3) game.items.eqitems.push(selectedItem);
            }
            else {
                // Unequip
                game.items.eqitems.splice(game.items.eqitems.indexOf(selectedItem), 1);
            }
        });
        createText("selItemEquipText", 0.775, 0.85, "", { size: 40, color: "black", align: "center" });

        // generate all the items
        for (let renderItem in renderItems) {
            renderItems[renderItem].createObjects();
        }
    },
    (tick) => {
        // Loop
        for (let renderItem in renderItems) {
            renderItems[renderItem].updateObjects();
        }

        // Selected Item
        let item = game.items.items[selectedItem];
        if (item == undefined) return false;

        objects["selItemName"].text = item.name;
        //objects["selItemRarity"].text = item.getRarityName();
        objects["selItemDurability"].text = item.renderDurability();
        objects["selItemWorth"].text = item.renderWorth();

        if (item.getBoostName() != "") {
            objects["selItemBoostType"].text = "x" + fn(item.getBoost(0));
            objects["selItemBoostAmount"].text = currencies[item.getBoostName()].renderName(true);
            objects["selItemRarity"].text = item.getRarityName();
        }
        else {
            objects["selItemBoostType"].text = "";
            objects["selItemBoostAmount"].text = "";
            objects["selItemRarity"].text = "";
        }

        objects["selItemEquipText"].text = !equippedItem(item.getInventoryID()) ? "Equip" : "Unequip";
        objects["selItemEquip"].power = item.itemID != 0;
        objects["selItemEquipText"].power = item.itemID != 0;
        objects["selItemInventoryID"].text = (item.getInventoryID() + 1) + "/" + game.items.items.length;
    }
);