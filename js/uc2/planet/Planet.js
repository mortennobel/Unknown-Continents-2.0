define(["kick"],
    function (kick) {
        "use strict";

        /**
         * Planet instance
         */
        return function () {
            var planetConfig,
                material,
                thisObj = this,
                updateMaterial = function(){
                    material.setUniform("mainColor", planetConfig.planetColor || [1.0, 0.0, 0.9, 1.0]);
                };

            /**
             * @property config
             * @type {PlanetConfig}
             */
            Object.defineProperties(this, {
                /**
                 * Allows usage of replacement material on camera rendering
                 * Default value is null.
                 * @property replacementMaterial
                 * @type kick.material.Shader
                 */
                config: {
                    get: function () { return planetConfig; },
                    set: function (newValue) {
                        planetConfig = newValue;
                        if (material){
                            updateMaterial();
                        }
                    }
                }
                });

            this.activated = function(){
                var meshRenderer = thisObj.gameObject.getComponentOfType(kick.scene.MeshRenderer);
                material = meshRenderer.material;
                updateMaterial();
            };
        };
    });
