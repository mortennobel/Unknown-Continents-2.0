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
                moonConfig,
                planet;

            this.rotationOffset = 0;

            /*
            this.planet = {
                    rotationSpeed: 0.05,
                    color: [1.0, 1.0, 1.0, 1.0],
                    maxHeight: 2.000,
                    showTexture: false,
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
                    if (planet){
                        planet.config = {
                            numberOfMoons: newValue.numberOfMoons,
                            rotationSpeed: 0.05,
                            color: [1.0, 1.0, 1.0, 1.0],
                            maxHeight: 2.000,
                            showTexture: false,
                            iterations: 10
                        };
                    }
                },
                get:function(){
                    return moonConfig;
                }
            });

            this.activated = function(){
                planet = new Planet();
                if (moonConfig){
                    planet.config = moonConfig;
                }
                thisObj.gameObject.addComponent(planet);
                thisObj.gameObject.transform.localScale = [0.1, 0.1, 0.1];
                var engine = kick.core.Engine.instance;
                time = engine.time;

            };

            this.update = function(){
                var pos = [distance*Math.sin(thisObj.rotationOffset + time.time * movementSpeed), 0, distance * Math.cos(thisObj.rotationOffset + time.time * movementSpeed)];
                thisObj.gameObject.transform.localPosition = pos;
            };
        }
    });