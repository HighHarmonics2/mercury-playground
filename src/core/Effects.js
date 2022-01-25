const Tone = require('tone');
const Util = require('./Util.js');
// const Tuna = require('tunajs');
// const TunaFX = new Tuna(Tone.getContext());

// all the available effects
const fxMap = {
	'drive' : (params) => {
		return new Drive(params);
	},
	'distort' : (params) => {
		return new Drive(params);
	},
	'overdrive' : (params) => {
		return new Drive(params);
	},
	'squash' : (params) => {
		return new Squash(params);
	},
	'compress' : (params) => {
		return new Squash(params);
	},
	'lfo' : (params) => {
		return new LFO(params);
	},
	// 'chip' : (params) => {
	// 	return new BitCrusher(params);
	// },
	'reverb' : (params) => {
		return new Reverb(params);
	},
	'shift' : (params) => {
		return new PitchShift(params);
	},
	'pitchShift' : (params) => {
		return new PitchShift(params);
	},
	'tune' : (params) => {
		return new PitchShift(params);
	},
	'filter' : (params) => {
		return new Filter(params);
	},
	'delay' : (params) => {
		return new Delay(params);
	},
	'echo' : (params) => {
		return new Delay(params);
	},
	'ppDelay' : (params) => {
		return new PingPongDelay(params);
	}
}
module.exports = fxMap;

const Drive = function(_params){
	console.log('FX => Drive()', _params);

	this._drive = (_params[0] !== undefined)? Util.toArray(_params[0]) : [1.5];

	this._fx = new Tone.WaveShaper();

	this.shaper = function(amount){
		// drive curve, minimum drive of 1
		const d = Math.pow(amount, 2);
		// makeup gain
		const m = Math.pow(d, 0.6);
		// preamp gain reduction for linear at drive = 1
		const p = 0.4;
		// set the waveshaping effect
		this._fx.setMap((x) => {
			return Math.tanh(x * p * d) / p / m;
		});
	}
	
	this.set = function(c){
		let d = Util.getParam(this._drive, c);
		this.shaper(isNaN(d)? 1 : Math.max(1, d));
	}

	this.chain = function(){
		return { 'send' : this._fx, 'return' : this._fx };
	}

	this.delete = function(){
		this._fx.disconnect();
		this._fx.dispose();
	}
}

// squash/compress an incoming signal
// based on algorithm by Peter McCulloch
const Squash = function(_params){
	console.log('FX => Squash()', _params);

	this._compress = (_params[0] !== undefined)? Util.toArray(_params[0]) : [1];

	this._fx = new Tone.WaveShaper();

	this.shaper = function(amount){
		// (a * c) / ((a * c)^2 * 0.28 + 1) / √c
		// drive amount, minimum of 1
		const c = amount;
		// makeup gain
		const m = 1.0 / Math.sqrt(c);
		// set the waveshaper effect
		this._fx.setMap((x) => {
			return (x * c) / ((x * c) * (x * c) * 0.28 + 1) * m; 
		});
	}
	
	this.set = function(c){
		let d = Util.getParam(this._compress, c);
		this.shaper(isNaN(d)? 1 : Math.max(1, d));
	}

	this.chain = function(){
		return { 'send' : this._fx, 'return' : this._fx };
	}

	this.delete = function(){
		this._fx.disconnect();
		this._fx.dispose();
	}
}

// BitCrusher
// Add a bitcrushing effect
// 
/*const BitCrusher = function(_params){
	console.log('FX => BitCrusher()', _params);

	this._fx = new Tone.BitCrusher(_params[0]);

	this.set = function(c){

	}

	this.chain = function(){
		return this._fx;
	}

	this.delete = function(){
		this._fx.disconnect();
		this._fx.dispose();
	}
}*/

// Reverb FX
// Add a reverb to the sound to give it a feel of space
// 
const Reverb = function(_params){
	console.log('FX => Reverb()', _params);

	this._fx = new Tone.Reverb();

	this._wet = (_params[0] !== undefined)? Util.toArray(_params[0]) : [ 0.5 ];
	this._size = (_params[1] !== undefined)? Util.toArray(_params[1]) : [ 1.5 ];

	this.set = function(c, time){
		let tmp = Math.min(10, Math.max(0.1, Util.getParam(this._size, c)));
		if (this._fx.decay != tmp){
			this._fx.decay = tmp; 
		}

		let wet = Math.min(1, Math.max(0, Util.getParam(this._wet, c)));
		this._fx.wet.setValueAtTime(wet, time);
	}

	this.chain = function(){
		return { 'send' : this._fx, 'return' : this._fx };
	}

	this.delete = function(){
		this._fx.disconnect();
		this._fx.dispose();
	}
}

// PitchShift FX
// Shift the pitch up or down with semitones
// 
const PitchShift = function(_params){
	console.log('FX => PitchShift()', _params);
	// to-do: add wet/dry parameter

	this._fx = new Tone.PitchShift();

	this._pitch = (_params[0] !== undefined)? Util.toArray(_params[0]) : [-12];
	this._wet = (_params[1] !== undefined)? Util.toArray(_params[1]) : [1];

	this.set = function(c, time){
		let p = Util.getParam(this._pitch, c);
		let w = Util.getParam(this._wet, c);

		this._fx.pitch = p;
		this._fx.wet.setValueAtTime(w, time);
	}

	this.chain = function(){
		return { 'send' : this._fx, 'return' : this._fx };
	}

	this.delete = function(){
		this._fx.disconnect();
		this._fx.dispose();
	}
}

// LFO FX
// a Low Frequency Oscillator effect, control tempo, type and depth
//
const LFO = function(_params){
	console.log('FX => LFO()', _params);

	this._waveMap = {
		sine : 'sine',
		saw : 'sawtooth',
		square : 'square',
		triangle : 'triangle',
		tri : 'triangle',
		rect : 'square',
	}

	this._lfo = new Tone.LFO('8n', 0, 1);
	this._fx = new Tone.Gain();
	this._lfo.connect(this._fx.gain);
	// this._fx = new Tone.Tremolo('8n').start();

	this._speed = (_params[0]) ? Util.toArray(_params[0]) : ['8n'];
	this._type = (_params[1]) ? Util.toArray(_params[1]) : ['sine'];
	this._depth = (_params[2] !== undefined) ? Util.toArray(_params[2]) : [ 1 ];

	this.set = function(c, time, bpm){
		let w = Util.getParam(this._type, c);
		if (this._waveMap[w]){
			w = this._waveMap[w];
		} else {
			console.log(`'${w} is not a valid waveshape`);
			// default wave if wave does not exist
			w = 'sine';
		}
		this._lfo.set({ type: w });
		
		let s = Util.getParam(this._speed, c);

		// let t = Util.formatRatio(s, bpm);
		this._lfo.frequency.setValueAtTime(s, time);

		let a = Util.getParam(this._depth, c);
		this._lfo.min = 1 - a;

		this._lfo.start(Tone.now());
	}

	this.chain = function(){
		return { 'send' : this._fx, 'return' : this._fx };
	}

	this.delete = function(){
		this._lfo.dispose();
		this._lfo.disconnect();
		this._fx.disconnect();
		this._fx.dispose();
	}
}

// A filter FX, choose between highpass, lowpass and bandpass
// Set the cutoff frequency and Q factor
//
const Filter = function(_params){
	console.log('FX => Filter()', _params);

	this._fx = new Tone.Filter();

	this._types = {
		'lo' : 'lowpass',
		'low' : 'lowpass',
		'lowpass' : 'lowpass',
		'hi' : 'highpass',
		'high' : 'highpass',
		'highpass' : 'highpass',
		'band' : 'bandpass',
		'bandpass': 'bandpass'
	}
	if (this._types[_params[0]]){
		this._fx.set({ type: this._types[_params[0]] });
	} else {
		console.log(`'${_params[0]}' is not a valid filter type`);
		this._fx.set({ type: 'lowpass' });
	}
	this._fx.set({ rolloff: -24 });

	this._cutoff = (_params[1]) ? Util.toArray(_params[1]) : [ 1000 ];
	this._q = (_params[2]) ? Util.toArray(_params[2]) : [ 0.5 ];

	this.set = function(c, time){
		let f = Util.getParam(this._cutoff, c);
		let r = 1 / Math.min(1, Math.max(0, (1 - Util.getParam(this._q, c))));

		this._fx.frequency.setValueAtTime(f, time);
		this._fx.Q.setValueAtTime(r, time);
	}

	this.chain = function(){
		return { 'send' : this._fx, 'return' : this._fx };
	}

	this.delete = function(){
		this._fx.disconnect();
		this._fx.dispose();
	}
}

// Old delay implementation, just using the Tone.PingPongDelay()
const PingPongDelay = function(_params){
	console.log('FX => PingPongDelay()', _params);

	this._fx = new Tone.PingPongDelay();
	this._fx.set({ wet: 0.4 });

	// console.log('delay', param);
	this._dTime = (_params[0] !== undefined)? Util.toArray(_params[0]) : [ '3/16' ];
	this._fb = (_params[1] !== undefined)? Util.toArray(_params[1]) : [ 0.3 ];
	// let del = new Tone.PingPongDelay(formatRatio(t), fb);

	this.set = function(c, time, bpm){
		let t = Math.max(0, Util.formatRatio(Util.getParam(this._dTime, c), bpm));
		let fb = Math.max(0, Math.min(0.99, Util.getParam(this._fb, c)));

		this._fx.delayTime.setValueAtTime(t, time);
		this._fx.feedback.setValueAtTime(fb, time);
	}

	this.chain = function(){
		return { 'send' : this._fx, 'return' : this._fx };
	}

	this.delete = function(){
		this._fx.disconnect();
		this._fx.dispose();
	}
}

// Custom stereo delay implementation with lowpass filter in feedback loop
const Delay = function(_params){
	console.log('FX => Delay()', _params);

	this._fx = new Tone.Gain(1);
	this._fb = new Tone.Gain(0.5);
	this._split = new Tone.Split(2);
	this._merge = new Tone.Merge(2);

	this._delayL = new Tone.Delay({ maxDelay: 5 });
	this._delayR = new Tone.Delay({ maxDelay: 5 });
	// this._op = new Tone.OnePoleFilter();
	this._flt = new Tone.Filter(1000, 'lowpass');

	if (_params.length === 2){
		_params[2] = _params[1];
		_params[1] = undefined;
	}
	// All params and defaults
	this._timeL = (_params[0] !== undefined)? Util.toArray(_params[0]) : [ '2/16' ];
	this._timeR = (_params[1] !== undefined)? Util.toArray(_params[1]) : [ '3/16' ];
	this._feedBack = (_params[2] !== undefined)? Util.toArray(_params[2]) : [ 0.6 ];
	this._fbDamp = (_params[3] !== undefined)? Util.toArray(_params[3]) : [ 0.45 ];

	// split the signal
	this._fb.connect(this._split);
	// the feedback node connects to the delay L + R
	this._split.connect(this._delayL, 0, 0);
	this._split.connect(this._delayR, 1, 0);
	// merge back
	this._delayL.connect(this._merge, 0, 0);
	this._delayR.connect(this._merge, 0, 1);
	// the delay is the input chained to the sample and returned
	// the delay also connects to the onepole filter
	this._merge.connect(this._flt);
	// the output of the onepole is stored back in the gain for feedback
	this._flt.connect(this._fb);

	this.set = function(c, time, bpm){
		let dL = Math.max(0, Util.formatRatio(Util.getParam(this._timeL, c), bpm));
		let dR = Math.max(0, Util.formatRatio(Util.getParam(this._timeR, c), bpm));
		let ct = Math.max(10, Util.getParam(this._fbDamp, c) * 6000);
		let fb = Math.max(0, Math.min(0.99, Util.getParam(this._feedBack, c)));

		this._delayL.delayTime.setValueAtTime(dL, time);
		this._delayR.delayTime.setValueAtTime(dR, time);
		this._flt.frequency.setValueAtTime(ct, time);
		this._fb.gain.setValueAtTime(fb, time);
	}

	this.chain = function(){
		return { 'send' : this._fb, 'return' : this._fb };
	}

	this.delete = function(){
		this._fb.disconnect();
		this._op.disconnect();
		this._dl.disconnect();
		this._fb.dispose();
		this._op.dispose();
		this._dl.dispose();
	}
}

