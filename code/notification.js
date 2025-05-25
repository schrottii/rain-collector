function notification_Alert(title, text, image = "none") {
    let objs = ["Bg", "Bg2", "Button", "ButtonText", "Img", "Title", "Desc", "Desc2"];

    // Create objects
    if (objects["notifAlertBg"] == undefined) {
        createSquare("notifAlertBg", 0.15, 0.2, 0.7, 0.5, "#560000");
        createSquare("notifAlertBg2", 0.16, 0.21, 0.68, 0.48, "#470000");

        createButton("notifAlertButton", 0.5, 0.6, 0.22, 0.08, "button", () => {
            // Hide
            for (let o in objs) {
                objects["notifAlert" + objs[o]].power = false;
            }

            tutorialStep = true;
            if (tutorialActive) calcTutorial();
        }, { quadratic: true, centered: true });
        createText("notifAlertButtonText", 0.5, 0.6 + 0.08 * 0.66, "O K", { align: "center", color: "blak", size: 40 });

        createImage("notifAlertImg", 0.5, 0.375, 0.2, 0.2, "button", { centered: true, quadratic: true });

        createText("notifAlertTitle", 0.5, 0.275, "", { align: "center", color: "#01E5E5", size: 48 });
        createText("notifAlertDesc", 0.5, 0.325, "", { align: "center", color: "#01E5E5", size: 24 });
        createText("notifAlertDesc2", 0.5, 0.35, "", { align: "center", color: "#01E5E5", size: 24 });
    }

    // Show
    for (let o in objs){
        objects["notifAlert" + objs[o]].power = true;
    }

    // Insert content
    objects["notifAlertImg"].image = image != "none" ? image : "button";
    if (objects["notifAlertImg"].image == "button") objects["notifAlertImg"].power = false;

    objects["notifAlertTitle"].text = title;
    objects["notifAlertDesc"].text = text.length < 40 ? text : text.substr(0, text.substr(0, 40).lastIndexOf(" ") + 1);
    objects["notifAlertDesc2"].text = text.length < 40 ? "" : text.substr(text.substr(0, 40).lastIndexOf(" ") + 1);
}

function notification_Item(item) {
    notification_Alert("Item gained", item.name
        + " (" + item.getRarityName() + "): x"
        + fn(item.getBoost(0)) + " " + currencies[item.getBoostName()].renderName(true),
        item.img);
}

// TUTORIAL
var tutorialProgress = 0;
var tutorialActive = false;
var tutorialStep = false;
var tutorialShown = false;

var tutorial = [
    [() => true, "Welcome to Rain Collector!", "This little tutorial will explain the game's basics. Hover over the falling drops!", "currencies/raindrop"],
    [() => tutorialStep && game.raindrop.amount.gte(10), "10 drops, well done!", "Go to Upgrades and spend your 10 Raindrops.", "upgrades"],
    [() => tutorialStep && game.raindrop.upgrades.worth > 0, "Upgrade bought", "Here, currencies can be spent on various boosts, including auto collect."],
    [() => tutorialStep, "Water Coins", "Water Coins fall after collecting enough and can be spent on worldwide boosts.", "currencies/watercoin"],
    [() => tutorialStep, "Water Coins", "Keep playing until you get one!", "currencies/watercoin"],
    [() => tutorialStep && game.watercoin.amount.gte(1), "Settings & Stats", "Settings, Stats and more can be found there.", "stats"],
    [() => tutorialStep, "Achievements", "Achievements boost prestige currency and show you what to do.", "achievements"],
    [() => tutorialStep, "The Future", "Keep playing and you will unlock Prestige and new currencies!", "prestige"],
    [() => tutorialStep || getAchievementByID(21).isUnlocked(), "Tutorial complete!", "If you need more help, you can ask in DC or look at Achievements"],
    //[() => false, "", ""],
];

function calcTutorial(){
    // init after game start
    if (tutorialProgress == 0 && !tutorialActive){
        if (tutorial[tutorial.length - 1][0]() == true) tutorialActive = false;
        else tutorialActive = true;
    }

    // done
    if (tutorialProgress == tutorial.length - 1) {
        awardAchievement(21);
        tutorialActive = false;
    }

    // see how far you got
    for (let tu in tutorial){
        if (tu <= tutorialProgress){
            tutorialProgress = Math.max(tutorialProgress, tu);
        }
        else if (tutorial[tu][0]() == true) {
            tutorialProgress = Math.max(tutorialProgress, tu);
            tutorialStep = false;
            tutorialShown = false;
        }
        else {
            break; // no skipping allowed
        }
    }
    
    doTutorial();
}

function doTutorial(){
    if (!tutorialActive || tutorialShown) return false;
    if (tutorial[tutorialProgress][3] != undefined) notification_Alert(tutorial[tutorialProgress][1], tutorial[tutorialProgress][2], tutorial[tutorialProgress][3]);
    else notification_Alert(tutorial[tutorialProgress][1], tutorial[tutorialProgress][2]);
    tutorialShown = true;
}