scenes["currencyselection"] = new Scene(
    () => {
        // Init
        createSquare("bgSquare1", 0, 0, 1, 0.9, "black");
        if (game.settings.bg) createImage("bgSquare2", 0, 0, 1, 0.9, "bgShop");
        createSquare("bgSquare3", 0, 0.9, 1, 0.1, "darkgray");

        createText("header", 0.5, 0.06, "Currency Selection", { size: 60, color: "white" });
        createText("header2", 0.5, 0.46, "Event Currencies", { size: 60, color: "white" });

        // Go back
        createClickable("backSquare", 0, 0.9, 1, 0.1, () => { loadScene("mainmenu") });
        createText("backText", 0.5, 0.975, "Go back", { color: "black", size: 40 });

        // Currencies
        currencies.raindrop.createObjects(0);
        currencies.bubble.createObjects(1);

        // Event
        currencies.snowflake.createObjects(4);
    },
    (tick) => {
        // Loop

        // Currencies
        currencies.raindrop.updateObjects(0);
        currencies.bubble.updateObjects(1);

        // Event
        currencies.snowflake.updateObjects(4);
    }
);