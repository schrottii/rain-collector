function isChristmas() {
    if (game.stats.totalRaingold < 2000) return false;

    let currentDate = parseInt(today().substr(4));
    if (currentDate >= 1215 && currentDate <= 1228) return true;
    return false;
}

function isEaster() {
    if (game.stats.totalRaingold < 2000) return false;

    let currentDate = parseInt(today().substr(4));
    if (currentDate >= 415 && currentDate <= 428) return true;
    return false;
}

function spawnEgg() {
    if (objects["egg"] != undefined) {
        // Make it visible again
        objects["egg"].image = "egg";
        objects["egg"].power = true;
    }
    else {
        // Create the egg
        createButton("egg", -1, -1, 0.05, 0.05, "egg", () => {
            // Egg is clicked
            if (objects["egg"].power == false) return false;

            if (objects["egg"].image == "egg") {
                objects["egg"].image = "egg2";
            }
            else {
                objects["egg"].power = false;
                eggSecs = 0;
                eggSpawned = false;

                // Reward: +1 stat and 10 falling items
                for (i = 0; i < 10; i++) {
                    createFallingItem(game.selCur)
                }
                game.stats.eggs++;
            }
        }, { quadratic: true, centered: true });
    }

    eggSpawned = true;

    // Assign the egg a random position
    objects["egg"].x = Math.random() * 0.8 + 0.1;
    objects["egg"].y = Math.random() * 0.7 + 0.2;
}

var eggSecs = 0;
var eggSpawned = false;

function tickEggs(tick) {
    eggSecs += tick;

    if (eggSecs >= 15 && !eggSpawned) {
        spawnEgg();
    }
    else if (eggSecs >= 30 && eggSpawned) {
        if (objects["egg"] != undefined) objects["egg"].power = false;

        eggSecs = 0;
        eggSpawned = false;
    }
}