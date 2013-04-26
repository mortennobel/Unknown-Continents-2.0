define(["kick"],
    function (kick) {
        "use strict";

        /**
         * Configuration class for a planet scape
         */
        return function () {
            var thisObj = this,
                convertToArray = function(value){
                    if (Array.isArray(value)){
                        return value;
                    }
                    if (typeof value === "string" && value.charAt(0) === '#'){
                        return [(parseInt(value.substring(1), 16)>>16)%256,(parseInt(value.substring(1), 16)>>8)%256,(parseInt(value.substring(1), 16))%256,0];
                    }
                };
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
                lightDirection:{
                    get:function(){
                        return [thisObj.lightDirectionX, thisObj.lightDirectionY, thisObj.lightDirectionZ];
                    }
                },
                /**
                 * Allows usage of replacement material on camera rendering
                 * Default value is null.
                 * @property replacementMaterial
                 * @type kick.material.Shader
                 */
                planetColor256: {
                    get: function () {
                        return planetColor256;
                    },
                    set: function (value) {
                        planetColor256 = value;
                        value = convertToArray(value);
                        this.planetColor[0] = parseFloat(value[0]/255);
                        this.planetColor[1] = parseFloat(value[1]/255);
                        this.planetColor[2] = parseFloat(value[2]/255);
                        this.planetColor[3] = parseFloat(value[3]);
                    }
                }
            });
        };
    });
