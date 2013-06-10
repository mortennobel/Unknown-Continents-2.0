define(["kick",'text!shaders/bake_color_and_specularity_vs.glsl', 'text!shaders/bake_color_and_specularity_fs.glsl',  'uc2/util/Random'],
    function (kick, vs, fs, Random) {
        "use strict";

        return function(){
            var textureDim = 1024*2,
                renderTexture,
                shader,
                renderMaterial;

            this.bake = function(texture, config, heightMapTexture){
                if (!texture || !renderTexture || renderTexture.colorTexture !== texture){
                    if (texture){
                        texture.destroy();
                    }
                    texture = new kick.texture.Texture();
                    texture.internalFormat = kick.core.Constants.GL_RGBA;
                    texture.magFilter = kick.core.Constants.GL_LINEAR;
                    texture.setImageData(textureDim, textureDim, 0, kick.core.Constants.GL_UNSIGNED_BYTE, null, "");

                }

                if (!renderTexture || renderTexture.colorTexture !== texture){
                    if (renderTexture){
                        renderTexture.destroy();
                    }
                    renderTexture = new kick.texture.RenderTexture({dimension:[textureDim,textureDim], colorTexture: texture});

                    shader = new kick.material.Shader({
                        vertexShaderSrc: vs,
                        fragmentShaderSrc: fs
                    });
                    renderMaterial = new kick.material.Material( {
                        shader:shader
                    });
                }
                renderMaterial.setUniform("heightMap", heightMapTexture);
                renderMaterial.setUniform("color0", Random.randomColor());//new Float32Array([0, 0, 0.5, 0]));
                renderMaterial.setUniform("color1", Random.randomColor());//new Float32Array([0, 0, 0.8, 0]));
                renderMaterial.setUniform("color2", Random.randomColor());//new Float32Array([0, 1.0, 0, 0]));
                renderMaterial.setUniform("color3", Random.randomColor());//new Float32Array([1, 0, 0, 0]));
                renderMaterial.setUniform("color4", Random.randomColor());//new Float32Array([0, 1, 0, 0]));
                renderMaterial.setUniform("color5", Random.randomColor());//new Float32Array([1, 0.3, 0, 0]));
                renderMaterial.setUniform("color6", Random.randomColor());//new Float32Array([1, 1, 1, 0]));

                // create a random interval 0 <= a[i] <= a[i+1] <= 1
                // first interval is water level
                var array = [0,0,0,0,0];
                array[0] = config.waterLevel;
                array[2] = Random.randomFloat(array[0],1);
                array[1] = Random.randomFloat(array[0],array[2]);
                array[3] = Random.randomFloat(array[2],1);
                array[4] = Random.randomFloat(array[3],1);

                renderMaterial.setUniform("colorStop0", new Float32Array([array[0]]));
                renderMaterial.setUniform("colorStop1", new Float32Array([array[1]]));
                renderMaterial.setUniform("colorStop2", new Float32Array([array[2]]));
                renderMaterial.setUniform("colorStop3", new Float32Array([array[3]]));
                renderMaterial.setUniform("colorStop4", new Float32Array([array[4]]));

                renderMaterial.setUniform("waterLevel", new Float32Array([config.waterLevel]));

                kick.core.Graphics.renderToTexture(renderTexture, renderMaterial);

                return texture;
            }
        };
    });