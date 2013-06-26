define(["kick", "./Planet", 'uc2/util/Random','./MoonSimple'],
    function (kick, Planet, Random, Moon) {
        "use strict";

        return function () {
            var gameObject,
                config,
                thisObj = this,
                moons = [],
                createMoonConfig = function (){
                    var res = {
                        size: Random.randomFloat(config.sizeFrom, config.sizeTo),
                        rotationSpeed: config.rotationSpeed,
                        color: Random.randomVec4(config.colorFrom, config.colorTo, 1, 1),
                        maxHeight: Random.randomFloat(config.heightFrom, config.heightTo),
                        waterLevel: Random.randomFloat(0, 1),
                        distance: Random.randomFloat(config.distanceFrom, config.distanceTo),
                        strategy: "DiamondSquare",
                        diamondsquare:{
                            iterations: Random.randomInt(config.iterationsFrom, config.iterationsTo),
                        },
                        surfaceScale: new Float32Array([
                            Random.randomFloat(config.surfaceScaleFrom, config.surfaceScaleTo),
                            Random.randomFloat(config.surfaceScaleFrom, config.surfaceScaleTo),
                            Random.randomFloat(config.surfaceScaleFrom, config.surfaceScaleTo),
                            Random.randomFloat(config.surfaceScaleFrom, config.surfaceScaleTo)
                        ]),
                        ellipse: Random.randomFloat(config.ellipseFrom, config.ellipseTo),
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
                        }
                    };
                    return res;
                },
                updateConfig = function () {
                    var i,
                        newGameObject,
                        moonComponent,
                        createMoons,
                        deleteMoons,
                        moonsCreated = 0;
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
                                moonsCreated++;
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
                            if (i< moons.length - moonsCreated){
                                moons[i].config = createMoonConfig();
                            }
                        }
                    }
                };

            this.activated = function () {
                gameObject = thisObj.gameObject;
                gameObject.name = "Moons";
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