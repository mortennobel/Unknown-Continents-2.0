define(["kick", 'text!shaders/planet_composition_vs.glsl', 'text!shaders/planet_composition_fs.glsl'],
//define(["kick", 'text!shaders/planet_vs.glsl', 'text!shaders/planet_fs.glsl'],
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
                    var textureDim = 1024;
                    var textureColors = 1; // Alpha
                    //var data = new Uint8Array(textureDim * textureDim * textureColors);
                    // color a single pixel
                    /*for (var i=0;i< textureDim*textureDim;i++){
                        data[0+i*4] = i*255/textureDim/textureDim;
                        data[1+i*4] = i*255/textureDim/textureDim;
                        data[2+i*4] = i*255/textureDim/textureDim;
                        data[3+i*4] = 255;
                    }*/

                    var data = buildMap(10);

                    var texture = new kick.texture.Texture();
                    texture.internalFormat = kick.core.Constants.GL_ALPHA;
                    texture.magFilter = kick.core.Constants.GL_NEAREST;
                    texture.setImageData ( textureDim, textureDim, 0, kick.core.Constants.GL_UNSIGNED_BYTE,  data);
                    return texture;
                };

            var size;
            var map;
            var h = 0.5;
            var range = 512;
            var initialValues = 128;

            function setColor(x,y,color){
                map[x + y*size] = color;

            }

            function getColor(x,y){
                return map[x + y*size];
            }

            function buildMap(iterations){
                var rand = Math.random();
                size = Math.pow(2,iterations)+1;
                map = new Uint8Array(size*size);
                //map[x + y * size]
                setColor(0,0,initialValues);
                setColor(0,size-1,initialValues);
                setColor(size-1,0,initialValues);
                setColor(size-1,size-1,initialValues);

                var stepsize;
                for (var i = 0; i < iterations; i++) {
                    var resolution = Math.pow(2, i);

                    for (var x = 0; x < resolution; x++) {
                        for (var y = 0; y < resolution; y++) {
                            stepsize = (size - 1) / resolution;
                            diamondStep(x * stepsize, y * stepsize, stepsize, i);
                        }
                    }

                    for (var x = 0; x < resolution; x++) {
                        for (var y = 0; y < resolution; y++) {
                            stepsize = (size - 1) / resolution;
                            squareStep(x * stepsize, y * stepsize + stepsize / 2, stepsize,i);    //left
                            squareStep((x + 1) * stepsize, y * stepsize + stepsize / 2, stepsize,i);//right
                            squareStep(x * stepsize + stepsize / 2, (y + 1) * stepsize, stepsize,i);//bottom
                            squareStep(x * stepsize + stepsize / 2, y * stepsize, stepsize,i);    //top
                        }
                    }
                }
                return squareify(map);
            }

            //hack hack the edges away
            function squareify(map){
                var result = new Uint8Array((size-1)*(size-1));

                for (var x = 0; x < (size-1);++x){
                    for (var y = 0; y < (size-1);y++){

                        result[(x+y*(size-1))] = map[(x+y*(size))];

                    }
                }
                return result;
            }


            function diamondStep(x,y,length,iteration){
                setColor(x + length / 2,y + length / 2,
                    (getColor(x,y) + getColor(x + length,y) + getColor(x,y + length) + getColor(x + length,y + length)) / 4
                    + (Math.pow(2.0, -h*iteration) * (range * Math.random() - range / 2))
                );
            }

            function squareStep(x,y,length,iteration){
                var yplus = y + length / 2;
                var xplus = x + length / 2;
                var yminus = y - length / 2;
                var xminus = x - length / 2;

                if (yminus < 0) {
                    yminus = size - 1 - length / 2;
                }
                if (xminus < 0) {
                    xminus = size - 1 - length / 2;
                }
                if (yplus > size - 1) {
                    yplus = length / 2;
                }
                if (xplus > size - 1) {
                    xplus = length / 2;
                }
                setColor(x,y,
                    (getColor(x,yplus) + getColor(x,yminus) + getColor(xminus,y) + getColor(xplus,y)) / 4
                        //+ (Math.pow(2.0, -h*iteration) * (range * Math.random() - range / 2))
                );
            }

            Object.defineProperties(this, {
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
                        heightMap: planet_texture

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