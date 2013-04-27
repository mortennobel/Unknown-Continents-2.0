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
                ambientColor: [1,1,1,1],
                showLightDirection: debug
            };

            this.planet = {
                color: [0.9, 1.0, 0.2, 1.0],
                showTexture: false
            };

        };
    });
