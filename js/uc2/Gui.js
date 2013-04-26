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
            },
            createArrayWrapper = function(obj, arrayName, indeces, exposedNames){
                var o = {};
                for (var i=0;i<indeces.length;i++){
                    (function(i){
                        console.log(indeces[i], exposedNames[i]);
                        Object.defineProperty(o, exposedNames[i], {
                            get: function(){
                                return obj[arrayName][indeces[i]];
                            },
                            set: function(value){
                                obj[arrayName][indeces[i]] = value;
                                console.log(obj[arrayName], value, i);
                            }
                        });
                    })(i);
                }
                return o;
            };

        /**
         * Create dat.gui gui
         * @class Gui
         */
        return {
            createGui: function(planetScape, planetConfig){
                var gui = new  dat.GUI();

                var onChangeListener = function(value) {
                    planetScape.config = planetConfig;
                };

                //planet color
                var pc = gui.addColor(createColorWrapper(planetConfig.planet,'color'),'color');
                pc.onChange(onChangeListener);
                var slt = gui.add(planetConfig.planet,'showTexture');
                slt.onChange(onChangeListener);

                //light direction
                var light = gui.addFolder('LightDirection');
                var wrappedDirectionArray = createArrayWrapper(planetConfig.sun, "lightDirection", [0,1,2], ["lightDirectionX","lightDirectionY","lightDirectionZ"]);
                var ldx = light.add(wrappedDirectionArray,'lightDirectionX',-1,1);
                ldx.onChange(onChangeListener);
                var ldy = light.add(wrappedDirectionArray,'lightDirectionY',-1,1);
                ldy.onChange(onChangeListener);
                var ldz = light.add(wrappedDirectionArray,'lightDirectionZ',-1,1);
                ldz.onChange(onChangeListener);
                var sld = light.add(planetConfig.sun,'showLightDirection');
                sld.onChange(onChangeListener);

            }
        };
    });
