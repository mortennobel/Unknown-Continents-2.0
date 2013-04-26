define(["kick", 'text!shaders/planet_vs.glsl', 'text!shaders/planet_fs.glsl'],
    function (kick, planet_vs, planet_fs) {
        "use strict";

        /**
         * Planet class constructor function
         */
        return function () {

            var material,
                debugMaterial,
                thisObj = this,
                meshRenderer,
                planetScapeConfig,
                updateMaterial = function(){
                    if (material){
                        material.setUniform("mainColor", planetScapeConfig.color || [1.0, 0.0, 0.9, 1.0]);
                    }
                },
                makePlanetTexture = function () {
                    var engine = kick.core.Engine.instance;
                    return engine.project.load(engine.project.ENGINE_TEXTURE_WHITE);
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
                var engine = kick.core.Engine.instance;
                var scene = engine.activeScene;
                var planetGameObject = scene.createGameObject({name: "Ball"});
                var planetMeshRenderer = new kick.scene.MeshRenderer();
                var planet_radius = 1;
                var planet_texture = makePlanetTexture(engine, 256, 256);
                planetMeshRenderer.mesh = new kick.mesh.Mesh(
                    {
                        dataURI: "kickjs://mesh/uvsphere/?slices=25&stacks=50&radius=" + planet_radius,
                        name: "Default object"
                    });

                var shader = new kick.material.Shader({
                    vertexShaderSrc: planet_vs,
                    fragmentShaderSrc: planet_fs
                });
                material = new kick.material.Material( {
                    shader: shader,
                    uniformData: {
                        mainTexture: planet_texture,
                        specularExponent: 50,
                        specularColor: [1, 1, 1, 1]
                    }
                });
                planetMeshRenderer.material = material;
                planetGameObject.addComponent(planetMeshRenderer);

                updateMaterial();
            };
        }
    });