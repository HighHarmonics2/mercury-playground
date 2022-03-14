const Tone = require('tone');
const Util = require('./Util.js');
const fxMap = require('./Effects.js');

// simple mono sample playback
class MonoSample {
	constructor(s='kick_min', engine){
		this._bufs = engine.getBuffers();
		this._bpm = engine.getBPM();
		this._engine = engine;

		console.log('=> MonoSample()', s);
		
		this._sound;
		this.sound(s);
		
		this._count = 0;
		this._beatCount = 0;
		
		this._time = 1;
		this._offset = 0;
		this._beat = [ 1 ];

		//this._note = n;
		this._speed = [ 1 ];
		this._rev = false;
		this._stretch = [ 0 ];
		

		// playback start position
		this._pos = [ 0 ];
		
		// default gain value -6 dB
		this._gain = [-6, 0];
		
		this._pan = [ 0 ];

		this._att = [ 0 ];
		this._sus = [ 0 ];
		this._rel = [ 0 ];

		this._loop;
		this.sample;
		this.panner;
		this.adsr;
		this.gain;
		this.mono;
		this._fx;

		this.makeSampler();
		// this.makeLoop();
	}

	makeSampler(){
		this.gain = new Tone.Gain(0).toDestination();
		this.panner = new Tone.Panner(0).connect(this.gain);
		// this.panner = new Tone.Panner(0).toDestination();
		// this.gain = new Tone.Gain(0).connect(this.panner);
		// this.sample = new Tone.Player(buffers.get('kick_min')).toDestination();
		this.adsr = new Tone.AmplitudeEnvelope({
			attack: 0,
			decay: 0,
			sustain: 1,
			release: 0.001,
			attackCurve: "linear",
			releaseCurve: "linear"
		});
		// this.adsr.connect(this.gain);
		this.adsr.connect(this.panner);
		// this.mono = new Tone.Mono().connect(this.adsr);
		// this.mono = new Tone.MidSideSplit().connect(this.adsr);
		// this.sample = new Tone.Player().connect(this.mono);
		this.sample = new Tone.Player().connect(this.adsr);
		// this.sample = new Tone.Player().connect(this.panner);

		// this.sample.load(this._sound);
		this.sample.autostart = false;
		// console.log('MonoSample()', this.sample.numberOfOutputs);
	}

	makeLoop(){
		// dispose of previous loop if active
		if (this._loop){
			this._loop.dispose();
		}
		let schedule = Tone.Time(this._offset).toSeconds();

		// create new loop for synth
		this._loop = new Tone.Loop((time) => {
			// get beat probability for current count
			let b = Util.getParam(this._beat, this._count);
			
			// let t = Util.getParam(this._time, this._count);
			// t = Util.formatRatio(t, this._engine.getBPM());
			// console.log(t);
			// this._loop.interval = t;

			// if random value is below probability, then play
			if (Math.random() < b){
				// get the count value
				let c = this._beatCount;

				// set FX parameters
				if (this._fx){
					for (let f=0; f<this._fx.length; f++){
						this._fx[f].set(c, time, this._bpm);
					}
				}
				
				// get the sample from array
				let f = Util.getParam(this._sound, c);
				if (this.sample.buffer){
					// clean-up previous buffer
					this.sample.buffer.dispose();
				}
				if (this._bufs.has(f)){	
					// this.sample.buffer = this._bufs.get(f);
					this.sample.buffer = this._bufs.get(f).slice(0);
				} else {
					// default sample if file does not exist
					// this.sample.buffer = this._bufs.get('kick_min');
					this.sample.buffer = this._bufs.get('kick_min').slice(0);
				}
				// the duration of the buffer in seconds
				let dur = this.sample.buffer.duration;

				// get speed and if 2d array pick randomly
				let s = Util.getParam(this._speed, c);

				// reversing seems to reverse every time the 
				// value is set to true (so after 2 times reverse
				// it becomes normal playback again) no fix yet
				this.sample.reverse = s < 0.0;

				let l = Util.lookup(this._stretch, c);
				let n = 1;
				if (l){
					n = dur / (60 * 4 / this._engine.getBPM()) / l;
				}

				// playbackrate can not be 0 or negative
				this.sample.playbackRate = Math.max(Math.abs(s) * n, 0.0001);
				
				// ramp volume
				let g = Util.getParam(this._gain[0], c);
				let r = Util.getParam(this._gain[1], c);
				this.sample.volume.rampTo(g, r, time);

				// set panning
				let p = Util.getParam(this._pan, c);
				p = Util.isRandom(p, -1, 1);
				this.panner.pan.setValueAtTime(p, time);

				// get the start position
				let o = dur * Util.getParam(this._pos, c);
				// end position for playback
				let e = this._time;
				// let e = t;

				// set shape for playback (fade-in / out and length)
				if (this._att){
					let att = Util.divToS(Util.lookup(this._att, c), this._bpm);
					let dec = Util.divToS(Util.lookup(this._sus, c), this._bpm);
					let rel = Util.divToS(Util.lookup(this._rel, c), this._bpm);

					this.adsr.attack = att;
					this.adsr.decay = dec;
					this.adsr.release = rel;
					
					e = Math.min(this._time, att + dec + rel);
					// e = Math.min(t, att + dec + rel);
				}

				// when sample is loaded, start
				if (this.sample.loaded){
					if (this.adsr.value > 0){
						// fade-out running envelope over 5 ms
						let tmp = this.adsr.release;
						this.adsr.release = 0.005;
						this.adsr.triggerRelease(time);
						this.adsr.release = tmp;
						time += 0.005;
					}

					this.sample.start(time, o, e);
					// calculate the release trigger time
					let rt = Math.max(0.001, e - this.adsr.release);
					this.adsr.triggerAttackRelease(rt, time);
				}
				// increment internal beat counter
				this._beatCount++;
			}
			// increment count for sequencing
			this._count++;
		}, this._time).start(schedule);
	}

	fadeOut(t){
		// fade out the sound upon evaluation of new code
		this.gain.gain.rampTo(0, t, Tone.now());
		setTimeout(() => {
			this.delete();
		}, t * 1000);
	}

	fadeIn(t){
		// fade in the sound upon evaluation of code
		this.gain.gain.rampTo(1, t, Tone.now());
	}

	delete(){
		// dispose loop
		this._loop.dispose();
		// disconnect the sound dispose the player
		// this.panner.disconnect();
		this.panner.dispose();
		// this.gain.disconnect();
		this.gain.dispose();
		// this.adsr.disconnect();
		this.adsr.dispose();
		// this.sample.disconnect();
		this.sample.dispose();
		// remove all fx
		// TODO: garbage collect and remove after fade out
		// Or delete once sound has reached a bottom threshold
		// Is this possible?
		this._fx.map((f) => f.delete());

		console.log('=> Disposed:', this._sound, 'with FX:', this._fx);
	}

	stop(){
		// stop sequencer
		this._loop.stop();
		// TO DO: fade in/out of sounds on start/stop sequencer
		// this.gain.gain.rampTo(0, 0.1);
	}

	start(){
		// restart at offset
		this._loop.start(this._offset);
		// this.gain.gain.rampTo(1, 0.1);
	}

	sound(s){
		// load all soundfiles and return as array
		this._sound = this.checkBuffer(Util.toArray(s));
	}

	checkBuffer(a){
		// check if file is part of the loaded samples
		return a.map((s) => {
			if (Array.isArray(s)) {
				return this.checkBuffer(s);
			}
			// error if soundfile does not exist
			else if (!this._bufs.has(s)){
				// set default (or an ampty soundfile?)
				log(`sample ${s} not found`);
				return 'kick_min';
			}
			return s;
		});
	}

	amp(g, r){
		// set the gain and ramp time
		g = Util.toArray(g);
		r = (r !== undefined)? Util.toArray(r) : [ 0 ];
		// convert amplitude to dBFullScale
		this._gain[0] = g.map(g => 20 * Math.log(g * 0.707) );
		this._gain[1] = r.map(r => Util.msToS(Math.max(0, r)) );
	}

	time(t, o=0){
		// set the timing interval and offset
		// this._time = Util.toArray(t);
		this._time = Util.formatRatio(t, this._engine.getBPM());
		this._offset = Util.formatRatio(o, this._engine.getBPM());
	}

	beat(b){
		// set the beat pattern as an array
		this._beat = Util.toArray(b);
	}

	speed(s){
		// set the speed pattern as an array
		this._speed = Util.toArray(s);
	}

	stretch(s){
		// set the stretch loop bar length
		this._stretch = Util.toArray(s);
	}

	offset(o){
		// set the playback start position as an array
		this._pos = Util.toArray(o);
	}

	env(...e){
		// set the fade-in, sustain and fade-out times
		this._att = [ 0 ];
		this._rel = [ 0 ];
		this._sus = [ 0 ];

		if (e[0] === 'off' || e[0] < 0){
			this._att = null;
		} else {
			if (e.length === 1){
				// one argument is release time
				this._att = [ 1 ];
				this._rel = Util.toArray(e[0]);
			} else if (e.length === 2){
				// two arguments is attack & release
				this._att = Util.toArray(e[0]);
				this._rel = Util.toArray(e[1]);
			} else {
				// three is attack stustain and release
				this._att = Util.toArray(e[0]);
				this._sus = Util.toArray(e[1]);
				this._rel = Util.toArray(e[2]);
			}
		}
		// console.log('shape()', this._att, this._rel, this._sus);
	}

	name(n){
		// placeholder function for name
		// is not used besides when parsing in mercury-lang
		this._name = n;
	}

	group(g){
		// placeholder function for group
		// is not used besides when parsing in mercury-lang
		this._group = g;
	}

	pan(p){
		// the panning position of the sound
		this._pan = Util.toArray(p);
	}

	add_fx(...fx){
		// the effects chain for the sound
		this._fx = [];
		// console.log('Effects currently disabled');
		fx.forEach((f) => {
			if (fxMap[f[0]]){
				let tmpF = fxMap[f[0]](f.slice(1));
				this._fx.push(tmpF);
			} else {
				console.log(`Effect ${f[0]} does not exist`);
			}
		});
		// if any fx working
		if (this._fx.length){
			console.log(`Adding effect chain`, this._fx);
			// disconnect the panner
			this.panner.disconnect();
			// iterate over effects and get chain (send/return)
			this._ch = [];
			this._fx.map((f) => { this._ch.push(f.chain()) });
			// add all effects in chain and connect to Destination
			// every effect connects it's return to a send of the next
			// allowing to chain multiple effects within one process
			let pfx = this._ch[0];
			this.panner.connect(pfx.send);
			for (let f=1; f<this._ch.length; f++){
				if (pfx){
					pfx.return.connect(this._ch[f].send);
				}
				pfx = this._ch[f];
			}
			// pfx.return.connect(Tone.Destination);
			pfx.return.connect(this.gain);
		}
	}
}
module.exports = MonoSample;