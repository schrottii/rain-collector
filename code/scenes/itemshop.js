scenes["itemshop"] = new Scene(
    () => {
        // Init
        createSquare("bgSquare1", 0, 0, 1, 0.9, "black");
        if (game.settings.bg) createImage("bgSquare2", 0, 0, 1, 0.9, "bgShop");

        createText("header", 0.5, 0.06, "Item Shop", { size: 60, color: "white" });

        // Go back
        createButton("backSquare", 0, 0.9, 1, 0.1, "button", () => { loadScene("itemselection") });
        createText("backText", 0.5, 0.9625, "Go back", { color: "black", size: 64 });
           
        // Daily Item
        createText("dailyItemText", 0.5, 0.2, "Free daily item", { size: 60, color: "white" });
        createButton("dailyItem", 0.5, 0.25, 0.2, 0.2, "items/sword", () => {
            if (game.items.items.length < maxItems && parseInt(game.items.freeItemTime) < parseInt(today())) {
                game.items.freeItemTime = today();
                game.stats.itemsDaily++;
                awardRandomItem();

                notification_Item(game.items.items[game.items.items.length - 1]);
            }
        }, { quadratic: true, centered: true });

        // Buy Item
        createText("buyItemText", 0.5, 0.65, "Buy random item (50 Iron)", { size: 60, color: "white" });
        createText("ironAmount", 0.5, 0.675, "", { size: 30, color: "white" });
        createImage("ironPic", 0.625, 0.65, 0.05, 0.05, "currencies/iron", { quadratic: true, centered: true });
        createButton("buyItem", 0.5, 0.7, 0.2, 0.2, "items/sword", () => {
            if (game.items.items.length < maxItems && game.iron.amount >= 50) {
                game.iron.amount = game.iron.amount.sub(50);
                game.stats.itemsBought++;
                awardRandomItem(10);

                notification_Item(game.items.items[game.items.items.length - 1]);
            }
        }, { quadratic: true, centered: true });
    },
    (tick) => {
        // Loop

        // Daily
        if (game.items.items.length < maxItems && parseInt(game.items.freeItemTime) < parseInt(today())) objects["dailyItem"].image = "items/sword";
        else objects["dailyItem"].image = "collected";

        // Buy
        if (game.items.items.length < maxItems && game.iron.amount >= 50) objects["buyItem"].image = "items/sword";
        else objects["buyItem"].image = "collected";


        objects["ironAmount"].text = game.iron.amount + " Iron";
    }
);