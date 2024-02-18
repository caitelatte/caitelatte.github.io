/* TAKEN FROM ANU COMP1720 2017 COURSE MATERIALS WITH PERMISSION TO DISTRIBUTE ON GITHUB
* Written by Ben Swift at The Australian National University, 2017?
*/

var envelope;
var oscillators = [];
var currentOsc = 0;

// NOTE: this function returns a function (not just a number)
// this is a useful technique sometimes, but don't stress if you don't
// understand it (you can do fine in this course without it)
function closenessTo(x) {
    return function (a,b) {
        if (abs(x-a) < abs(x-b)) return -1;
        if (abs(x-a) > abs(x-b)) return 1;
        return 0;
    }
}

// midi numbers
pentatonic = [60, 63,65,67,70,72,75];

function playBoop(midi) {
    if(!midi) midi = 60;
    var note = pentatonic.sort(closenessTo(midi))[0];

    oscillators[currentOsc].freq(midiToFreq(note));
    envelope.play(oscillators[currentOsc],0,0.1);
    currentOsc = (currentOsc +1) % oscillators.length;
}

function setupSound() {
    for(let i=0; i<5; i++) {
        oscillators.push(new p5.TriOsc());
    }

    // create a new envelope object
    envelope = new p5.Env();
    // set attackTime, decayTime, sustainRatio, releaseTime
    envelope.setADSR(0.001, 0.5, 0.1, 0.5);
    console.debug(oscillators)
    // set attackLevel, releaseLevel
    // 2024 - added volume limit less than 1 to avoid ear damage
    envelope.setRange(0.25, 0);
    oscillators.map(x=>x.start());
    oscillators.map(x=>x.amp(0));
    console.debug(oscillators)
}
