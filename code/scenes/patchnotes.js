scenes["patchnotes"] = new Scene(
    () => {
        // Init
        createSquare("bgSquare1", 0, 0, 1, 0.9, "black");
        if (game.settings.bg) createImage("bgSquare2", 0, 0, 1, 0.9, "bgSettings");

        createContainer("notesContainer", 0, 0.15, 1, 0.6, {
            color: "black", YScroll: true, YLimit: [0.0000000001, 1]
        }, []);

        createText("header", 0.5, 0.06, "Patch notes", { size: 60, color: "white" });

        // Buttons
        createButton("sceneButton1", 0, 0.9, 1 / 3, 0.1, "button", () => { loadScene("achievements") });
        createButton("sceneButton2", 0 + 1 / 3, 0.9, 1 / 3, 0.1, "button", () => { loadScene("settings") });
        createButton("sceneButton3", 0 + 1 / 3 * 2, 0.9, 1 / 3, 0.1, "button", () => { loadScene("mainmenu") });

        createImage("sceneImage1", 1 / 6, 0.91, 0.08, 0.08, "achievements", { quadratic: true, centered: true });
        createImage("sceneImage2", 1 / 6 * 3, 0.91, 0.08, 0.08, "settings", { quadratic: true, centered: true });
        createImage("sceneImage3", 1 / 6 * 5, 0.91, 0.08, 0.08, "back", { quadratic: true, centered: true });

        // DYNAMIC Patch notes (start of main.js)
        let patchNotes = PATCHNOTES.split("\n");
        let linedNotes = [];
        let charactersPerLine = isMobile() ? 45 : 80;

        patchNotes.splice(0, 1);
        /*
        for (let note in patchNotes) {
            if (patchNotes[note] == "") patchNotes.splice(note, 1);
        }
        */

        for (let note in patchNotes) {
            let charactersMissing = Math.max(1, patchNotes[note].length);
            let charactersPushed = 0;

            while (charactersMissing > 0) {
                let charactersAdded = patchNotes[note].length - charactersPushed < charactersPerLine ? charactersPerLine : patchNotes[note].substr(charactersPushed, charactersPerLine).lastIndexOf(" ");
                if (charactersAdded == -1) charactersAdded = charactersMissing;

                linedNotes.push(patchNotes[note].substr(charactersPushed, charactersAdded));

                charactersMissing -= charactersAdded;
                charactersPushed += charactersAdded;
            }
        }

        let noteCount = 0;
        let noteSize = 0.032;

        for (noteCount = 0; noteCount < linedNotes.length; noteCount++) {
            let sizeBonus = linedNotes[noteCount].substr(0, 2) == "->" ? 1.25 : 1;
            createText("note" + noteCount, 0.015, 0.2 + noteSize * noteCount, linedNotes[noteCount], { align: "left", size: 32 * sizeBonus, color: "white" });
            objects["notesContainer"].children.push("note" + noteCount);
        }
        objects["notesContainer"].YLimit[1] = noteSize * noteCount - (0.6 - noteSize * 2);
    },
    (tick) => {
        // Loop
    }
);