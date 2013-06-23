define([],
    function () {
        "use strict";
        // Fix up for prefixing
        window.AudioContext = window.AudioContext||window.webkitAudioContext;

        return {
            startLoop: function(debug){
                var url = 'music/space.mp3';
                try{
                    var context = new AudioContext();
                    var soundBuffer = null;
                    var request = new XMLHttpRequest();
                      request.open('GET', url, true);
                      request.responseType = 'arraybuffer';

                      // Decode asynchronously
                      request.onload = function() {
                        context.decodeAudioData(request.response, function(buffer) {
                            soundBuffer = buffer;

                            var source = context.createBufferSource(); // creates a sound source
                            source.buffer = buffer;                    // tell the source which sound to play
                            source.connect(context.destination);       // connect the source to the context's destination (the speakers)
                            source.loop = true;
                            source.start(0);

                        }, function(err){
                            console.log(err);
                        });
                      }
                      request.send();
                } catch (e){
                    debugger;
                    var myAudio = new Audio(url);
                    myAudio.play();
                    setInterval(function(){
                        myAudio = new Audio(url);
                        myAudio.play();
                    }, 347000);
                }
            }
        };
    });
