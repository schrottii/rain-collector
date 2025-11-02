var weatherSecs = 0; // 5 minutes, so 0 - 300
var currentWeather = "rainy";
var strikeActive = false;
var strikeTicks = 0;

class Weather {
    constructor(name, displayName, worthMulti, fallSpeedMulti, spawnRateMulti) {
        this.name = name;
        this.displayName = displayName;
        this.worthMulti = worthMulti;
        this.fallSpeedMulti = fallSpeedMulti;
        this.spawnRateMulti = spawnRateMulti;
    }
}

const weathers = {
    rainy: new Weather("rainy", "Rainy", 1, 1, 1),
    sunny: new Weather("sunny", "Sunny", 3, 1, 0.3333),
    windy: new Weather("windy", "Windy", 1.5, 1.5, 1),
    thunder: new Weather("thunder", "Thunder", 1.5, 1, 1), // also has spawning thunder
    fog: new Weather("fog", "The Fog", 1.5, 1.25, 1.33) // also has opacity
}

function tickWeather(tick) {
    let weatherSecsNeeded = 300 / (isEaster() ? 3 : 1);

    if (currentWeather != "rainy") weatherSecs += tick;
    else weatherSecs += tick * getItemBoost("weatherspeed", true, tick);

    if (weatherSecs >= 30 && weatherSecs < weatherSecsNeeded && currentWeather != "rainy") {
        // go back to normal after 30s
        currentWeather = "rainy";
    }

    if (weatherSecs >= weatherSecsNeeded) {
        let randy = Math.random();

        /*
        if (randy >= 0.75) {
            currentWeather = "rainy";
        }
        */
        if (randy >= 3/4) {
            currentWeather = "sunny";
            game.stats.weathers++;
            game.stats.weatherSunny++;
        }
        else if (randy >= 2/4) {
            currentWeather = "windy";
            game.stats.weathers++;
            game.stats.weatherWindy++;
        }
        else if (randy >= 1/4) {
            currentWeather = "thunder";
            game.stats.weathers++;
            game.stats.weatherThunder++;
        }
        else {
            currentWeather = "fog";
            game.stats.weathers++;
            game.stats.weatherFog++;

            for (let o in objects) {
                if (o.substr(0, 4) == "drop") {
                    objects[o].alpha = 0.1 + 0.2 * Math.random();
                }
            }
        }

        weatherSecs = 0;
    }

    if (objects["weatherDisplay"] != undefined) {
        objects["weatherDisplay"].image = "weather-" + currentWeather;
        objects["weatherText"].text = "Weather: " + weathers[currentWeather].displayName;
        if (currentWeather != "rainy") objects["weatherBarFill"].w = 0.28 * (weatherSecs / 30);
        else objects["weatherBarFill"].w = 0.28 * (weatherSecs / weatherSecsNeeded);
    }

    // thunder (imagine)
    if (!strikeActive) {
        if (currentWeather == "thunder") {
            // no strike yet, weather is thunder, maybe create it
            if (Math.random() >= 0.99275) {
                strikeActive = true;
                strikeTicks = 0;

                if (objects["thunderStrike"] != undefined) {
                    objects["thunderStrike"].power = true;
                    objects["thunderStrike"].image = "thunder";
                }
            }
        }
    }
    else {
        // strike exists, so tick it
        strikeTicks++;

        // little animation
        if (strikeTicks >= 15) {
            if (objects["thunderStrike"] != undefined) objects["thunderStrike"].image = "thunder2";
        }
        if (strikeTicks >= 30) {
            strikeActive = false;

            if (objects["thunderStrike"] != undefined) {
                objects["thunderStrike"].image = "thunder";
                objects["thunderStrike"].power = false;

                // DESTRUCTION
                // isHit only covers a single point (for now) and not a bigger area so it is not suited here (yet)
                for (let item in fallingItems) {
                    if (
                        fallingItems[item].currentX() >= objects.thunderStrike.currentX() &&
                        fallingItems[item].currentX() + fallingItems[item].currentW() <= objects.thunderStrike.currentX() + objects.thunderStrike.currentW() &&
                        fallingItems[item].currentY() >= objects.thunderStrike.currentY() &&
                        fallingItems[item].currentY() + fallingItems[item].currentH() <= objects.thunderStrike.currentY() + objects.thunderStrike.currentH()
                    ) {
                        fallingItems[item].power = false;
                        //console.log("destroyed");
                    }
                }
            }
        }
    }
}