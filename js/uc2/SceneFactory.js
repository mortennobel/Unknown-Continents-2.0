define(["kick", 'uc2/planet/LookAtTarget','uc2/planet/PlanetScape','uc2/planet/DebugRotateComponent','uc2/planet/PlanetScapeConfig', 'uc2/Gui',
        'text!shaders/webgl-noise/noise2D.glsl', 'text!shaders/webgl-noise/noise3D.glsl', 'text!shaders/webgl-noise/noise4D.glsl',
        'text!shaders/cellular-noise/cellular2D.glsl','text!shaders/cellular-noise/cellular2x2.glsl','text!shaders/cellular-noise/cellular2x2x2.glsl','text!shaders/cellular-noise/cellular3D.glsl'
    ],
    function (kick, LookAtTarget, PlanetScape, DebugRotateComponent, PlanetScapeConfig, Gui, noise2D, noise3D, noise4D, cellular2D, cellular2x2, cellular2x2x2, cellular3D) {
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
                fieldOfView: 45,
                near: 0.01,
                far: 100
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
            cameraGO.addComponent(new LookAtTarget());
            //cameraGO.addComponent(new DebugRotateComponent());

            var m_PositionCurves = [{"time":0,"value":[-3,0,0.0136170387],"inSlope":[0.164600462,0,-0.071485959],"outSlope":[0.164600462,0,-0.071485959],"tangentMode":-559038737},{"time":10,"value":[-1.35399544,0,-0.701242566],"inSlope":[0.105994768,0,0.0409744345],"outSlope":[0.105994768,0,0.0409744345],"tangentMode":-559038737},{"time":20,"value":[-0.880104661,0,0.833105743],"inSlope":[0.0677898824,0,0.20810023],"outSlope":[0.0677898824,0,0.20810023],"tangentMode":-559038737},{"time":30,"value":[0.00180226564,0,3.46076202],"inSlope":[0.043915119,0,0.112454355],"outSlope":[0.043915119,0,0.112454355],"tangentMode":-559038737},{"time":35,"value":[0,0,3.27147746],"inSlope":[-0.0360188186,0,-0.116892397],"outSlope":[-0.0360188186,0,-0.116892397],"tangentMode":-559038737},{"time":44.9999962,"value":[-0.716771603,0,1.31219947],"inSlope":[-0.0768915936,0,-0.237792432],"outSlope":[-0.0768915936,0,-0.237792432],"tangentMode":-559038737},{"time":50,"value":[-1.12730193,0,-0.0860865116],"inSlope":[-0.0450028591,0,-0.251102328],"outSlope":[-0.0450028591,0,-0.251102328],"tangentMode":-559038737},{"time":54.9999962,"value":[-1.1668005,0,-1.19882417],"inSlope":[0.0704990178,0,-0.111273848],"outSlope":[0.0704990178,0,-0.111273848],"tangentMode":-559038737},{"time":65.0000076,"value":[0.322178721,0,-1.19882417],"inSlope":[0.258340061,0,0.159941331],"outSlope":[0.258340061,0,0.159941331],"tangentMode":-559038737},{"time":75,"value":[4,0,2],"inSlope":[0.367782384,0,0.319882661],"outSlope":[0.367782384,0,0.319882661],"tangentMode":-559038737}];
            var animationComponent = new kick.animation.AnimationComponent();
            var animation = new kick.animation.Animation();
            var animationCurve = new kick.animation.Curve();
            animationCurve.curveType = animationCurve.VEC3;
            animation.addCurve(animationCurve, "transform.localPosition");
            animation.addEventListener("animationRestart", randomizePlanet);

            animationComponent.addAnimation(animation);
            for (var i = 0;i<m_PositionCurves.length;i++){
                animationCurve.addControlPoint(new kick.animation.ControlPoint(m_PositionCurves[i]));
            }
            cameraGO.addComponent(animationComponent);
            animation.playing = true;
        }
        var randomizePlanet = function(){
            planetConfig.createRandom();
            planetScape.config = planetConfig;
        };
        buildCamera(scene);
        var planetConfig = new PlanetScapeConfig();
        var planetScape = new PlanetScape(scene, planetConfig);
        var gui = Gui.createGui(planetScape,planetConfig);
        var fullWindow = scene.createGameObject({name: "FullWindow"});
        fullWindow.addComponent(new kick.components.FullWindow());
    }
});