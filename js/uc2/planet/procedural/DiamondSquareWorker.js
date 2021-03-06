"use strict";

var size;
var map;
var h = 0.5;
var range = 512;
var initialValues = 128;

function setColor(x,y,color){
    map[x + y*size] = color;
}

function getColor(x,y){
    return map[x + y*size];
}

onmessage = function (oEvent) {
    var iterations = oEvent.data;
    var rand = Math.random();
    size = Math.pow(2,iterations)+1;
    map = new Uint8Array(size*size);
    //map[x + y * size]
    setColor(0,0,initialValues);
    setColor(0,size-1,initialValues);
    setColor(size-1,0,initialValues);
    setColor(size-1,size-1,initialValues);

    var stepsize;
    for (var i = 0; i < iterations; i++) {
        var resolution = Math.pow(2, i);

        for (var x = 0; x < resolution; x++) {
            for (var y = 0; y < resolution; y++) {
                stepsize = (size - 1) / resolution;
                diamondStep(x * stepsize, y * stepsize, stepsize, i);
            }
        }

        for (var x = 0; x < resolution; x++) {
            for (var y = 0; y < resolution; y++) {
                stepsize = (size - 1) / resolution;
                squareStep(x * stepsize, y * stepsize + stepsize / 2, stepsize,i);    //left
                squareStep((x + 1) * stepsize, y * stepsize + stepsize / 2, stepsize,i);//right
                squareStep(x * stepsize + stepsize / 2, (y + 1) * stepsize, stepsize,i);//bottom
                squareStep(x * stepsize + stepsize / 2, y * stepsize, stepsize,i);    //top
            }
        }
    }
    var result = squareify(map);
    postMessage(result.buffer, [result.buffer]);
}

//hack hack the edges away
function squareify(map){
    var result = new Uint8Array((size-1)*(size-1));

    for (var x = 0; x < (size-1);++x){
        for (var y = 0; y < (size-1);y++){

            result[(x+y*(size-1))] = map[(x+y*(size))];

        }
    }
    return result;
}


function diamondStep(x,y,length,iteration){
    setColor(x + length / 2,y + length / 2,
        (getColor(x,y) + getColor(x + length,y) + getColor(x,y + length) + getColor(x + length,y + length)) / 4
            + (Math.pow(2.0, -h*iteration) * (range * Math.random() - range / 2))
    );
}

function squareStep(x,y,length,iteration){
    var yplus = y + length / 2;
    var xplus = x + length / 2;
    var yminus = y - length / 2;
    var xminus = x - length / 2;

    if (yminus < 0) {
        yminus = size - 1 - length / 2;
    }
    if (xminus < 0) {
        xminus = size - 1 - length / 2;
    }
    if (yplus > size - 1) {
        yplus = length / 2;
    }
    if (xplus > size - 1) {
        xplus = length / 2;
    }
    setColor(x,y,
        (getColor(x,yplus) + getColor(x,yminus) + getColor(xminus,y) + getColor(xplus,y)) / 4
        //+ (Math.pow(2.0, -h*iteration) * (range * Math.random() - range / 2))
    );
}
