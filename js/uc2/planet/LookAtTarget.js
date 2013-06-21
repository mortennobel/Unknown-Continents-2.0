define(["kick"],
    function (kick) {
        "use strict";

        return function () {
            var thisObj = this;
            var position = [0,0,0];

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
                }
            } );

            this.update = function(){
                this.gameObject.transform.lookAt(this.targetTransform, [0,1,0]);
            };
        };
    });
