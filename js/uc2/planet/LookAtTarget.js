define(["kick"],
    function (kick) {
        "use strict";

        return function () {
            var thisObj = this;
            var position = [0,0,0];
            var d = 1;

            this.targetTransform = null;

            this.componentType = "lookAtTarget";

            Object.defineProperties(this, {
                x: {
                    set:function(x){
                        position[0] = x;
                        this.targetTransform.localPosition = position;
                    }
                },
                y: {
                    set:function(y){
                        position[1] = y;
                        this.targetTransform.localPosition = position;
                    }
                },
                z: {
                    set:function(z){
                        position[2] = z;
                        this.targetTransform.localPosition = position;
                    }
                },
                moonDistance: {
                    set:function(dist){
                        d = dist;
                    },
                    get:function(){
                        return d;
                    }
                }
            } );

            this.update = function(){
                this.gameObject.transform.lookAt(this.targetTransform, [0,1,0]);
            };
        };
    });
