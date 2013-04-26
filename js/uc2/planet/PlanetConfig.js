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

            /**
             * @property planetColor
             * @type {Array}
             */
            this.planetColor = [0.9, 1.0, 0.2, 1.0];

            //dat.gui only accept colors in the range 0 - 255, we need them in 0-1.
            var planetColor256 = [];
            planetColor256[0] = this.planetColor[0] * 255;
            planetColor256[1] = this.planetColor[1] * 255;
            planetColor256[2] = this.planetColor[2] * 255;
            planetColor256[3] = this.planetColor[3];
            Object.defineProperties(this, {
                /**
                 * Allows usage of replacement material on camera rendering
                 * Default value is null.
                 * @property replacementMaterial
                 * @type kick.material.Shader
                 */
                planetColor256: {
                    get: function () { return planetColor256; },
                    set: function (value) {
                        planetColor256 = value;
                        this.planetColor[0] = planetColor256[0]/255;
                        this.planetColor[1] = planetColor256[1]/255;
                        this.planetColor[2] = planetColor256[2]/255;
                        this.planetColor[3] = planetColor256[3];
                    }
                }
            });
        };
    });
