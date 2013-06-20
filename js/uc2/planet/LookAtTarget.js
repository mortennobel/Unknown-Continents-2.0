define(["kick"],
    function (kick) {
        "use strict";

        return function () {
            var thisObj = this;
            this.position = [0,0,0];

            this.componentType = "lookAtTarget";


            this.update = function(){
                this.gameObject.transform.lookAt(thisObj, [0,1,0]);
            };
        };
    });
