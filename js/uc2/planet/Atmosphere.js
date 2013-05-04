define(["kick", 'text!shaders/planet_composition_vs.glsl', 'text!shaders/planet_composition_fs.glsl'],
    function (kick, planet_vs, planet_fs) {
        "use strict";

        /**
         * Planet class constructor function
         */
        return function () {
            var time,
                material,
                showTextureMaterial,
                showTexture,
                thisObj = this,
                planetMeshRenderer,
                planetScapeConfig,
                rotation = [0,0,0,1],
                rotationSpeed = 1000.01,
                updateMaterial = function(){
                    if (material){
                        material.setUniform("mainColor", planetScapeConfig.color || [1.0, 0.0, 0.9, 1.0]);
                        material.setUniform("maxHeight", new Float32Array([planetScapeConfig.maxHeight || 0.01]) );
                        planetMeshRenderer.material = showTexture ? showTextureMaterial : material;
                    }
                    rotationSpeed = planetScapeConfig.rotationSpeed || 1000.01;
                },
                makePlanetTexture = function () {
                    // texture width / height must be power of 2 and square
                    var textureDim = 256;
                    var textureColors = 4; // RGB
                    var data = new Uint8Array(textureDim * textureDim * textureColors);
                    // color a single pixel
                    for (var i=0;i<4*textureDim*textureDim;i=i+3){
                    data[0+i*4] = Math.random()*255;
                    data[1+i*4] = Math.random()*255;
                    data[2+i*4] = Math.random()*255;
                    data[3+i*4] = 255;
                    }

                    var texture = new kick.texture.Texture();
                    texture.internalFormat = kick.core.Constants.GL_RGBA;
                    texture.magFilter = kick.core.Constants.GL_NEAREST;
                    texture.setImageData ( textureDim, textureDim, 0, kick.core.Constants.GL_UNSIGNED_BYTE,  data);
                    return texture;
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
                        showTexture = newValue.showTexture;
                        updateMaterial();

                    }
                }
            });

            this.activated = function(){
                var engine = kick.core.Engine.instance;
                time = engine.time;
                var scene = engine.activeScene;
                var planetGameObject = scene.createGameObject({name: "Planet"});
                planetMeshRenderer = new kick.scene.MeshRenderer();
                var planet_radius = 1;
                var planet_texture = makePlanetTexture(engine, 256, 256);
                var mesh = new kick.mesh.Mesh(
                    {
                        dataURI: "kickjs://mesh/uvsphere/?slices=100&stacks=200&radius=" + planet_radius,
                        name: "Default object"
                    });
                var meshData = mesh.meshData;
                meshData.recalculateTangents();
                mesh.meshData = meshData;
                planetMeshRenderer.mesh = mesh;
                var shader = new kick.material.Shader({
                    vertexShaderSrc: planet_vs,
                    fragmentShaderSrc: planet_fs
                });

                material = new kick.material.Material( {
                    shader: shader,
                    uniformData: {
                        mainTexture: planet_texture
                    }
                });
                showTextureMaterial = new kick.material.Material( {
                    shader: engine.project.load(engine.project.ENGINE_SHADER_DIFFUSE),
                    uniformData: {
                        mainTexture: planet_texture
                    }
                });
                planetMeshRenderer.material = material;
                planetGameObject.addComponent(planetMeshRenderer);

                updateMaterial();
            };

            this.update = function(){
                thisObj.gameObject.transform.localRotation = kick.math.Quat.rotateY(rotation,rotation,rotationSpeed*time.deltaTime);
            };
        }
    });