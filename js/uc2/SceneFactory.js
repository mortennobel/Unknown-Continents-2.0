define(["kick", 'uc2/planet/PlanetFactory',
        'text!shaders/webgl-noise/noise2D.glsl', 'text!shaders/webgl-noise/noise3D.glsl'
    ],
    function (kick, PlanetFactory, noise2D, noise3D) {
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
            };

        addCustomNoiseFunctionsToGLSL();

        function buildCamera(scene) {
            var cameraGO = scene.createGameObject({name: "Camera"});
            var camera = new kick.scene.Camera({
                fieldOfView: 60
            });
            camera.clearColor = [0.1, 0.1, 0.1, 1];
            cameraGO.addComponent(camera);
            var cameraTransform = cameraGO.transform;
            cameraTransform.localPosition = [-5.5, -5.5, 13.0];
            cameraTransform.localRotationEuler = [0, -40, 0];
        }

        function buildLight(scene){
            var lightGO = scene.createGameObject({name:"Light"}),
                light = new kick.scene.Light({
                    type: kick.scene.Light.TYPE_DIRECTIONAL,
                    color: [1.0, 1.0, 1.0]
                });
            lightGO.addComponent(light);
            lightGO.transform.localRotationEuler = [0,0,0];

            var lightAmbient = new kick.scene.Light({
                type: kick.scene.Light.TYPE_AMBIENT,
                color: [0.1,0.1,0.1]
            });
            lightGO.addComponent(lightAmbient);
        }

        buildCamera(scene);
        PlanetFactory.buildPlanet(scene);
        buildLight(scene);
        var fullWindow = scene.createGameObject({name: "FullWindow"});
        fullWindow.addComponent(new kick.components.FullWindow());
    }
});