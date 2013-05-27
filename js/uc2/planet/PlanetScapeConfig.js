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

            this.sun = {
                lightDirection: [1,1,1],
                ambientColor: [0.1,0.1,0.1],
                showLightDirection: debug
            };

            this.planet = {
                color: [1.0, 1.0, 1.0, 1.0],
                maxHeight: 2.000,
                showTexture: false
            };

            this.atmosphere = {
                color: [0.0, 0.0, 1.0, 0.5],
                size: 0.01
            };

            this.moon = {
                color: [1.0, 1.0, 1.0, 1.0],
                maxHeight: 2.000,
                showTexture: false
            };
        };
    });
