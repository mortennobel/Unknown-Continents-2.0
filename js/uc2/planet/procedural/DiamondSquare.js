define(["kick"],
    function (kick) {

        return function(){
            this.bake = function(texture, config, onFinish){
                var iterations = config.iterations;
                var textureDim = Math.pow(2,iterations);

                var buildMap = new Worker("js/uc2/planet/procedural/DiamondSquareWorker.js");
                buildMap.postMessage(iterations);
                buildMap.onmessage = function(oEvent){
                    var data = new Uint8Array(oEvent.data);
                    if (!texture || texture.internalFormat !== kick.core.Constants.GL_ALPHA || texture.dimension[0] !== textureDim){
                        if (texture){
                            texture.destroy();
                        }
                        texture = new kick.texture.Texture();
                        texture.internalFormat = kick.core.Constants.GL_ALPHA;
                        texture.magFilter = kick.core.Constants.GL_LINEAR;
                    }

                    texture.setImageData ( textureDim, textureDim, 0, kick.core.Constants.GL_UNSIGNED_BYTE,  data);
                    onFinish(texture);
                }
            }
        }
    });