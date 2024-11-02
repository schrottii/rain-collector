scenes["settings"] = new Scene(
    () => {
        // Init
        createSquare("bgSquare1", 0, 0, 1, 0.9, "black");
        createSquare("bgSquare2", 0, 0.9, 1, 0.1, "darkgray");

        createText("header", 0.5, 0.06, "Settings", { size: 60, color: "white" });

        // Go back
        createClickable("bgSquare2", 0, 0.9, 1, 0.1, () => { loadScene("mainmenu") });
        createText("backText", 0.5, 0.975, "Go back", { color: "black", size: 40 });

        // User
        createText("settingTextUser", 0.5, 0.1, "User", { color: "white", size: 32 });
        createText("userText1", 0.5, 0.15, "ID", { color: "white", size: 24 });
        createText("userText2", 0.5, 0.2, "Name", { color: "white", size: 24 });
        createButton("userNameChangeButton", 0.9, 0.1, 0.1, 0.1, "pencil", () => {
            game.name = prompt("New name?").substr(0, 16);
        }, { quadratic: true, centered: true })

        // Save Management
        createText("settingTextSave", 0.5, 0.3, "Savegame", { color: "white", size: 32 });
        createButton("saveButton1", 0.3, 0.325, 0.4, 0.05, "button", () => { importGame() });
        createText("saveButtonText1", 0.5, 0.325 + 0.05 * 0.66, "Import Save", { size: 24 });
        createButton("saveButton2", 0.3, 0.4, 0.4, 0.05, "button", () => { exportGame() });
        createText("saveButtonText2", 0.5, 0.4 + 0.05 * 0.66, "Export Save", { size: 24 });

        // Blatant Advertizing
        createButton("adButton1", 0.05, 0.5, 0.4, 0.05, "button", () => { window.open("https://discord.gg/e6W452uAmg") });
        createText("adButtonText1", 0.25, 0.5 + 0.05 * 0.66, "Join My Discord", { size: 24 });
        createButton("adButton2", 0.55, 0.5, 0.4, 0.05, "button", () => { window.open("https://ko-fi.com/schrottii") });
        createText("adButtonText2", 0.75, 0.5 + 0.05 * 0.66, "Donate", { size: 24 });

        // Music
        createText("settingTextMusic", 0.2, 0.65, "Toggle Music", { color: "white", size: 32 });
        createButton("musicButton", 0.2, 0.7, 0.15, 0.15, "music", () => {
            game.settings.music = !game.settings.music;

            if (game.settings.music) wggjAudio.play();
            else wggjAudio.pause();
        }, { quadratic: true, centered: true });

        // Background
        createText("settingTextBackground", 0.8, 0.65, "Toggle Background", { color: "white", size: 32 });
        createButton("backgroundButton", 0.8, 0.7, 0.15, 0.15, "background", () => {
            game.settings.bg = !game.settings.bg;
        }, { quadratic: true, centered: true });
    },
    (tick) => {
        // Loop
        objects["musicButton"].image = game.settings.music ? "music" : "musicoff";
        objects["backgroundButton"].image = game.settings.bg ? "background" : "backgroundoff";

        objects["userText1"].text = "ID: " + game.id.substr(0, 6);
        objects["userText2"].text = "Name: " + game.name;
    }
);