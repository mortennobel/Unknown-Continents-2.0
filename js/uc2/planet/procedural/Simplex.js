define(["kick",'text!shaders/simplex_noise_vs.glsl', 'text!shaders/simplex_noise_fs.glsl'],
    function (kick, vs, fs) {
        "use strict";

        return function(textureDim){
            var renderTexture,
                shader,
                renderMaterial;

            this.bake = function(texture, config, onFinish){
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
                    var engine = kick.core.Engine.instance;
                    renderTexture = new kick.texture.RenderTexture({dimension:[textureDim,textureDim], colorTexture: texture});
//                shader = engine.project.load(engine.project.ENGINE_SHADER_UNLIT);

                    shader = new kick.material.Shader({
                        vertexShaderSrc: vs,
                        fragmentShaderSrc: fs
                    });
                    renderMaterial = new kick.material.Material( {
                        shader:shader
                    });
                }
                renderMaterial.setUniform("scale", new Float32Array([config.scale]));
                kick.core.Graphics.renderToTexture(renderTexture, renderMaterial);

                onFinish(texture);
            }
        };
    });