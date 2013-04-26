define(["kick", 'uc2/planet/Sun'],
    function (kick, Sun) {
        "use strict";

        /**
         * PlanetScape constructor function
         * A planet scape is the scene except for the skybox
         */
        return function (scene) {
            var planetScapeConfig,
                material,
                thisObj = this,
                updateMaterial = function(){
                    material.setUniform("mainColor", planetScapeConfig.planetColor || [1.0, 0.0, 0.9, 1.0]);
                },
                sunVisible = false,
                sun;

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
                    get: function () { return planetScapeConfig; },
                    set: function (newValue) {
                        planetScapeConfig = newValue;
                        if (material){
                            updateMaterial();
                            sun.showLightDirection = planetScapeConfig.showLightDirection;
                            sun.lightDirection = planetScapeConfig.lightDirection;
                        }
                    }
                }
                });

            this.activated = function(){
                var meshRenderer = thisObj.gameObject.getComponentOfType(kick.scene.MeshRenderer);
                material = meshRenderer.material;
                updateMaterial();
                var scene = thisObj.gameObject.scene;
                var gameObject = scene.createGameObject();
                sun = new Sun();
                gameObject.addComponent(sun);
                sun.lightDirection = [100,0,0];
            };
        };
    });
