define(["kick", "./Planet"],
    function (kick, Planet) {
        "use strict";

        /**
         * Planet class constructor function
         */
        return function () {
            var thisObj = this,
                time,
                movementSpeed = 0.0001,
                distance = 2.4,
                moonConfig,
                planet;

            Object.defineProperty(this, "config", {
                set:function(newValue){
                    moonConfig = newValue;
                    if (planet){
                        planet.config = moonConfig;
                    }
                },
                get:function(){
                    return moonConfigM
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
                var pos = [distance*Math.sin(time.time * movementSpeed), 0, distance * Math.cos(time.time * movementSpeed)];
                thisObj.gameObject.transform.localPosition = pos;
            };
        }
    });