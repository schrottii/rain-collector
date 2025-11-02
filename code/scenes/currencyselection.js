scenes["currencyselection"] = new Scene(
    () => {
        // Init
        createSquare("bgSquare1", 0, 0, 1, 0.9, "black");
        if (game.settings.bg) createImage("bgSquare2", 0, 0, 1, 0.9, "bgShop");

        createText("header", 0.5, 0.06, "Currency Selection", { size: 60, color: "white" });
        createText("header2", 0.5, 0.56, "Event Currencies", { size: 60, color: "white" });

        // Go back
        createButton("backSquare", 0, 0.9, 1, 0.1, "button", () => { audioPlaySound("click"); loadScene("mainmenu") });
        createText("backText", 0.5, 0.9625, "Go back", { color: "black", size: 64 });

        // Currencies
        currencies.raindrop.createObjects(0);
        currencies.bubble.createObjects(1);
        currencies.muddrop.createObjects(2);

        // Event
        currencies.snowflake.createObjects(5);
    },
    (tick) => {
        // Loop

        // Currencies
        currencies.raindrop.updateObjects(0);
        currencies.bubble.updateObjects(1);
        currencies.muddrop.updateObjects(2);

        // Event
        currencies.snowflake.updateObjects(5);
    }
);