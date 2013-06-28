define(["kick", 'uc2/planet/Planet', './LookAtTarget'],
    function (kick, Planet, LookAtTarget) {
        "use strict";

        //Sun object
        return function(){
            var thisObj = this,
                position = kick.math.Vec3.create(),
                positionReuse = kick.math.Vec3.create(),
                lightComponent,
                lightAmbientComponent,
                meshRenderer,
                enabled = true,
                transform,
                lookAtTarget,
                planetTransform,
                ambientColor = [0.15, 0.15, 0.15],
                buildLight = function(){
                    var lightGO = thisObj.gameObject;
                    lightComponent = new kick.scene.Light({
                        type: kick.scene.Light.TYPE_DIRECTIONAL,
                        color: [1.0, 1.0, 1.0]
                    });
                    lightGO.addComponent(lightComponent);
                    lightGO.transform.localRotationEuler = [0,0,0];

                    lightAmbientComponent = new kick.scene.Light({
                        type: kick.scene.Light.TYPE_AMBIENT,
                        color: ambientColor
                    });
                    lightGO.addComponent(lightAmbientComponent);
                };
            this.radius = 50;

            this.activated = function(){
                var engine = kick.core.Engine.instance;
                transform = thisObj.gameObject.transform;
                var planetComponent = thisObj.gameObject.scene.findComponentsOfType(Planet)[0];
                planetTransform = planetComponent.gameObject.transform;
                buildLight();

                var mesh = engine.project.load(engine.project.ENGINE_MESH_UVSPHERE);
                meshRenderer = new kick.scene.MeshRenderer({
                    mesh: mesh,
                    material: new kick.material.Material( {
                        shader: engine.project.load(engine.project.ENGINE_SHADER_UNLIT),
                        uniformData: {
                            mainColor: [2,2,2,1]
                        }
                    })
                });
                thisObj.gameObject.addComponent(meshRenderer);
                thisObj.lightDirection = position;
                thisObj.gameObject.transform.localScale = [1.0,1.0,1.0];
                lookAtTarget = this.gameObject.scene.findComponentsOfType(LookAtTarget)[0];
            };

            // make sure sun is not visible during shifts
            this.update = function(){
                var distScale = lookAtTarget.moonDistance;
                for (var i=0;i<3;i++){
                    positionReuse[i] = position[i] * distScale;
                }
                thisObj.gameObject.transform.localPosition = positionReuse;
            };

            Object.defineProperties(this, {
                config: {
                    set : function(val){
                        thisObj.lightDirection = val.lightDirection;
                        thisObj.showLightDirection = val.showLightDirection;
                        thisObj.ambientColor = val.ambientColor;
                    }
                },
                lightDirection:{
                    set:function(val){
                        var Vec3 = kick.math.Vec3;
                        if (!Vec3.length(val)==0){
                            position  = Vec3.normalize(position , val);
                        }
                        Vec3.scale(position , position , thisObj.radius);
                        if (transform){
                            transform.position = position;
                            transform.lookAt(planetTransform, [0,1,0]);
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
                },
                ambientColor:{
                    set:function(val){
                        ambientColor = [val[0], val[1], val[2]];
                        if (lightAmbientComponent){
                            console.log("Update ambient color to ",ambientColor);
                            lightAmbientComponent.color = ambientColor;
                        }
                    },
                    get: function(){
                        return ambientColor;
                    }
                }
                });
        }
    });