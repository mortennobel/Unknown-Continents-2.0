define(["kick", 'uc2/planet/Sun', 'uc2/planet/Planet', 'uc2/planet/MakePlanetTexture',
    'text!shaders/planet_vs.glsl', 'text!shaders/planet_fs.glsl'],
    function (kick, Sun, Planet, MakePlanetTexture, planet_vs, planet_fs) {
        "use strict";

        /**
         * PlanetScape constructor function
         * A planet scape is the scene except for the skybox
         */
        return function (scene, planetScapeConfig) {
            var planetScapeConfig,
                sun;

            planetScapeConfig = planetScapeConfig || {};

            var engine = kick.core.Engine.instance;
            var planetGameObject = scene.createGameObject({name: "Ball"});
            var ballMeshRenderer = new kick.scene.MeshRenderer();
            var planet_radius = 1;
            var planet_texture = MakePlanetTexture(engine, 256, 256);
            ballMeshRenderer.mesh = new kick.mesh.Mesh(
                {
                    dataURI: "kickjs://mesh/uvsphere/?slices=25&stacks=50&radius=" + planet_radius,
                    name: "Default object"
                });

            var shader = new kick.material.Shader({
                vertexShaderSrc: planet_vs,
                fragmentShaderSrc: planet_fs
            });
            ballMeshRenderer.material = new kick.material.Material( {
                shader: shader,
                uniformData: {
                    mainTexture: planet_texture,
                    specularExponent: 50,
                    specularColor: [1, 1, 1, 1]
                }
            });
            planetGameObject.addComponent(ballMeshRenderer);
            var planet = new Planet();
            planet.config = planetScapeConfig;
            planetGameObject.addComponent(planet);


            var sunGameObject = scene.createGameObject();
            sun = new Sun();
            sun.config = planetScapeConfig;
            sunGameObject.addComponent(sun);
            sun.lightDirection = [100,0,0];

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
                        sun.config = newValue;
                        planet.config = newValue;
                    }
                }
             });
        };
    });
