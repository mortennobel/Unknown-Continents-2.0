define(["kick"],
    function (kick) {
    "use strict";

    return function (engine) {

        var scene = engine.activeScene;

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

        function buildPlanet(scene){
            var ballGO = scene.createGameObject({name: "Ball"});
            var ballMeshRenderer = new kick.scene.MeshRenderer();
            var planet_radius = 1;
            ballMeshRenderer.mesh = new kick.mesh.Mesh(
                {
                    dataURI: "kickjs://mesh/uvsphere/?slices=25&stacks=50&radius=" + planet_radius,
                    name: "Default object"
                });

            var shader = engine.project.load(engine.project.ENGINE_SHADER_SPECULAR);
            ballMeshRenderer.material = new kick.material.Material( {
                shader: shader,
                uniformData: {
                    mainColor: [1.0, 0.0, 0.9, 1.0],
                    mainTexture: engine.project.load(engine.project.ENGINE_TEXTURE_WHITE),
                    specularExponent: 50,
                    specularColor: [1, 1, 1, 1]
                }
            });
            ballGO.addComponent(ballMeshRenderer);
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
        buildPlanet(scene);
        buildLight(scene);
        var fullWindow = scene.createGameObject({name: "FullWindow"});
        fullWindow.addComponent(new kick.components.FullWindow());
    }
});