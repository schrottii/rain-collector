var statNames = ["Play Time", "Prestiges", "Total Raindrops", "Most Raindrops", "Collected Raindrops", "Total Water Coins", "Most Water Coins", "Collected Water Coins", "Total Raingold", "Most Raingold", "Collected Raingold", "Total Bubbles", "Most Bubbles", "Collected Bubbles", "Total Snowflakes", "Most Snowflakes", "Collected Snowflakes"];

scenes["stats"] = new Scene(
    () => {
        // Init
        createSquare("bgSquare1", 0, 0, 1, 0.9, "black");
        createSquare("bgSquare2", 0, 0.9, 1, 0.1, "darkgray");

        createText("header", 0.5, 0.06, "Stats", { size: 60, color: "white" });
        createText("userName", 0.5, 0.1, "", { size: 48, color: "white" });
        createText("userID", 1, 0.1, "", { size: 30, color: "white", align: "right" });

        // Buttons
        createButton("sceneButton1", 0, 0.9, 1 / 3, 0.1, "button", () => { loadScene("achievements") });
        createButton("sceneButton2", 0 + 1 / 3, 0.9, 1 / 3, 0.1, "button", () => { loadScene("settings") });
        createButton("sceneButton3", 0 + 1 / 3 * 2, 0.9, 1 / 3, 0.1, "button", () => { loadScene("mainmenu") });

        createImage("sceneImage1", 1 / 6, 0.91, 0.08, 0.08, "achievements", { quadratic: true, centered: true });
        createImage("sceneImage2", 1 / 6 * 3, 0.91, 0.08, 0.08, "settings", { quadratic: true, centered: true });
        createImage("sceneImage3", 1 / 6 * 5, 0.91, 0.08, 0.08, "back", { quadratic: true, centered: true });

        // Stats
        for (let statCount = 0; statCount < 17; statCount++) {
            createText("stat" + statCount, 0.2, 0.2 + 0.032 * statCount, "...", { align: "left", size: 32, color: "white" });
        }
    },
    (tick) => {
        // Loop
        objects["userName"].text = game.name;
        objects["userID"].text = "(ID: " + game.id.substr(0, 6) + ") ";

        for (let statCount = 0; statCount < 17; statCount++) {
            if (statCount == 0) objects["stat" + statCount].text = statNames[statCount] + ": " + Math.floor(game.stats[Object.keys(game.stats)[statCount]] / 1000 / 60 / 60) + " hours " + Math.floor(game.stats[Object.keys(game.stats)[statCount]] / 1000 / 60 % 60) + " minutes";
            else objects["stat" + statCount].text = statNames[statCount] + ": " + fn(game.stats[Object.keys(game.stats)[statCount]]);
        }
    }
);