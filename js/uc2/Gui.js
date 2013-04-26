define([],
    function () {
        "use strict";

        /**
         * Create dat.gui gui
         * @class Gui
         */
        return {
            createGui: function(planet, planetConfig){
                var gui = new  dat.GUI();
                var pc = gui.addColor(planetConfig,'planetColor256');

                pc.onChange(function(value) {
                    planet.config = planetConfig;
                });
                pc.onFinishChange(function(value) {
                });
            }
        };
    });
