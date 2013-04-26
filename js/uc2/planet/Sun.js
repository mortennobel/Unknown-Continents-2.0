define(["kick"],
    function (kick) {
        "use strict";

        //Sun object
        return function(){
            var thisObj = this,
                position = kick.math.Vec3.create();
            this.radius = 10;

            var meshRenderer,
                enabled,
                thisObj = this;
            this.activated = function(){
                var engine = kick.core.Engine.instance;
                var mesh = engine.project.load(engine.project.ENGINE_MESH_UVSPHERE);
                meshRenderer = new kick.scene.MeshRenderer({
                    mesh: mesh,
                    material: new kick.material.Material( {
                        shader: engine.project.load(engine.project.ENGINE_SHADER_UNLIT),
                        uniformData: {
                            specularColor: [0, 0, 1, 1]
                        }
                    })
                });
                if (enabled){
                    thisObj.gameObject.addComponent(meshRenderer);
                }
                thisObj.gameObject.transform.position = position ;
            };

            Object.defineProperties(this, {
                lightDirection:{
                    set:function(val){
                        var Vec3 = kick.math.Vec3;
                        position  = Vec3.normalize(position , val);
                        Vec3.scale(position , position , thisObj.radius);
                        thisObj.gameObject.transform.position = position;
                        console.log(val, position);
                    }
                },
                showLightDirection:{
                    set:function(val){
                        if (enabled != val){
                            enabled = val;
                            if (thisObj.gameObject && meshRenderer){
                                if (enabled){
                                    thisObj.gameObject.addComponent(meshRenderer);
                                } else {
                                    thisObj.gameObject.removeComponent(meshRenderer);
                                }
                            }
                        }
                    }
                }
                });
        }
    });