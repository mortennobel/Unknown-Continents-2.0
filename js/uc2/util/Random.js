define(["kick"],
    function (kick) {
        "use strict";
        var Vec3 = kick.math.Vec3

        return {
            // power < 1 makes high number more likely
            // power > 1 makes high number less likely
            randomInt: function(from, to, power){
                var rnd = Math.pow(Math.random(), power || 1);
                return Math.floor(rnd * (to - from + 1)) + from;
            },

            // power < 1 makes high number more likely
            // power > 1 makes high number less likely
            randomFloat: function (from, to, power){
                var rnd = Math.pow(Math.random(), power || 1);
                return (rnd * (to - from)) + from;
            },
            randomDirection: function(){
                var rnd;
                do{
                    rnd = [Math.random()*2-1,Math.random()*2-1,Math.random()*2-1];
                } while((rnd[0] === 0 && rnd[1] === 0 && rnd[2] === 0 ) || Vec3.length(rnd)>1);
                Vec3.normalize(rnd,rnd);
                return rnd;
            },
            // power < 1 makes high number more likely
            // power > 1 makes high number less likely
            randomVec3: function (from, to, power){
                var rndX = Math.pow(Math.random(), power || 1),
                    rndY = Math.pow(Math.random(), power || 1),
                    rndZ = Math.pow(Math.random(), power || 1);
                return new Float32Array([
                    (rndX * (to[0] - from[0])) + from[0],
                    (rndY * (to[1] - from[1])) + from[1],
                    (rndZ * (to[2] - from[2])) + from[2]
                ]);
            },

            // power < 1 makes high number more likely
            // power > 1 makes high number less likely
            // w optional force w value
            randomVec4: function (from, to, power, w){
                var rndX = Math.pow(Math.random(), power || 1),
                    rndY = Math.pow(Math.random(), power || 1),
                    rndZ = Math.pow(Math.random(), power || 1),
                    rndW = Math.pow(Math.random(), power || 1);
                return new Float32Array([
                    (rndX * (to[0] - from[0])) + from[0],
                    (rndY * (to[1] - from[1])) + from[1],
                    (rndZ * (to[2] - from[2])) + from[2],
                    typeof w === "number" ? w : (rndW * (to[3] - from[3])) + from[3]
                ]);
            },
            // angles in radians
            randomQuatRotation: function (angleFrom, angleTo){
                var x, y, z, length,
                    angle = (Math.random() * (angleTo - angleFrom)) + angleTo;
                do {
                    x = Math.random();
                    y = Math.random();
                    z = Math.random();
                } while ((length = Math.sqrt(x*x + y*y + z*z))>1.0 || (x === 0 || y === 0 || z === 0)); // rotation is outsize unit sphere
                x /= length;
                y /= length;
                z /= length;
                return kick.math.Quat.setAxisAngle(kick.math.Quat.create(),[x,y,z], angle);
            },
            randomElement: function(array, power){
                var rnd = Math.pow(Math.random(), power || 1);
                var index = Math.min(Math.floor(array.length*rnd),array.length-1);
                return array[index];
            },
            randomColor: function(){
                return new Float32Array([Math.random(),Math.random(),Math.random(),1.0]);
            }
        };
    });
