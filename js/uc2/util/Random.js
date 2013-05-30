define(["kick"],
    function (kick) {
        "use strict";

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
            }
        };
    });
