define([],
    function () {
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
            }
        };
    });
