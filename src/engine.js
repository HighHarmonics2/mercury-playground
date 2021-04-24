const Tone = require('tone');

let samples = {};
let buffers;

// fetch('./data/samples.json')
fetch("/samples")
.then(function(response) {
	return response.json();
})
.then(function(data) {
	samples = data;
	console.log(samples)

	buffers = new Tone.ToneAudioBuffers({
		urls: samples,
		onload: function(){ 
			console.log('buffers loaded');
			// init();
		}
	});
})
.catch(function(error) {
	console.log('error:' + error);
});

// resume webaudio and transport for livecoding
function resume(){
	try {
		Tone.start();
		Tone.Transport.timeSignature = [4, 4];
		// Tone.Transport.seconds = 0;
		// Tone.Transport.swing = 0.5;
		Tone.Transport.start();
		console.log("Resumed Transport");
	} catch {
		console.error("error enabling ToneJS");
	}
}

// stop the transport end therefore playing the sounds
function silence(){
	try {
		// Tone.Transport.stop();
		Tone.Transport.pause();
	} catch {
		console.error('error stopping sound');
	}
}

// set the bpm for the sequencer
// second argument determines ramptime
// 
function setBPM(bpm, ramp=0){
	if (ramp === 0){
		Tone.Transport.bpm.value = bpm;
	} else {
		Tone.Transport.bpm.rampTo(bpm, ramp / 1000);
	}
	document.getElementById('bpm').innerHTML = `tempo = ${bpm}`;
	console.log(`set bpm to ${bpm}`);
}

// return the bom of the global transport
function getBPM(){
	return Tone.Transport.bpm.value;
}

function getBuffers(){
	return buffers;
}

module.exports = { resume, silence, setBPM, getBPM, getBuffers };

// set initial BPM on pageload to random value
setBPM(Math.floor(Math.random() * 40) + 80);