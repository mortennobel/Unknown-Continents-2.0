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
                return [0,0,0,0];
            },
            createColorWrapper = function(obj, colorName, onlyVec3){
                var o = {};
                Object.defineProperty(o, colorName, {
                    get: function(){
                        var array = obj[colorName];
                        if (onlyVec3){
                            return [array[0]*255,array[1]*255,array[2]*255,1];
                        } else {
                            return [array[0]*255,array[1]*255,array[2]*255,array[3]?array[3]:0];
                        }

                    },
                    set: function(value){
                        value = convertToArray(value);
                        if (onlyVec3){
                            obj[colorName] = [parseFloat(value[0]/255),
                                                        parseFloat(value[1]/255),
                                                        parseFloat(value[2]/255)];
                        } else {
                            obj[colorName] = [parseFloat(value[0]/255),
                                                        parseFloat(value[1]/255),
                                                        parseFloat(value[2]/255),
                                                        parseFloat(value[3])];
                        }

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
                                var v = obj[arrayName];
                                v[indeces[i]] = value;
                                obj[arrayName] = v;
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
            createGui: function(planetScape, planetScapeConfig){
                var gui = new  dat.GUI();

                var onChangeListener = function() {
                    planetScape.config = planetScapeConfig;
                };

                var atmosphere = gui.addFolder('Atmosphere');
                atmosphere.addColor(createColorWrapper(planetScapeConfig.atmosphere,'color'),'color')
                    .onChange(onChangeListener);
//                atmosphere.add(planetScapeConfig.atmosphere,'size', 0.00,1.01)
//                                    .onChange(onChangeListener);


                // planet color
                var planet = gui.addFolder('Planet');
                planet.addColor(createColorWrapper(planetScapeConfig.planet,'color'),'color')
                    .onChange(onChangeListener);
                planet.add(planetScapeConfig.planet,'showTexture')
                    .onChange(onChangeListener);
                planet.add(planetScapeConfig.planet,'maxHeight', 0.000,5.01)
                    .onChange(onChangeListener);
                planet.add(planetScapeConfig.planet,'rotationSpeed', -1,1)
                    .onChange(onChangeListener);
                planet.add(planetScapeConfig.planet,'iterations').min(2).max(10).step(1)
                    .onChange(onChangeListener);

                // sun properties
                var sun = gui.addFolder('Sun');
                sun.addColor(createColorWrapper(planetScapeConfig.sun,'ambientColor',true),'ambientColor')
                    .onChange(onChangeListener);
                //light direction
                var light = sun.addFolder('LightDirection');
                var wrappedDirectionArray = createArrayWrapper(planetScapeConfig.sun, "lightDirection", [0,1,2], ["lightDirectionX","lightDirectionY","lightDirectionZ"]);
                light.add(wrappedDirectionArray,'lightDirectionX',-1,1)
                    .onChange(onChangeListener);
                light.add(wrappedDirectionArray,'lightDirectionY',-1,1)
                    .onChange(onChangeListener);
                light.add(wrappedDirectionArray,'lightDirectionZ',-1,1)
                    .onChange(onChangeListener);
                sun.add(planetScapeConfig.sun,'showLightDirection')
                    .onChange(onChangeListener);



            }
        };
    });
