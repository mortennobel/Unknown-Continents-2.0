define(["kick", 'uc2/planet/Sun', 'uc2/planet/Planet','uc2/planet/Moon', 'uc2/planet/Atmosphere'],
    function (kick, Sun, Planet, Moon, Atmosphere) {
        "use strict";

        /**
         * PlanetScape constructor function
         * A planet scape is the scene except for the skybox
         */
        return function (scene, planetScapeConfig) {
            var sun,
                planet,
                moon,
                atmosphere;

            planetScapeConfig = planetScapeConfig || {};

            var planetGameObject = scene.createGameObject();
            planet = new Planet();
            planet.config = planetScapeConfig.planet;
            planetGameObject.addComponent(planet);

            var moonGameObject = scene.createGameObject();
            moon = new Moon();
            moon.config = planetScapeConfig.moon;
            moonGameObject.addComponent(moon);

            var sunGameObject = scene.createGameObject();
            sun = new Sun();
            sun.config = planetScapeConfig.sun;
            sunGameObject.addComponent(sun);
            sun.lightDirection = [100,0,0];

            var atmosphereGameObject = scene.createGameObject();
            atmosphere = new Atmosphere();
            atmosphere.config = planetScapeConfig.atmosphere;
            atmosphereGameObject.addComponent(atmosphere);
            /**
             * @property config
             * @type {PlanetConfig}
             */
            Object.defineProperties(this, {
                config: {
                    get: function () { return planetScapeConfig; },
                    set: function (newValue) {
                        planetScapeConfig = newValue;
                        sun.config = newValue.sun;
                        planet.config = newValue.planet;
                        atmosphere.config = planetScapeConfig.atmosphere ;
                    }
                }
             });
        };
    });
