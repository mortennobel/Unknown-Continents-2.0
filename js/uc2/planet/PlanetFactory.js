define(['kick', 'uc2/planet/MakePlanetTexture',
    'text!shaders/planet_vs.glsl', 'text!shaders/planet_fs.glsl'],
    function (kick, MakePlanetTexture, planet_vs, planet_fs) {
        "use strict";

        /**
         * Create a planet object
         * @class PlanetFactory
         */
        return {
            /**
             * @method buildPlanet
             * @param {kick.scene.Scene} scene
             * @static
             */
            buildPlanet: function(scene){
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
                        mainColor: [1.0, 0.0, 0.9, 1.0],
                        mainTexture: planet_texture,
                        specularExponent: 50,
                        specularColor: [1, 1, 1, 1]
                    }
                });
                ballGO.addComponent(ballMeshRenderer);
            }
        };
    });
