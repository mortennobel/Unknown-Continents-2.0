define(["kick",'text!shaders/worley_noise_vs.glsl', 'text!shaders/worley_noise_fs.glsl'],
    function (kick, worley_noise_vs, worley_noise_fs) {
        "use strict";

        var textureDim = 1024,
            renderTexture,
            shader,
            renderMaterial,
            thisTexture;

        return function(texture, config){
            if (!texture || texture !== thisTexture ||!thisTexture){
                if (!thisTexture){
                    thisTexture = new kick.texture.Texture();
                    thisTexture.internalFormat = kick.core.Constants.GL_RGB;
                    thisTexture.magFilter = kick.core.Constants.GL_LINEAR;
                    thisTexture.setImageData(textureDim, textureDim, 0, kick.core.Constants.GL_UNSIGNED_BYTE, null, "");
                }
                texture = thisTexture;
            }


            if (!renderTexture){
                var engine = kick.core.Engine.instance;
                renderTexture = new kick.texture.RenderTexture({dimension:[textureDim,textureDim], colorTexture: texture});
//                shader = engine.project.load(engine.project.ENGINE_SHADER_UNLIT);

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