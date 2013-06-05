define(["kick", 'uc2/util/Random'],
    function (kick, Random) {
        "use strict";

        /**
         * Configuration class for a planet scape
         */
        return function () {
            var thisObj = this,
                randomFloat = Random.randomFloat,
                randomInt = Random.randomInt;

            this.sun = {
                lightDirection: [1, 1, 1],
                ambientColor: [0.1, 0.1, 0.1],
                showLightDirection: debug
            };

            this.planet = {
                atmosphereColor: [0.0, 0.0, 1.0, 1.0],
                rotationSpeed: 0.05,
                color: [1.0, 1.0, 1.0, 1.0],
                maxHeight: 2.000,
                showTexture: false,
                iterations: 10
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
                thisObj.planet.atmosphereColor = thisObj.atmosphere.color;
                thisObj.planet.rotationSpeed = randomFloat(-0.05, 0.05);
                thisObj.planet.color = [randomFloat(0, 1, 0.2), randomFloat(0, 1, 0.2), randomFloat(0, 1, 0.2), 1];
                thisObj.planet.color = [randomFloat(0, 1, 0.2), randomFloat(0, 1, 0.2), randomFloat(0, 1, 0.2), 1];
                thisObj.planet.maxHeight = randomFloat(0, 5);
                thisObj.planet.iterations = randomInt(5, 10);

                // moon
                thisObj.moons.numberOfMoons = randomInt(0, 16, 2);
                thisObj.moons.colorFrom = [randomFloat(0, 0.1), randomFloat(0, 0.1), randomFloat(0, 0.1), 1];
                thisObj.moons.colorTo = [thisObj.moons.colorFrom[0] + randomFloat(0, 0.1),
                    thisObj.moons.colorFrom[0] + randomFloat(0, 0.1),
                    thisObj.moons.colorFrom[0] + randomFloat(0, 0.1), 1];
                thisObj.moons.heightFrom =  randomFloat(1.1, 1.5);
                thisObj.moons.heightTo =  randomFloat(1.5, 2.5);
                thisObj.moons.sizeFrom =  randomFloat(0.01, 0.05);
                thisObj.moons.sizeTo =  randomFloat(0.05, 0.1);
                thisObj.moons.iterationsFrom = randomInt(0, 5);
                thisObj.moons.iterationsTo = randomInt(5, 10);
                thisObj.moons.ellipseFrom = randomFloat(1, 1.3);
                thisObj.moons.ellipseTo = thisObj.moons.ellipseFrom + randomFloat(0, 1.0);
            };
        };
    });
