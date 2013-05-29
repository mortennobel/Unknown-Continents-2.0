define(["kick", "./Planet", 'uc2/util/Random','./Moon'],
    function (kick, Planet, Random, Moon) {
        "use strict";

        return function () {
            var gameObject,
                config,
                thisObj = this,
                moons = [],
                createMoonConfig = function (){
                    return {
                        size: Random.randomFloat(config.sizeFrom, config.sizeTo),
                        rotationSpeed: config.rotationSpeed,
                        color: [1.0, 1.0, 1.0, 1.0],
                        maxHeight: Random.randomFloat(config.heightFrom, config.heightTo),
                        showTexture: false,
                        iterations: 10
                    };
                },
                updateConfig = function () {
                    var i,
                        newGameObject,
                        moonComponent,
                        createMoons,
                        deleteMoons;
                    if (gameObject && config) {
                        createMoons = config.numberOfMoons > moons.length;
                        deleteMoons = config.numberOfMoons < moons.length;
                        if (createMoons) {
                            for (i = moons.length; i < config.numberOfMoons; i++) {
                                newGameObject = gameObject.scene.createGameObject();
                                moonComponent = new Moon();
                                moonComponent.config = createMoonConfig();
                                newGameObject.addComponent(moonComponent);
                                moons.push(moonComponent);
                            }
                        } else if (deleteMoons) {
                            while (moons.length > config.numberOfMoons) {
                                moonComponent = moons[moons.length-1];
                                moonComponent.gameObject.destroy();
                                moons.splice(moons.length-1, 1);
                            }
                        }
                        for (i = 0; i < moons.length; i++) {
                            moons[i].rotationOffset = i*Math.PI*2/moons.length;
                        }
                    }
                };

            this.activated = function () {
                gameObject = thisObj.gameObject;
                updateConfig();
            };

            Object.defineProperty(this, "config", {
                get: function () {
                    return config;
                },
                set: function (newValue) {
                    config = newValue;
                    updateConfig();
                }
            });
        };
        /*for (var i=0;i<planetScapeConfig.numberOfMoons;i++){
         var moonGameObject = scene.createGameObject();
         moon = new Moon();
         moon.config = planetScapeConfig.moon;
         moon.rotationOffset = 2*Math.PI*i/planetScapeConfig.numberOfMoons;
         moonGameObject.addComponent(moon);
         }
         */
    }
    );