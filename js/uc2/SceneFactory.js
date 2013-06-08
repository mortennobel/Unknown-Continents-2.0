define(["kick", 'uc2/planet/PlanetScape','uc2/planet/DebugRotateComponent','uc2/planet/PlanetScapeConfig', 'uc2/Gui',
        'text!shaders/webgl-noise/noise2D.glsl', 'text!shaders/webgl-noise/noise3D.glsl', 'text!shaders/webgl-noise/noise4D.glsl',
        'text!shaders/cellular-noise/cellular2D.glsl','text!shaders/cellular-noise/cellular2x2.glsl','text!shaders/cellular-noise/cellular2x2x2.glsl','text!shaders/cellular-noise/cellular3D.glsl'
    ],
    function (kick, PlanetScape, DebugRotateComponent, PlanetScapeConfig, Gui, noise2D, noise3D, noise4D, cellular2D, cellular2x2, cellular2x2x2, cellular3D) {
    "use strict";

    return function () {
        var engine = kick.core.Engine.instance,
            scene = engine.activeScene,
            addCustomNoiseFunctionsToGLSL = function(){
                // allows other shaders to use noise functions when using the
                // #pragma include "noise2D.glsl"
                // or
                // #pragma include "noise3D.glsl"
                var glslConstants = kick.material.GLSLConstants;
                glslConstants["noise2D.glsl"] = noise2D;
                glslConstants["noise3D.glsl"] = noise3D;
                glslConstants["noise4D.glsl"] = noise4D;
                glslConstants["cellular2D.glsl"] = cellular2D;
                glslConstants["cellular2x2.glsl"] = cellular2x2;
                glslConstants["cellular2x2x2.glsl"] = cellular2x2x2;
                glslConstants["cellular3D.glsl"] = cellular3D;
            };

        addCustomNoiseFunctionsToGLSL();

        function buildCamera(scene) {
            var cameraGO = scene.createGameObject({name: "Camera"});
            var camera = new kick.scene.Camera({
                fieldOfView: 45
            });
            camera.clearColor = [0.1, 0.1, 0.1, 1];
            cameraGO.addComponent(camera);
            var cameraTransform = cameraGO.transform;
            cameraTransform.localPosition = [0, 0, 3.0];
            cameraTransform.localRotationEuler = [0, 0, 0];

            // build skybox
            var texture = new kick.texture.Texture({
                textureType: kick.core.Constants.GL_TEXTURE_CUBE_MAP,
                dataURI: "image/skybox.jpg"
            });
            var skyBox = new kick.scene.Skybox();
            skyBox.material = new kick.material.Material( {
                shader: engine.project.load(engine.project.ENGINE_SHADER_SKYBOX),
                uniformData: {
                    mainTexture: texture
                }
            });
            cameraGO.addComponent(skyBox);
            cameraGO.addComponent(new DebugRotateComponent());
        }

        buildCamera(scene);
        var planetConfig = new PlanetScapeConfig();
        var planetScape = new PlanetScape(scene, planetConfig);
        var gui = Gui.createGui(planetScape,planetConfig);
        var fullWindow = scene.createGameObject({name: "FullWindow"});
        fullWindow.addComponent(new kick.components.FullWindow());
    }
});