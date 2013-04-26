define([],
    function () {
        "use strict";
        var convertToArray = function(value){
                if (Array.isArray(value)){
                    return value;
                }
                if (typeof value === "string" && value.charAt(0) === '#'){
                    return [(parseInt(value.substring(1), 16)>>16)%256,(parseInt(value.substring(1), 16)>>8)%256,(parseInt(value.substring(1), 16))%256,0];
                }
            },
            createColorWrapper = function(obj, colorName){
                var o = {};
                Object.defineProperty(o, colorName, {
                    get: function(){
                        var array = obj[colorName];
                        return [array[0]*255,array[1]*255,array[2]*255,array[3] ];
                    },
                    set: function(value){
                        value = convertToArray(value);
                        obj[colorName] = [parseFloat(value[0]/255),
                            parseFloat(value[1]/255),
                            parseFloat(value[2]/255),
                            parseFloat(value[3])];
                    }
                });
                return o;
            };

        /**
         * Create dat.gui gui
         * @class Gui
         */
        return {
            createGui: function(planet, planetConfig){
                var gui = new  dat.GUI();

                //planet color
                var pc = gui.addColor(createColorWrapper(planetConfig,'planetColor'),'planetColor');
                pc.onChange(function(value) {
                    planet.config = planetConfig;
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
