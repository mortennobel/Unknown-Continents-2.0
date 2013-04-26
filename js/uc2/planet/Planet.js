define(["kick", 'uc2/planet/Sun'],
    function (kick, Sun) {
        "use strict";

        /**
         * Planet class constructor function
         */
        return function () {

            var material,
                thisObj = this,
                planetScapeConfig,
                updateMaterial = function(){
                    if (material){
                        material.setUniform("mainColor", planetScapeConfig.planetColor || [1.0, 0.0, 0.9, 1.0]);
                    }
                };

            Object.defineProperties(this, {
                /**
                 * Allows usage of replacement material on camera rendering
                 * Default value is null.
                 * @property replacementMaterial
                 * @type kick.material.Shader
                 */
                config: {
                    set: function (newValue) {
                        planetScapeConfig = newValue;
                        updateMaterial();
                    }
                }
            });

            this.activated = function(){
                var meshRenderer = thisObj.gameObject.getComponentOfType(kick.scene.MeshRenderer);
                material = meshRenderer.material;
                updateMaterial();
            };
        }
    });