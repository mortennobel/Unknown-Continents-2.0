define(["kick", 'uc2/util/Random'],
    function (kick, Random) {
        "use strict";

        /**
         * Configuration class for a planet scape
         */
        return function () {
            var thisObj = this,
                randomFloat = Random.randomFloat,
                randomInt = Random.randomInt,
                randomElement = Random.randomElement;

            this.sun = {
                lightDirection: [1, 1, 1],
                ambientColor: [0.03, 0.03, 0.03],
                showLightDirection: debug
            };

            this.planet = {
                strategy: "diamondSquare",
                atmosphereColor: [0.0, 0.0, 1.0, 1.0],
                rotationSpeed: 0.05,
                maxHeight: 2.000,
                waterLevel: 0.2,
                colors: {
                    color0: [1,1,1,1],
                    color1: [1,1,1,1],
                    color2: [1,1,1,1],
                    color3: [1,1,1,1],
                    color4: [1,1,1,1],
                    color5: [1,1,1,1],
                    color6: [1,1,1,1],
                    colorStop0:0.2,
                    colorStop1:0.4,
                    colorStop2:0.6,
                    colorStop3:0.8
                },
                diamondSquare: {
                    iterations: 10
                },
                simplexWorley: {
                    scale: 20
                },
                cell:{
                    scale: 1.0,
                    scaleSmall: 1.0,
                    scaleXSmall: 1.0,
                    border: 0.1,
                    borderSmall: 0.2,
                    borderXSmall: 0.2,
                    heightPower:1
                }
            };

            this.atmosphere = {
                color: [0.0, 0.0, 1.0, 1.0],
                size: 0.3
            };

            this.moons = {
                numberOfMoons: 3,
                colorFrom: [0.1, 0.1, 0.1, 0.1],
                colorTo: [1.0, 1.0, 1.0, 1.0],
                heightFrom: 0.000,
                heightTo: 5.000,
                distanceFrom: 2,
                distanceTo: 2.4,
                sizeFrom:  0.01,
                sizeTo: 0.1,
                iterationsFrom: 2,
                iterationsTo: 7,
                ellipseFrom: 1.0,
                ellipseTo: 2.3
            };

            this.createRandom = function () {
                // atmosphere
                // makes blue more likely
                thisObj.atmosphere.color = [randomFloat(0, 1, 2), randomFloat(0, 1, 2), randomFloat(0, 1, 0.5), randomFloat(0.0, 1.0, 0.5)];
                thisObj.atmosphere.size = randomFloat(0.005, 0.3);

                // planet
                thisObj.planet.strategy = randomElement(["diamondSquare","simplex","worley", "cell"]);
                thisObj.planet.atmosphereColor = thisObj.atmosphere.color;
                thisObj.planet.rotationSpeed = randomFloat(-0.05, 0.05);
                thisObj.planet.waterLevel = randomFloat(0, 1);
                thisObj.planet.color = [randomFloat(0, 1, 0.2), randomFloat(0, 1, 0.2), randomFloat(0, 1, 0.2), 1];
                thisObj.planet.color = [randomFloat(0, 1, 0.2), randomFloat(0, 1, 0.2), randomFloat(0, 1, 0.2), 1];
                thisObj.planet.maxHeight = randomFloat(0, 5);
                thisObj.planet.diamondSquare.iterations = randomInt(5, 10);
                thisObj.planet.simplexWorley.scale = randomFloat(0.01, 50);
                thisObj.planet.cell.scale = randomFloat(0.2, 1.5);
                thisObj.planet.cell.scaleSmall = randomFloat(0.2, 1.5);
                thisObj.planet.cell.scaleXSmall = randomFloat(0.2, 1.5);
                thisObj.planet.cell.border = randomFloat(0.02, 0.1);
                thisObj.planet.cell.borderSmall = randomFloat(0.02, 0.2);
                thisObj.planet.cell.borderXSmall = randomFloat(0.02, 0.2);
                thisObj.planet.cell.heightPower = randomFloat(0.1, 2.0);

                thisObj.planet.colors.color0 = Random.randomColor();
                thisObj.planet.colors.color1 = Random.randomColor();
                thisObj.planet.colors.color2 = Random.randomColor();
                thisObj.planet.colors.color3 = Random.randomColor();
                thisObj.planet.colors.color4 = Random.randomColor();
                thisObj.planet.colors.color5 = Random.randomColor();
                thisObj.planet.colors.color6 = Random.randomColor();
                thisObj.planet.colors.colorStop2 = randomFloat(0.0, 1.0);
                thisObj.planet.colors.colorStop1 = randomFloat(0.0, thisObj.planet.colors.colorStop2);
                thisObj.planet.colors.colorStop0 = randomFloat(0.0, thisObj.planet.colors.colorStop1);
                thisObj.planet.colors.colorStop3 = randomFloat(thisObj.planet.colors.colorStop2, 1.0);

                // moon
                thisObj.moons.numberOfMoons = randomInt(0, 16, 2);
                thisObj.moons.colorFrom = [randomFloat(0, 0.1), randomFloat(0, 0.1), randomFloat(0, 0.1), 1];
                thisObj.moons.colorTo = [thisObj.moons.colorFrom[0] + randomFloat(0, 0.1),
                    thisObj.moons.colorFrom[0] + randomFloat(0, 0.1),
                    thisObj.moons.colorFrom[0] + randomFloat(0, 0.1), 1];
                thisObj.moons.heightFrom =  randomFloat(1.1, 1.5);
                thisObj.moons.heightTo =  randomFloat(1.5, 2.5);
                thisObj.moons.sizeFrom =  randomFloat(0.01, 0.05);
                thisObj.moons.sizeTo =  randomFloat(0.05, 0.2);
                thisObj.moons.iterationsFrom = randomInt(0, 5);
                thisObj.moons.iterationsTo = randomInt(5, 10);
                thisObj.moons.ellipseFrom = randomFloat(1, 1.3);
                thisObj.moons.ellipseTo = thisObj.moons.ellipseFrom + randomFloat(0, 1.0);
                //
                thisObj.sun.lightDirection = Random.randomDirection();

            };
            this.createRandom();
        };
    });
