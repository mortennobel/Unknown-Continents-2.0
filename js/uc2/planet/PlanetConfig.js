define(["kick"],
    function (kick) {
        "use strict";

        /**
         * Configuration class for planet
         */
        return function () {
            /**
             * @property seed
             * @type {number}
             */
            this.seed = Math.random();
        };
    });
