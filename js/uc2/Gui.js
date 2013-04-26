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

                //planet color
                var pc = gui.addColor(planetConfig,'planetColor256');
                pc.onChange(function(value) {
                    planet.config = planetConfig;
                    if (debug){
                        console.log('planetColor: ' + planetConfig.planetColor);
                        console.log('planetColor256: ' + planetConfig.planetColor256);
                    }
                });

                //light direction
                var light = gui.addFolder('LightDirection');
                var ldx = light.add(planetConfig,'lightDirectionX',-1,1);
                ldx.onChange(function(value) {planet.config = planetConfig;});
                var ldy = light.add(planetConfig,'lightDirectionY',-1,1);
                ldy.onChange(function(value) {planet.config = planetConfig;});
                var ldz = light.add(planetConfig,'lightDirectionZ',-1,1);
                ldz.onChange(function(value) {planet.config = planetConfig;});
                var sld = light.add(planetConfig,'showLightDirection');
                sld.onChange(function(value) {planet.config = planetConfig;});
            }
        };
    });
