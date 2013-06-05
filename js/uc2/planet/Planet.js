define(["kick", "./procedural/DiamondSquare", "./procedural/Worley","./procedural/Simplex", 'text!shaders/planet_composition_vs.glsl', 'text!shaders/planet_composition_fs.glsl',
    'text!shaders/unlit_alpha_vs.glsl', 'text!shaders/unlit_alpha_fs.glsl'],
//define(["kick", 'text!shaders/planet_vs.glsl', 'text!shaders/planet_fs.glsl'],
    function (kick, DiamondSquare, Worley, Simplex, planet_vs, planet_fs, unlit_planet_vs, unlit_planet_fs) {
        "use strict";

        /**
         * Planet class constructor function
         */
        return function () {

            // texture width / height must be power of 2 and square
            var time,
                material,
                showTextureMaterial,
                showTexture,
                thisObj = this,
                planetMeshRenderer,
                config = {},
                texture,
                currentConfigKey = "",
                rotation = [0,0,0,1],
                rotationSpeed = 1000.01,
                strategy = "DiamondSquare",
                updateMaterial = function(){
                    if (material){
                        material.setUniform("atmosphereColor", config.atmosphereColor || [0.0, 0.0, 0.9, 1.0]);
                        material.setUniform("mainColor", config.color || [1.0, 0.0, 0.9, 1.0]);
                        material.setUniform("maxHeight", new Float32Array([config.maxHeight || 2.00]) );
                        planetMeshRenderer.material = showTexture ? showTextureMaterial : material;
                    }
                    rotationSpeed = config.rotationSpeed/1000 || 0.0001;
                };

            this.makePlanetTexture = function () {
                console.log("this.makePlanetTexture");
                if (strategy === "simplex"){
                    texture = Simplex(texture, config.simplex || {});
                }else if (strategy === "worley"){
                    texture = Worley(texture, config.worley || {});
                } else { // strategy === "DiamondSquare"
                    texture = DiamondSquare(texture, config.diamondSquare || {});
                }

                if (material){
                    material.setUniform("heightMap", texture);
                    material.setUniform("mainTexture", texture);
                    material.setUniform("bumpmapTextureStep",new Float32Array([1/texture.dimension[0]]) );
                }
                return texture;
            };



            Object.defineProperties(this, {
                config: {
                    set: function (newValue) {
                        config = newValue;
                        showTexture = newValue.showTexture;
                        rotationSpeed = newValue.rotationSpeed / 1000;
                        updateMaterial();

                        strategy = newValue.strategy;

                        var configKey = strategy + JSON.stringify(newValue[strategy]);
                        if (configKey !== currentConfigKey){
                            currentConfigKey = configKey;
                            thisObj.makePlanetTexture();
                        }

                    }
                }
            });



            this.activated = function(){
                var engine = kick.core.Engine.instance;
                time = engine.time;
                var scene = engine.activeScene;
                var planetGameObject = thisObj.gameObject;
                planetMeshRenderer = new kick.scene.MeshRenderer();
                var planet_radius = 1;
                var shader = new kick.material.Shader({
                    vertexShaderSrc: planet_vs,
                    fragmentShaderSrc: planet_fs
                });

                material = new kick.material.Material( {
                    shader: shader,
                    uniformData: {
                    }
                });
                var planet_texture = thisObj.makePlanetTexture();
                var mesh = new kick.mesh.Mesh(
                    {
                        dataURI: "kickjs://mesh/uvsphere/?slices=100&stacks=200&radius=" + planet_radius,
                        name: "Default object"
                    });
                var meshData = mesh.meshData;
                meshData.recalculateTangents();
                mesh.meshData = meshData;
                planetMeshRenderer.mesh = mesh;


                var unlitShader = new kick.material.Shader({
                    vertexShaderSrc: unlit_planet_vs,
                    fragmentShaderSrc: unlit_planet_fs
                });
                showTextureMaterial = new kick.material.Material({
                    shader: unlitShader,
                    uniformData: {
                        mainTexture: planet_texture,
                        mainColor: [1,1,1,1]
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