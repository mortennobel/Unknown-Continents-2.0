define(["kick",'text!shaders/worley_noise_vs.glsl', 'text!shaders/worley_noise_fs.glsl'],
    function (kick, worley_noise_vs, worley_noise_fs) {
        "use strict";

        var textureDim = 1024,
            renderTexture,
            shader,
            renderMaterial;

        return function(texture, config){
            if (!texture || !renderTexture || renderTexture.colorTexture !== texture){
                if (texture){
                    texture.destroy();
                }
                texture = new kick.texture.Texture();
                texture.internalFormat = kick.core.Constants.GL_RGB;
                texture.magFilter = kick.core.Constants.GL_LINEAR;
                texture.setImageData(textureDim, textureDim, 0, kick.core.Constants.GL_UNSIGNED_BYTE, null, "");
            }

            if (!renderTexture || renderTexture.colorTexture !== texture){
                if (renderTexture){
                    renderTexture.destroy();
                }
                renderTexture = new kick.texture.RenderTexture({dimension:[textureDim,textureDim], colorTexture: texture});

                shader = new kick.material.Shader({
                    vertexShaderSrc: worley_noise_vs,
                    fragmentShaderSrc: worley_noise_fs
                });
                renderMaterial = new kick.material.Material( {
                    shader:shader
                });
            }
            renderMaterial.setUniform("scale", new Float32Array([config.scale]));
            kick.core.Graphics.renderToTexture(renderTexture, renderMaterial);

            return texture;
        }
    });