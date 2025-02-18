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
                awardRandomitem();
            }
        }, { quadratic: true, centered: true });

        // Buy Item
        createText("buyItemText", 0.5, 0.5, "Buy random item (50 Iron per)", { size: 60, color: "white" });
        createText("ironAmount", 0.5, 0.525, "", { size: 30, color: "white" });
        createButton("buyItem", 0.5, 0.55, 0.2, 0.2, "items/sword", () => {
            if (game.items.items.length < maxItems && game.items.iron >= 50) {
                game.items.iron -= 50;
                game.stats.itemsBought++;
                awardRandomitem(10);
            }
        }, { quadratic: true, centered: true });
    },
    (tick) => {
        // Loop

        // Daily
        if (game.items.items.length < maxItems && parseInt(game.items.freeItemTime) < parseInt(today())) objects["dailyItem"].image = "items/sword";
        else objects["dailyItem"].image = "collected";

        // Buy
        if (game.items.items.length < maxItems && game.items.iron >= 50) objects["buyItem"].image = "items/sword";
        else objects["buyItem"].image = "collected";


        objects["ironAmount"].text = game.items.iron + " Iron";
    }
);