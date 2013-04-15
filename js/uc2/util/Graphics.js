define(["kick"],
    function (kick) {
        "use strict";

        /**
         * Utility class for 2D and 3D graphics
         */
        return function () {
            var thisObj = this,
                engine = kick.core.engine.instance,
                createMesh = function(){
                    return new kick.mesh.MeshData({
                        meshData: kick.mesh.MeshDataFactory.createPlaneData (),
                        name: "RenderToTextureMesh",
                        uid: -10000 //
                    });
                },
                mesh = createMesh();

            /**
             * @method renderToTexture
             * @param {kick.texture.RenderTexture} renderTexture
             * @param {kick.material.Material} material
             */
            this.renderToTexture = function(renderTexture, material){

            };
        };
    });
