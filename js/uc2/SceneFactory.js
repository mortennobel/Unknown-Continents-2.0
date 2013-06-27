define(["kick", 'uc2/util/CameraRenderToTexture','uc2/util/PostProcessingEffect','uc2/planet/LookAtTarget','uc2/planet/HideGUIDetector','uc2/planet/PlanetScape','uc2/planet/DebugRotateComponent','uc2/planet/PlanetScapeConfig', 'uc2/Gui',
        'text!shaders/webgl-noise/noise2D.glsl', 'text!shaders/webgl-noise/noise3D.glsl', 'text!shaders/webgl-noise/noise4D.glsl',
        'text!shaders/cellular-noise/cellular2D.glsl','text!shaders/cellular-noise/cellular2x2.glsl','text!shaders/cellular-noise/cellular2x2x2.glsl','text!shaders/cellular-noise/cellular3D.glsl',
    'text!shaders/bloom_1_pass_vs.glsl','text!shaders/bloom_1_pass_fs.glsl','text!shaders/bloom_2_pass_vs.glsl','text!shaders/bloom_2_pass_fs.glsl','text!shaders/bloom_3_pass_vs.glsl','text!shaders/bloom_3_pass_fs.glsl'
    ],
    function (kick, CameraRenderToTexture, PostProcessingEffect, LookAtTarget, HideGUIDetector, PlanetScape, DebugRotateComponent, PlanetScapeConfig, Gui, noise2D, noise3D, noise4D, cellular2D, cellular2x2, cellular2x2x2, cellular3D,
        bloom1vs,bloom1fs,bloom2vs,bloom2fs,bloom3vs,bloom3fs) {
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

            var lookAtGameObject = scene.createGameObject();
            var lookAtTarget = new LookAtTarget();
            cameraGO.addComponent(lookAtTarget);
            lookAtTarget.targetTransform = lookAtGameObject.transform;
            //cameraGO.addComponent(new DebugRotateComponent());

            var m_PositionCurves = [{"time":0,"value":[-3,0,0.0136170387],"inSlope":[0,0,0],"outSlope":[0,0,0],"tangentMode":-559038737},{"time":10,"value":[-1.35399544,0,-0.701242566],"inSlope":[0.105994768,0,0.0409744345],"outSlope":[0.105994768,0,0.0409744345],"tangentMode":-559038737},{"time":20,"value":[-0.880104661,0,0.833105743],"inSlope":[0.0677898824,0,0.20810023],"outSlope":[0.0677898824,0,0.20810023],"tangentMode":-559038737},{"time":30,"value":[0.00180226564,0,3.46076202],"inSlope":[0.043915119,0,0.112454355],"outSlope":[0.043915119,0,0.112454355],"tangentMode":-559038737},{"time":35,"value":[0,0,3.27147746],"inSlope":[-0.0360188186,0,-0.116892397],"outSlope":[-0.0360188186,0,-0.116892397],"tangentMode":-559038737},{"time":44.9999962,"value":[-0.716771603,0,1.31219947],"inSlope":[-0.0768915936,0,-0.237792432],"outSlope":[-0.0768915936,0,-0.237792432],"tangentMode":-559038737},{"time":50,"value":[-1.12730193,0,-0.0860865116],"inSlope":[-0.0450028591,0,-0.251102328],"outSlope":[-0.0450028591,0,-0.251102328],"tangentMode":-559038737},{"time":54.9999962,"value":[-1.1668005,0,-1.19882417],"inSlope":[0.0704990178,0,-0.111273848],"outSlope":[0.0704990178,0,-0.111273848],"tangentMode":-559038737},{"time":65.0000076,"value":[0.322178721,0,-1.19882417],"inSlope":[0.258340061,0,0.159941331],"outSlope":[0.258340061,0,0.159941331],"tangentMode":-559038737},{"time":75,"value":[4,0,2],"inSlope":[0,0,0],"outSlope":[0,0,0],"tangentMode":-559038737}];

            //var m_PositionCurves = [{"time":0,"value":[-3,0,0.0136170387],"inSlope":[0.164600462,0,-0.071485959],"outSlope":[0.164600462,0,-0.071485959],"tangentMode":-559038737},{"time":10,"value":[-1.35399544,0,-0.701242566],"inSlope":[0.105994768,0,0.0409744345],"outSlope":[0.105994768,0,0.0409744345],"tangentMode":-559038737},{"time":20,"value":[-0.880104661,0,0.833105743],"inSlope":[0.0677898824,0,0.20810023],"outSlope":[0.0677898824,0,0.20810023],"tangentMode":-559038737},{"time":30,"value":[0.00180226564,0,3.46076202],"inSlope":[0.043915119,0,0.112454355],"outSlope":[0.043915119,0,0.112454355],"tangentMode":-559038737},{"time":35,"value":[0,0,3.27147746],"inSlope":[-0.0360188186,0,-0.116892397],"outSlope":[-0.0360188186,0,-0.116892397],"tangentMode":-559038737},{"time":44.9999962,"value":[-0.716771603,0,1.31219947],"inSlope":[-0.0768915936,0,-0.237792432],"outSlope":[-0.0768915936,0,-0.237792432],"tangentMode":-559038737},{"time":50,"value":[-1.12730193,0,-0.0860865116],"inSlope":[-0.0450028591,0,-0.251102328],"outSlope":[-0.0450028591,0,-0.251102328],"tangentMode":-559038737},{"time":54.9999962,"value":[-1.1668005,0,-1.19882417],"inSlope":[0.0704990178,0,-0.111273848],"outSlope":[0.0704990178,0,-0.111273848],"tangentMode":-559038737},{"time":65.0000076,"value":[0.322178721,0,-1.19882417],"inSlope":[0.258340061,0,0.159941331],"outSlope":[0.258340061,0,0.159941331],"tangentMode":-559038737},{"time":75,"value":[4,0,2],"inSlope":[0.367782384,0,0.319882661],"outSlope":[0.367782384,0,0.319882661],"tangentMode":-559038737}];
            var animationComponent = new kick.animation.AnimationComponent();
            var animation = new kick.animation.Animation();
            var animationCurve = new kick.animation.Curve();

            var followX = [{"time":0,"value":-3,"inSlope":0,"outSlope":0,"tangentMode":0},{"time":10,"value":-0.810000002,"inSlope":0.147000015,"outSlope":0.147000015,"tangentMode":10},{"time":20,"value":-0.0599999987,"inSlope":0.0405000001,"outSlope":0.0405000001,"tangentMode":10},{"time":30,"value":0,"inSlope":0.00300000003,"outSlope":0.00300000003,"tangentMode":10},{"time":45,"value":0,"inSlope":0,"outSlope":0,"tangentMode":1},{"time":50,"value":-0.0424413979,"inSlope":0,"outSlope":0,"tangentMode":9},{"time":55,"value":0,"inSlope":0.0307441186,"outSlope":0.0307441186,"tangentMode":10},{"time":65.0000076,"value":0.529999971,"inSlope":0.200000107,"outSlope":0.200000107,"tangentMode":10},{"time":75,"value":4,"inSlope":0,"outSlope":0,"tangentMode":0}];
            var followY = [{"time":0,"value":0,"inSlope":0,"outSlope":0,"tangentMode":10},{"time":15,"value":0,"inSlope":0,"outSlope":0,"tangentMode":10},{"time":20,"value":0,"inSlope":0.0799999982,"outSlope":0.0799999982,"tangentMode":10},{"time":25,"value":0.800000012,"inSlope":0,"outSlope":0,"tangentMode":10},{"time":30,"value":0,"inSlope":-0.0799999982,"outSlope":-0.0799999982,"tangentMode":10},{"time":35,"value":0,"inSlope":0.0680000037,"outSlope":0.0680000037,"tangentMode":10},{"time":40,"value":0.680000007,"inSlope":0.0680000037,"outSlope":0.0680000037,"tangentMode":10},{"time":45,"value":0.680000007,"inSlope":0.0849999934,"outSlope":0.0849999934,"tangentMode":10},{"time":50,"value":1.52999997,"inSlope":-0.0849999934,"outSlope":-0.0849999934,"tangentMode":10},{"time":52.5,"value":0.680000007,"inSlope":-0.169999987,"outSlope":-0.169999987,"tangentMode":10},{"time":55,"value":0.680000007,"inSlope":0.0184999835,"outSlope":0.0184999835,"tangentMode":10},{"time":65.0000076,"value":1.04999995,"inSlope":-0.034000054,"outSlope":-0.034000054,"tangentMode":10},{"time":75,"value":0,"inSlope":0,"outSlope":0,"tangentMode":0}];
            var followZ = [{"time":0,"value":3.02999997,"inSlope":0,"outSlope":0,"tangentMode":0},{"time":10,"value":0.910000026,"inSlope":-0.0619999915,"outSlope":-0.0619999915,"tangentMode":10},{"time":15,"value":1.35000002,"inSlope":-0.0910000056,"outSlope":-0.0910000056,"tangentMode":10},{"time":20,"value":0,"inSlope":-0.135000005,"outSlope":-0.135000005,"tangentMode":10},{"time":25,"value":0,"inSlope":0,"outSlope":0,"tangentMode":10},{"time":30,"value":0,"inSlope":0,"outSlope":0,"tangentMode":10},{"time":45,"value":0,"inSlope":0,"outSlope":0,"tangentMode":10},{"time":55,"value":0,"inSlope":0.150000006,"outSlope":0.150000006,"tangentMode":10},{"time":75,"value":6,"inSlope":0,"outSlope":0,"tangentMode":0}];

            var moonDistance = [{"time":0,"value":0,"inSlope":0.200000003,"outSlope":0.200000003,"tangentMode":10},{"time":5,"value":1,"inSlope":0,"outSlope":0,"tangentMode":0},{"time":70,"value":1,"inSlope":0,"outSlope":0,"tangentMode":0},{"time":75,"value":0,"inSlope":-0.200000003,"outSlope":-0.200000003,"tangentMode":10}];
            var follows = [followX, followY, followZ];
            var followsSTR = ['x','y','z'];
            for (var j=0;j<3;j++){
                var c = new kick.animation.Curve();
                var ctrlPoints = follows[j];
                for (var i = 0;i<ctrlPoints.length;i++){
                    c.addControlPoint(new kick.animation.ControlPoint(ctrlPoints[i]));
                }
                animation.addCurve(c, "lookAtTarget."+followsSTR[j]);
            }
            var moonDistanceCurve = new kick.animation.Curve();
            for (var i = 0;i<moonDistance.length;i++){
                moonDistanceCurve.addControlPoint(new kick.animation.ControlPoint(moonDistance[i]));
            }
            animation.addCurve(moonDistanceCurve, "lookAtTarget.moonDistance");
            animationCurve.curveType = animationCurve.VEC3;
            animation.addCurve(animationCurve, "transform.localPosition");
            animation.addEventListener("animationLoop", randomizePlanet);

            animation.speed = 0.5;

            animationComponent.addAnimation(animation);
            for (var i = 0;i<m_PositionCurves.length;i++){
                animationCurve.addControlPoint(new kick.animation.ControlPoint(m_PositionCurves[i]));
            }
            cameraGO.addComponent(animationComponent);
            animation.playing = true;

            var ppe = new CameraRenderToTexture();
            cameraGO.addComponent(ppe);

            function createMaterial(vs, fs,  materialUniforms) {
                var shader = new kick.material.Shader();
                shader.vertexShaderSrc = vs;
                shader.fragmentShaderSrc = fs;
                shader.apply();

                return new kick.material.Material({
                    name: "Some material",
                    shader: shader,
                    uniformData: materialUniforms
                });
            }

            var postEffect = new PostProcessingEffect();
            postEffect.material = createMaterial(bloom1vs, bloom1fs, {mainTexture: ppe.texture});
            ppe.addEffect(postEffect);
            var postEffectBlur = new PostProcessingEffect();
            postEffectBlur.material = createMaterial(bloom2vs, bloom2fs, {mainTexture: postEffect.texture});
            ppe.addEffect(postEffectBlur);
            var postEffectBlur2 = new PostProcessingEffect();
            postEffectBlur2.material = createMaterial(bloom3vs, bloom3fs, {mainTexture: postEffectBlur.texture, originTexture: ppe.texture});
            ppe.addEffect(postEffectBlur2);
            ppe.addEventListener("screenSizeChanged",function(dim){
                postEffectBlur.material.setUniform("height", new Float32Array([dim[1]]));
                postEffectBlur2.material.setUniform("width", new Float32Array([dim[0]]));
            });

            return cameraGO;
        }
        var randomizePlanet = function(){
            planetConfig.createRandom();
            planetScape.config = planetConfig;
        };
        var gameObject = buildCamera(scene);
        var planetConfig = new PlanetScapeConfig();
        var planetScape = new PlanetScape(scene, planetConfig);
        var gui = Gui.createGui(planetScape,planetConfig);
        gameObject.addComponent(new HideGUIDetector(gui));
        var fullWindow = scene.createGameObject({name: "FullWindow"});
        fullWindow.addComponent(new kick.components.FullWindow());
    }
});