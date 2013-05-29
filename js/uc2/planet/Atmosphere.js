define(["kick", 'text!shaders/atmosphere_vs.glsl', 'text!shaders/atmosphere_fs.glsl'],
    function (kick, atmosphere_vs, atmosphere_fs) {
        "use strict";

        /**
         * Planet class constructor function
         */
        return function () {
            var size = 0.05,
                color = [0,0,0,0.1],
                material,
                thisObj = this,
                transform,
                config,
                setMaterial = function() {
                    if (config && material){
                        material.setUniform("mainColor", config.color || [0,0,0,0.1]);
                    }
                },
                setSize = function(s){
                    size = s;
                    if (transform){
                        var scale = size+1;
                        transform.localScale = [scale,scale,scale];
                        thisObj.gameObject.transform.localScale = [scale,scale,scale];
                        material.setUniform("atmosphereScale", new Float32Array([scale]));
                    }
                },
                cameraTransform;
            Object.defineProperties(this, {
                config: {
                    set: function (newValue) {
                        config = newValue;
                        setMaterial();
                        setSize(newValue.size);
                    }
                }
            });



            this.activated = function(){
                var engine = kick.core.Engine.instance;
                var scene = engine.activeScene;
                cameraTransform = scene.findComponentsOfType(kick.scene.Camera)[0].gameObject.transform;
                transform = thisObj.gameObject.transform;
                var atmosphereGameObject = thisObj.gameObject;
                var atmosphereMeshRenderer = new kick.scene.MeshRenderer();
                var atmosphere_radius = 1.05;
                atmosphereGameObject.transform.localScale = [atmosphere_radius,atmosphere_radius,atmosphere_radius];
                var mesh = new kick.mesh.Mesh(
                    {
                        dataURI: "kickjs://mesh/disc/?slices=100",
                        //dataURI: "kickjs://mesh/plane/?slices=100",
                        name: "Default object"
                    });
                var meshData = mesh.meshData;
                meshData.recalculateTangents();
                mesh.meshData = meshData;
                atmosphereMeshRenderer.mesh = mesh;
                var shader = new kick.material.Shader({
                    vertexShaderSrc: atmosphere_vs,
                    fragmentShaderSrc: atmosphere_fs,
                    blend: true,
                    blendSFactor: kick.core.Constants.GL_SRC_ALPHA,
                    blendDFactor:kick.core.Constants.GL_ONE,
                    // depthMask: false,
                    renderOrder: 2000,
                    faceCulling: kick.core.Constants.GL_NONE
                });

                material = new kick.material.Material( {
                    shader: shader,
                    uniformData: {
                        atmosphereScale: atmosphere_radius
                    }
                });
                atmosphereMeshRenderer.material = material;
                atmosphereGameObject.addComponent(atmosphereMeshRenderer);
                setSize(size);
                setMaterial();
            };

            this.update = function(){
                transform.lookAt(cameraTransform, [0,1,0]);
            };
        }
    });