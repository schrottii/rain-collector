scenes["settings"] = new Scene(
    () => {
        // Init
        createSquare("bgSquare1", 0, 0, 1, 0.9, "black");
        if (game.settings.bg) createImage("bgSquare2", 0, 0, 1, 0.9, "bgSettings");

        createText("header", 0.5, 0.06, "Settings", { size: 60, color: "white" });

        // Buttons
        createButton("sceneButton1", 0, 0.9, 1 / 3, 0.1, "button", () => { loadScene("stats") });
        createButton("sceneButton2", 0 + 1 / 3, 0.9, 1 / 3, 0.1, "button", () => { loadScene("achievements") });
        createButton("sceneButton3", 0 + 1 / 3 * 2, 0.9, 1 / 3, 0.1, "button", () => { loadScene("mainmenu") });

        createImage("sceneImage1", 1 / 6, 0.91, 0.08, 0.08, "stats", { quadratic: true, centered: true });
        createImage("sceneImage2", 1 / 6 * 3, 0.91, 0.08, 0.08, "achievements", { quadratic: true, centered: true });
        createImage("sceneImage3", 1 / 6 * 5, 0.91, 0.08, 0.08, "back", { quadratic: true, centered: true });

        // User
        createText("settingTextUser", 0.5, 0.1, "User", { color: "white", size: 32 });
        createText("userText1", 0.5, 0.15, "ID", { color: "white", size: 24 });
        createText("userText2", 0.5, 0.175, "Name", { color: "white", size: 24 });
        createText("userText3", 0.5, 0.2, "v", { color: "white", size: 24 });
        createButton("userNameChangeButton", 0.9, 0.1, 0.1, 0.1, "pencil", () => {
            game.name = prompt("New name?").substr(0, 16);
        }, { quadratic: true, centered: true })

        // Save Management
        createText("settingTextSave", 0.25, 0.3, "Savegame", { color: "white", size: 32 });

        createButton("saveButton1", 0.05, 0.325, 0.4, 0.05, "button", () => { importGame() });
        createText("saveButtonText1", 0.25, 0.325 + 0.05 * 0.66, "Import Save", { size: 24 });

        createButton("saveButton2", 0.05, 0.4, 0.4, 0.05, "button", () => { exportGame() });
        createText("saveButtonText2", 0.25, 0.4 + 0.05 * 0.66, "Export Save", { size: 24 });

        createButton("saveButton3", 0.05, 0.475, 0.4, 0.05, "button", () => { deleteGame() });
        createText("saveButtonText3", 0.25, 0.475 + 0.05 * 0.66, "Delete Save", { size: 24 });

        // Blatant Advertizing
        createText("settingTextBlatantAdvertizing", 0.75, 0.3, "More content", { color: "white", size: 32 });

        createButton("adButton1", 0.55, 0.325, 0.4, 0.05, "button", () => { window.open("https://discord.gg/e6W452uAmg") });
        createText("adButtonText1", 0.75, 0.325 + 0.05 * 0.66, "Join My Discord", { size: 24 });

        createButton("adButton2", 0.55, 0.4, 0.4, 0.05, "button", () => { window.open("https://ko-fi.com/schrottii") });
        createText("adButtonText2", 0.75, 0.4 + 0.05 * 0.66, "Donate", { size: 24 });

        createButton("adButton3", 0.55, 0.475, 0.4, 0.05, "button", () => { window.open("https://schrottii.github.io/") });
        createText("adButtonText3", 0.75, 0.475 + 0.05 * 0.66, "Play my other games!", { size: 24 });

        // Music
        createText("settingTextMusic", 0.25, 0.65, "Toggle Music", { color: "white", size: 32 });
        createButton("musicButton", 0.25, 0.7, 0.1, 0.1, "music", () => {
            game.settings.music = !game.settings.music;

            if (game.settings.music) wggjAudio.play();
            else wggjAudio.pause();
        }, { quadratic: true, centered: true });

        // Notation
        createText("settingTextNotation", 0.5, 0.675, "Notation: normal", { color: "white", size: 32 });
        createText("settingTextNotation2", 0.5, 0.695, "", { color: "white", size: 32 });
        createButton("notationButton", 0.5, 0.7, 0.1, 0.1, "notation", () => {
            switch (game.settings.notation) {
                case "normal":
                    game.settings.notation = "scientific";
                    break;
                case "scientific":
                    game.settings.notation = "engineering";
                    break;
                case "engineering":
                    game.settings.notation = "alphabet";
                    break;
                case "alphabet":
                    game.settings.notation = "normal";
                    break;
            }
        }, { quadratic: true, centered: true });

        // Background
        createText("settingTextBackground", 0.75, 0.65, "Toggle Background", { color: "white", size: 32 });
        createButton("backgroundButton", 0.75, 0.7, 0.1, 0.1, "background", () => {
            game.settings.bg = !game.settings.bg;
        }, { quadratic: true, centered: true });
    },
    (tick) => {
        // Loop
        objects["musicButton"].image = game.settings.music ? "music" : "musicoff";
        objects["backgroundButton"].image = game.settings.bg ? "background" : "backgroundoff";

        objects["userText1"].text = "ID: " + game.id.substr(0, 6);
        objects["userText2"].text = "Name: " + game.name;
        objects["userText3"].text = "Started in: " + game.startVer;

        objects["settingTextNotation"].text = "Notation: " + game.settings.notation;
        objects["settingTextNotation2"].text = "(" + fn(1e6) + ", " + fn(1e9) + ", " + fn(1e12) + ")";
    }
);