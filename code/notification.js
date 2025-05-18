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