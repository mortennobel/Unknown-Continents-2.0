define(["kick"],
    function (kick) {
        "use strict";

        return function () {
            var thisObj = this;
            this.position = [0,0,0];

            this.componentType = "lookAtTarget";

            Object.defineProperties(this, {
                x: {
                    set:function(x){
                        thisObj.position[0] = x;
                    }
                },
                y: {
                    set:function(y){
                        thisObj.position[1] = y;
                    }
                },
                z: {
                    set:function(z){
                        thisObj.position[2] = z;
                    }
                }
            } );

            this.update = function(){
                this.gameObject.transform.lookAt(thisObj, [0,1,0]);
            };
        };
    });
