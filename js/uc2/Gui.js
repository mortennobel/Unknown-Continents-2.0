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
                atmosphere.add(planetScapeConfig.atmosphere,'size', 0.00,0.3);


                // planet color
                var planet = gui.addFolder('Planet');
                planet.add(planetScapeConfig.planet,'strategy', ["diamondSquare","worley","simplex", "cell"]);
                planet.add(planetScapeConfig.planet,'maxHeight', 0.000,5.01);
                planet.add(planetScapeConfig.planet,'waterLevel', 0.000,1.00);
                planet.add(planetScapeConfig.planet,'rotationSpeed', -1,1);
                var color =  planet.addFolder('Color');
                color.addColor(createColorWrapper(planetScapeConfig.planet.colors,'color0'),'color0');
                color.addColor(createColorWrapper(planetScapeConfig.planet.colors,'color1'),'color1');
                color.addColor(createColorWrapper(planetScapeConfig.planet.colors,'color2'),'color2');
                color.addColor(createColorWrapper(planetScapeConfig.planet.colors,'color3'),'color3');
                color.addColor(createColorWrapper(planetScapeConfig.planet.colors,'color4'),'color4');
                color.addColor(createColorWrapper(planetScapeConfig.planet.colors,'color5'),'color5');
                color.addColor(createColorWrapper(planetScapeConfig.planet.colors,'color6'),'color6');
                color.add(planetScapeConfig.planet.colors,'colorStop0', 0,1);
                color.add(planetScapeConfig.planet.colors,'colorStop1', 0,1);
                color.add(planetScapeConfig.planet.colors,'colorStop2', 0,1);
                color.add(planetScapeConfig.planet.colors,'colorStop3', 0,1);
                var diamondSqr =  planet.addFolder('DiamondSquare');
                diamondSqr.add(planetScapeConfig.planet.diamondSquare,'iterations').min(2).max(10).step(1);
                var simplex =  planet.addFolder('Simplex/Worley');
                simplex.add(planetScapeConfig.planet.simplexWorley,'scale', 1,40);

                var cell =  planet.addFolder('Cell');
                cell.add(planetScapeConfig.planet.cell,'scale', 0.2,1.5);
                cell.add(planetScapeConfig.planet.cell,'scaleSmall', 0.2,1.5);
                cell.add(planetScapeConfig.planet.cell,'scaleXSmall', 0.2,1.5);
                cell.add(planetScapeConfig.planet.cell,'border', 0.02,0.1);
                cell.add(planetScapeConfig.planet.cell,'borderSmall', 0.02,0.2);
                cell.add(planetScapeConfig.planet.cell,'borderXSmall', 0.02,0.2);
                cell.add(planetScapeConfig.planet.cell,'heightPower', 0.1,2.0);

                var moon = gui.addFolder('Moons');
                moon.add(planetScapeConfig.moons,'numberOfMoons').min(0).max(16).step(1);

                // sun properties
                var sun = gui.addFolder('Sun');
                sun.addColor(createColorWrapper(planetScapeConfig.sun,'ambientColor',true),'ambientColor');
                //light direction
                var light = sun.addFolder('LightDirection');
                var wrappedDirectionArray = createArrayWrapper(planetScapeConfig.sun, "lightDirection", [0,1,2], ["lightDirectionX","lightDirectionY","lightDirectionZ"]);
                light.add(wrappedDirectionArray,'lightDirectionX',-1,1);
                light.add(wrappedDirectionArray,'lightDirectionY',-1,1);
                light.add(wrappedDirectionArray,'lightDirectionZ',-1,1);
                sun.add(planetScapeConfig.sun,'showLightDirection');

                gui.add({updatePlanet:function(){planetScape.config = planetScapeConfig;}}, 'updatePlanet');
                gui.add(planetScapeConfig, 'createRandom').onChange(function(){
                    var updateControllers = function(obj){
                        // Recursively update all controllers
                        for (var i in obj.__controllers) {
                            obj.__controllers[i].updateDisplay();
                        }
                        for (var i in obj.__folders) {
                            updateControllers(obj.__folders[i]);
                        }

                    };
                    setTimeout(function(){ // update GUI next frame
                        updateControllers(gui);
                        onChangeListener();
                    },10);
                });
            }
        };
    });
