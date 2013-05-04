define(["kick", 'text!shaders/planet_composition_vs.glsl', 'text!shaders/planet_composition_fs.glsl'],
    function (kick, planet_vs, planet_fs) {
        "use strict";

        /**
         * Planet class constructor function
         */
        return function () {
            Object.defineProperties(this, {
                /**
                 * Allows usage of replacement material on camera rendering
                 * Default value is null.
                 * @property replacementMaterial
                 * @type kick.material.Shader
                 */
                config: {
                    set: function (newValue) {


                    }
                }
            });

            this.activated = function(){

            };

            this.update = function(){

            };
        }
    });