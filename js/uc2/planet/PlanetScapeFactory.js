define(['kick', 'uc2/planet/MakePlanetTexture', 'uc2/planet/PlanetScape',
    'text!shaders/planet_vs.glsl', 'text!shaders/planet_fs.glsl'],
    function (kick, MakePlanetTexture, PlanetScape, planet_vs, planet_fs) {
        "use strict";

        /**
         * Create a planet object
         * @class PlanetFactory
         */
        return {
            /**
             * @method buildPlanet
             * @param {kick.scene.Scene} scene
             * @param {PlanetScapeConfig} config
             * @return PlanetScape
             * @static
             */
            buildPlanet: function(scene, planetScapeConfig){
                planetScapeConfig = planetScapeConfig || {};

                var engine = kick.core.Engine.instance;
                var ballGO = scene.createGameObject({name: "Ball"});
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
                ballGO.addComponent(ballMeshRenderer);
                var planetScape = new PlanetScape();
                planetScape.config = planetScapeConfig;
                ballGO.addComponent(planetScape);
                return planetScape;
            }
        };
    });
