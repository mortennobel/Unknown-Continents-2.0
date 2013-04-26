define(["kick"],
    function (kick) {
        "use strict";

        //Sun object
        return function(){
            var thisObj = this,
                position = kick.math.Vec3.create();
            this.radius = 50;

            var meshRenderer,
                enabled = true,
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
                thisObj.gameObject.addComponent(meshRenderer);
                thisObj.gameObject.transform.position = position ;
                thisObj.gameObject.transform.localScale = [0.5,0.5,0.5];
            };

            Object.defineProperties(this, {
                config: {
                    set : function(val){
                        thisObj.lightDirection = val.lightDirection;
                        thisObj.showLightDirection = val.showLightDirection;
                    }
                },
                lightDirection:{
                    set:function(val){
                        var Vec3 = kick.math.Vec3;
                        if (!Vec3.length(val)==0){
                            position  = Vec3.normalize(position , val);
                        }
                        Vec3.scale(position , position , thisObj.radius);
                        if (thisObj.gameObject){
                            thisObj.gameObject.transform.position = position;
                        }
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