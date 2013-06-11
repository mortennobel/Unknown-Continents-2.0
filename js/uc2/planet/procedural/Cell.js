define(["kick",'text!shaders/cell_noise_vs.glsl', 'text!shaders/cell_noise_fs.glsl'],
    function (kick, vs, fs) {
        "use strict";

        return function(){
            var textureDim = 1024*2,
                renderTexture,
                shader,
                renderMaterial;

            this.bake = function(texture, config) {
                if (!texture || !renderTexture || renderTexture.colorTexture !== texture) {
                    if (texture) {
                        texture.destroy();
                    }
                    texture = new kick.texture.Texture();
                    texture.internalFormat = kick.core.Constants.GL_RGBA;
                    texture.magFilter = kick.core.Constants.GL_LINEAR;
                    texture.setImageData(textureDim, textureDim, 0, kick.core.Constants.GL_UNSIGNED_BYTE, null, "");
                }

                if (!renderTexture || renderTexture.colorTexture !== texture) {
                    if (renderTexture) {
                        renderTexture.destroy();
                    }
                    renderTexture = new kick.texture.RenderTexture({dimension:[textureDim,textureDim], colorTexture: texture});

                    shader = new kick.material.Shader({
                        vertexShaderSrc: vs,
                        fragmentShaderSrc: fs
                    });
                    renderMaterial = new kick.material.Material({
                        shader:shader
                    });
                }
                renderMaterial.setUniform("scale", new Float32Array([config.scale]));
                renderMaterial.setUniform("scaleSmall", new Float32Array([config.scaleSmall || (Math.random()+0.5)]));
                renderMaterial.setUniform("scaleXSmall", new Float32Array([config.scaleXSmall || (Math.random()+0.5)]));
                renderMaterial.setUniform("border", new Float32Array([config.border || (Math.random()*0.2+0.02)]));
                renderMaterial.setUniform("borderSmall", new Float32Array([config.borderSmall || (Math.random()*0.2+0.02)]));
                renderMaterial.setUniform("borderXSmall", new Float32Array([config.borderXSmall || (Math.random()*0.2+0.02)]));
                renderMaterial.setUniform("heightPower", new Float32Array([config.heightPower || (Math.random()*0.5)]));
                kick.core.Graphics.renderToTexture(renderTexture, renderMaterial);

                return texture;
            }
        };
    });
