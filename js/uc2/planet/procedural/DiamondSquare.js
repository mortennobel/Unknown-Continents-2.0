define(["kick"],
    function (kick) {
        "use strict";

        return function(){
            var data;
            var tex;
            var textureDim;
            var count = 0;
            var subdivisions = 4;
            var onFin;
            this.bake = function(texture, config, onFinish){
                onFin = onFinish;
                var iterations = config.iterations;
                textureDim = Math.pow(2,iterations);
                var buildMap = new Worker("js/uc2/planet/procedural/DiamondSquareWorker.js");
                buildMap.postMessage(iterations);
                buildMap.onmessage = function(oEvent){
                    data = new Uint8Array(oEvent.data);
                    if (!texture || texture.internalFormat !== kick.core.Constants.GL_ALPHA || texture.dimension[0] !== textureDim){
                        if (texture){
                            texture.destroy();
                        }
                        texture = new kick.texture.Texture();
                        texture.internalFormat = kick.core.Constants.GL_ALPHA;
                        texture.magFilter = kick.core.Constants.GL_LINEAR;
                    }
                    count = subdivisions + 1;
                    texture.setImageData ( textureDim, textureDim, 0, kick.core.Constants.GL_UNSIGNED_BYTE,  null);
                    tex = texture;

                };
            };

            this.update = function(){
                // interleave upload of texture data
                if (count > 1){
                    var idx = count - 2;
                    console.log("Upload texture "+(idx+1)+"/"+subdivisions);
                    var begin = textureDim*(textureDim*idx)/subdivisions;
                    var end = begin + textureDim*textureDim/subdivisions;
                    tex.setSubImageData ( 0, (textureDim*idx)/subdivisions , textureDim,  textureDim/subdivisions,  data.subarray(begin, end));
                } else if (count === 1){
                    onFin(tex);
                    console.log("Update texture");
                } else {
                    return;
                }
                count--;
            };
        }
    });