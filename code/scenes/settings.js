function newSettingUI(name, image, displayName, description, Y, onclick) {
    let me = "setting" + name;
    // every y is +0.2 because of the container
    createSquare(me + "bg", 0, Y + 0.21, 1, 0.098, "#07497C");
    createImage(me + "imgbg", 0.1, Y + 0.22, 0.08, 0.08, "button", { quadratic: true, centered: true });
    createButton(me + "img", 0.1, Y + 0.23, 0.06, 0.06, image, onclick, { quadratic: true, centered: true });

    createText(me + "title", 0.2, Y + 0.24, displayName, { align: "left", color: "#01E5E5", size: 56 });
    createText(me + "desc", 0.2, Y + 0.265, typeof (description) == "function" ? "" : description.length < 48 ? description : description.substr(0, description.substr(0, 48).lastIndexOf(" ") + 1), { align: "left", color: "#01E5E5", size: 30 });
    createText(me + "desc2", 0.2, Y + 0.295, typeof (description) == "function" ? "" : description.length < 48 ? "" : description.substr(description.substr(0, 48).lastIndexOf(" ") + 1), { align: "left", color: "#01E5E5", size: 30 });

    objects[me + "bg"].texter = description;
    objects["settingsContainer"].children.push(me + "bg", me + "title", me + "imgbg", me + "img", me + "desc", me + "desc2");
}

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
        createText("settingTextUser", 0.5, 0.1, "User", { color: "white", size: 40 });
        createText("userText1", 0.5, 0.125, "ID", { color: "white", size: 24 });
        createText("userText2", 0.5, 0.15, "Name", { color: "white", size: 24 });
        createText("userText3", 0.5, 0.175, "v", { color: "white", size: 24 });
        createButton("userNameChangeButton", 0.75, 0.075, 0.1, 0.1, "pencil", () => {
            game.name = prompt("New name?").substr(0, 16);
        }, { quadratic: true, centered: true })


        /* 
         * 
         * SETTINGS
         * 
         */
        createContainer("settingsContainer", 0, 0.25, 1, 0.55, { YScroll: true, YLimit: [0.0000000001, 1] }, [
            createText("settingTextSavefile", 0.5, 0.275, "Savefile", { color: "white", size: 40 }),
            createText("settingTextGameplay", 0.5, objects["settingTextSavefile"].y + 0.35, "Gameplay", { color: "white", size: 40 }),
            createText("settingTextDesign", 0.5, objects["settingTextGameplay"].y + 0.25, "Design", { color: "white", size: 40 }),
            createText("settingTextAudio", 0.5, objects["settingTextDesign"].y + 0.25, "Music & Audio", { color: "white", size: 40 }),
            createText("settingTextMore", 0.5, objects["settingTextAudio"].y + 0.15, "More", { color: "white", size: 40 }),
            // .y + 0.05 + 0.1 for every element
        ]);

        // SAVEFILE SETTINGS
        let yy = objects["settingTextSavefile"].y - 0.3;
        newSettingUI("export", "export", "Export Save", "Export this savefile", yy + 0.1, () => { exportGame() });
        newSettingUI("import", "import", "Import Save",  "Import a savefile", yy + 0.2, () => { importGame() });
        newSettingUI("delete", "delete", "Delete Save", "Delete this savefile (HARD RESET)", yy + 0.3, () => { deleteGame() });

        // GAMEPLAY SETTINGS
        yy = objects["settingTextGameplay"].y - 0.3;
        newSettingUI("notation", "notation", "Change notation", () => "Current: " + game.settings.notation + ". Changes number display " + "(" + fn(1e6) + ", " + fn(1e9) + ", " + fn(1e12) + ")", yy + 0.1, () => {
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
        });
        newSettingUI("menupause", "menupause", "Toggle Menu Pause", () => (game.settings.menupause ? "Enabled. " : "Disabled. ") + "Pause the main gameplay when in menus", yy + 0.2, () => {
            game.settings.menupause = !game.settings.menupause;
        });

        // DESIGN SETTINGS
        yy = objects["settingTextDesign"].y - 0.3;
        newSettingUI("background", "background", "Toggle Background", () => (game.settings.bg ? "Enabled. " : "Disabled. ") + "Turns all backgrounds black when disabled", yy + 0.1, () => {
            game.settings.bg = !game.settings.bg;
        });
        newSettingUI("font", "font", "Text Font", () => "Changes the appearance of texts. Current: " + ["Quicksand Bold (Default)", "Quicksand", "Birdland Aeroplane", "(System)"][game.settings.font], yy + 0.2, () => {
            game.settings.font = (game.settings.font + 1) % 4;
            updateFont();
        });

        // MUSIC & AUDIO SETTINGS
        yy = objects["settingTextAudio"].y - 0.3;
        newSettingUI("music", "music", "Toggle Music", () => (game.settings.music ? "Enabled. " : "Disabled. ") + "Turn music on or off", yy + 0.1, () => {
            game.settings.music = !game.settings.music;

            if (game.settings.music) wggjAudio.play();
            else wggjAudio.pause();
        });

        // BLATANT ADVERTIZING SETTINGS
        yy = objects["settingTextMore"].y - 0.3;
        newSettingUI("discord", "items/tongue", "Discord Server", "Join the Discord server for Rain Collector & my other games!", yy + 0.1, () => {
            window.open("https://discord.gg/e6W452uAmg");
        });
        newSettingUI("othergames", "luna32x32", "Other Games", "See my other games and projects!", yy + 0.2, () => {
            window.open("https://schrottii.github.io/");
        });
        newSettingUI("donate", "items/barrel", "Donate", "Reward me for my work via ko-fi!", yy + 0.3, () => {
            window.open("https://ko-fi.com/schrottii");
        });

        objects["settingsContainer"].YLimit[1] = yy + 0.4 - 0.55;

        createButton("donateButton", 0.3, 0.825, 0.4, 0.05, "button", () => { window.open("https://ko-fi.com/schrottii") });
        createText("donateButtonText", 0.5, 0.825 + 0.05 * 0.66, "Donate", { size: 40 });
    },
    (tick) => {
        // Loop
        // User
        objects["userText1"].text = "ID: " + game.id.substr(0, 6);
        objects["userText2"].text = "Name: " + game.name;
        objects["userText3"].text = "Started in: " + game.startVer;

        /*
        objects["musicButton"].image = game.settings.music ? "music" : "musicoff";
        objects["backgroundButton"].image = game.settings.bg ? "background" : "backgroundoff";
        objects["MPButton"].image = game.settings.menupause ? "background" : "backgroundoff";
        */

        // this could maybe be solved better
        let obj = undefined;
        for (let object in objects) {
            if (object.substr(-2) == "bg") obj = objects[object].texter;
            if (obj == undefined || typeof(obj) != "function") continue;
            obj = obj();

            objects[object.substr(0, object.length - 2) + "desc"].text = obj.substr(0, obj.substr(0, 48).lastIndexOf(" ") + 1);
            objects[object.substr(0, object.length - 2) + "desc2"].text = obj.substr(obj.substr(0, 48).lastIndexOf(" ") + 1);
        }
    }
);