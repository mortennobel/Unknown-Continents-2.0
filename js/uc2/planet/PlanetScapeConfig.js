define(["kick"],
    function (kick) {
        "use strict";

        /**
         * Configuration class for a planet scape
         */
        return function () {
            var thisObj = this;
            /**
             * @property seed
             * @type {number}
             */
            this.seed = Math.random();

            /**
             *
             * @type {Array}
             */
            this.lightDirectionX = 1.0;
            this.lightDirectionY = 1.0;
            this.lightDirectionZ = 1.0;

            /**
             *
             * @type {*}
             */
            this.showLightDirection = debug;

            Object.defineProperties(this, {
                lightDirection:{
                    get:function(){
                        return [thisObj.lightDirectionX, thisObj.lightDirectionY, thisObj.lightDirectionZ];
                    }
                }
            });

            /**
             * @property planetColor
             * @type {Array}
             */
            this.planetColor = [0.9, 1.0, 0.2, 1.0];
        };
    });
