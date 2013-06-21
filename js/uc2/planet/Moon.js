define(["kick", "./Planet", 'uc2/util/Random'],
    function (kick, Planet, Random) {
        "use strict";

        /**
         * Moon class constructor function
         */
        return function () {
            var thisObj = this,
                time,
                movementSpeed = 0.0001,
                distance = 2.4,
                ellipse = 1.0,
                moonConfig,
                transform,
                planet,
                randomRotation,
                updateConfig = function () {
                    if (planet && moonConfig) {
                        planet.config = moonConfig;
                        thisObj.gameObject.transform.localScale = [moonConfig.size, moonConfig.size, moonConfig.size];
                        distance = moonConfig.distance;
                        ellipse = moonConfig.ellipse;
                    }
                };

            this.rotationOffset = 0;

            /*
            this.planet = {
                    rotationSpeed: 0.05,
                    color: [1.0, 1.0, 1.0, 1.0],
                    maxHeight: 2.000,
                    iterations: 10
                };

                this.atmosphere = {
                    color: [0.0, 0.0, 1.0, 0.5],
                    size: 0.01
                };

                this.moon = {
                    numberOfMoons: 3,
                    colorFrom: [1.0, 1.0, 1.0, 1.0],
                    colorTo: [1.0, 1.0, 1.0, 1.0],
                    heightFrom: 2.000,
                    heightTo: 2.000,
                    iterationsFrom: 2,
                    iterationsTo: 10
            *
            * */

            Object.defineProperty(this, "config", {
                set:function(newValue){
                    moonConfig = newValue;
                    updateConfig();
                },
                get:function(){
                    return moonConfig;
                }
            });

            this.activated = function(){
                randomRotation = Random.randomQuatRotation(-Math.PI/2,Math.PI/2);
                planet = new Planet();
                if (moonConfig){
                    planet.config = moonConfig;
                }
                thisObj.gameObject.addComponent(planet);
                transform = thisObj.gameObject.transform;
                thisObj.gameObject.name = "moon";
                var engine = kick.core.Engine.instance;
                time = engine.time;
                updateConfig();
            };

            this.update = function(){
                if (thisObj.gameObject){
                    var pos = [ellipse*distance*Math.sin(thisObj.rotationOffset + time.time * movementSpeed), 0, distance * Math.cos(thisObj.rotationOffset + time.time * movementSpeed)];
                    pos = kick.math.Vec3.transformQuat(pos, pos, randomRotation);
                    thisObj.gameObject.transform.localPosition = pos;
                }
            };
        }
    });