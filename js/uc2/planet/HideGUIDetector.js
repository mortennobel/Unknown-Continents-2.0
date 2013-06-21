define(["kick"],
    function (kick) {
        "use strict";

        return function (gui) {
            var canvas,
                guiDom = gui.domElement.parentNode,
                timeOut,
                time,
                mouseInput,
                mouseSum,
                hidden = true;

            this.activated =function(){
                time = kick.core.Engine.instance.time;
                mouseInput = kick.core.Engine.instance.mouseInput;
                canvas = document.getElementById('canvas');
                guiDom.style.display = "none";
                timeOut = 1000;
                mouseSum = 0;
            };

            this.update = function(){
                timeOut -= time.deltaTime;
                var deltaMovement = mouseInput.deltaMovement;
                mouseSum += Math.abs(deltaMovement[0]) + Math.abs(deltaMovement[1]);
                if (timeOut < 0){
                    hidden = mouseSum < 100;
                    if (hidden){
                        guiDom.style.display = "none";
                        canvas.style.cursor = "none";
                        timeOut = 1000;
                    } else {
                        guiDom.style.display = "block";
                        canvas.style.cursor = "";
                        timeOut = 10000;
                    }
                    mouseSum = 0;
                }
            };
        };
    });
