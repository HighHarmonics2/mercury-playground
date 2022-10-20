# 🌕 Mercury Live Coding Playground

**A version of the Mercury Live Coding Environment running in the browser for quick experimentation and exploration.**

Mercury currently has 2 versions:

* Web version running in the browser (Windows/Mac/Linux) (you're in the right place)
* Standalone version running in Max8 (Windows/Mac only) [go to this repo](https://github.com/tmhglnd/mercury)

[**🚀 Start Sketching Online!**](https://mercury.timohoogland.com/)

**👾 Or code with the latest full version:** 

[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/tmhglnd/mercury)](https://github.com/tmhglnd/mercury/releases)

[**📟 Build a local app from the browser version with Electron**](https://github.com/tmhglnd/mercury-app)

[**🙏 Support Mercury by becoming a Patron**](https://www.patreon.com/bePatron?u=9649817) 

[**💬 Join the Mercury Community on Discord**](https://discord.gg/vt59NYU)

![The Mercury playground in the browser](media/screenshot.png)

## 📋 Table of Contents

<!-- - [Newest Features](#-newest-features) -->
- 📟 [Mercury?](#-about)
- 🎮 [What can I do with Mercury?](#-features-overview)
- 🔭 [Who is it for?](#-vision--goals)
- 👩‍💻 [Code together with others!](#-collaborative-coding)
- 🚀 [Let's get started!](#-install)
	- [Tutorial](https://tmhglnd.github.io/mercury/tutorial.html)
	- [Documentation](https://tmhglnd.github.io/mercury/table-of-content.html)
	- [System Requirements](#-system-requirements)
	- [Sounds in Mercury](https://github.com/tmhglnd/mercury/blob/master/mercury_ide/media/README.md)
- 🤓 [I like to help](#-contribute)
- 🔋 [Powered By](#-powered-by)
- 🙏 [Thanks](#-thanks)
- 📄 [Licenses](#-licenses)

## 📟 About 

**Mercury is a minimal and human-readable language for the live coding of algorithmic electronic music.** 

All elements of the language are designed around making code more accessible and less obfuscating for the audience. This motivation stretches down to the coding style itself which uses clear descriptive names for functions and a clear syntax. Furthermore the editor is restricted to 30 lines of code, keeping all code always visible. Mercury provides the performer with an extensive library of algorithms to generate or transform numbersequences that can modulate parameters, such as melody and rhythm, over time. The environment produces sound in conjunction with visuals. Besides looking at the code, the audience is also looking at the visuals that are reactive to the sound or generated by the sound.

It is named after te planet Mercury. Mercury rules the creation and expression of our mental processes. The planet implores us to express ourselves. Mercury is about a quick wit, quick thinking. It lets us move from one thing to the next.

Mercury is orginally programmed in the Cycling'74 Max8 node-based creative coding environment. This "lite" version is build for the browser using the Tone.js framework.

Mercury uses the [Total Serialism NodeJS](https://github.com/tmhglnd/total-serialism#total-serialism) package available on npmjs.com. This package contains an extensive library of algorithmic composition methods.

<!-- ![Screenshot of the Mercury environment](media/mercury-screenshot2.png) -->

## 🎮 Features Overview

Quick access to playback of samples and change timing and tempo of samples or synthesizers

```java
set tempo 89

new sample kick_909 time(1/4)
new sample hat_909 time(3/16)
```

Make rhythmic patterns with sequences of numbers and probabilities

```java
list loBeat [1 0 0 1 0.5]
list hiBeat [0 1 0.2 0]

new sample tabla_lo time(1/8) play(loBeat)
new sample tabla_hi time(1/8) play(hiBeat)
```

Generate psuedorandom melodic content for a synthesizer in a range and set a scale

```java
set scale minor a
set randomSeed 31415

list melody random(16 0 24)

new synth saw note(melody) time(1/16) shape(4 100)
```

Generate sequences algorithmically to compose complex structures and choose from an extensive library of algorithms to work with

```java
set tempo 132
list rhythm euclid(32 13)

list melody spread(5 0 24)
list melody palindrome(melody)
list melody clone(melody 0 5 7 3)
list melody lace(melody melody)

new synth triangle time(1/16) note(melody 1) shape(1 80) play(rhythm)
```

Design sounds with various effects (and upload your own sounds to use)

```java
new sample chimes time(2) speed(0.25) fx(reverb 0.3 15) fx(drive 10) fx(shift 3 0.5)
```

Easily give multiple instruments the same effects

```java
new sample chimes time(2)
new sample harp_down time(3)
new sample gong_lo time(5)

set all fx(reverb 0.5 11) fx(drive 1.5) fx(filter low 2000 0.6)
```

Sync audio loops to the tempo of your music

```java
set tempo 97

new loop amen time(1)
new sample kick_house time(1/4)
```

Control external midi devices or applications by sending midi and cc <!--and use clock sync-->

```java
new midi "Your Awesome Midi Device" time(1/16) note(7 1) name(mDev)
    set mDev length(1/16) gain(0.8) chord(off)
    set mDev cc(10 [20 50 100])
```

Sequence Hyrda visuals with instruments (experimental)

```java
list hydras ['osc(10,0.1,2).out()' 'osc(20,-0.5,5).out()' 'osc(5,1,12).out()']

new sample kick_min time(1/16) play([1 0 0 1 0]) visual(hydras)
```
<!-- 
Control other environments via OSC-messages

```java
ring params [0.25 0.5 0.75]

new emitter osc address(yourDevice) theParam(params) time(1/4)

// emits => /yourDevice/theParam 0.25
//          /yourDevice/theParam 0.5
//          /yourDevice/theParam 0.75
//          /yourDevice/theParam 0.25
//          etc...
```
-->

Easily control parameters in Mercury via external OSC-messages (only when running [localhost](#-install))

```java
new synth triangle fx(reverb '/synth/verb') fx(filter low '/synth/cutoff' 0.4) time(1) shape(1 'synth/length')
```

**AND MANY MORE (TO COME...)**

The playground does not have exactly the same functionality of the original Mercury environment running in Max8. See below the differences. You may also encounter some discrepancies in syntax. Please support issues if you find any.

- [x] tempo
- [x] scale
- [x] volume
- [x] lowPass / highPass
- [x] randomSeed
- [x] list
	- [x] spread / spreadInclusive / fill
	- [x] random / coin / dice / choose / pick / drunk / urn / shuffle
	- [x] sine / cosine
	- [x] join / duplicate / merge / repeat / lace
	- [x] merge / reverse / invert / palindrome
	- [x] expand / stretch / clone / spray / unique / 
	- [x] fibonacci / pisano / pell / lucas
	- [x] euclidean / hexBeat
	- [x] add / subtract / multiply / divide / modulo
- [x] sample
	- [x] type
	- [x] time
	- [x] shape
	- [x] beat
	- [x] gain
	- [x] speed
		- [x] reverse
	- [ ] note
	- [x] pan
	- [x] name
	- [x] fx
- [x] synth
	- [x] wave
		- [x] super
	- [x] time
	- [x] shape
	- [x] beat
	- [x] gain
	- [x] note
		- [x] map to scale
	- [x] pan
	- [x] name
	- [x] fx
	- [x] slide
- [ ] sampler
- [ ] polySynth
- [ ] polySample
- [ ] midi
	- [x] device
	- [x] time
	- [x] length
	- [x] gain
	- [x] out
	- [x] chord
	- [x] name
	- [x] change
	- [ ] bend
	- [ ] sync
- [ ] osc
	- [x] receive parameters as arguments
- [ ] fx
	- [ ] chip (downsampling)
	- [x] delay
		- [x] stereo feedback delay with damping
		- [ ] ping pong feedback delay
	- [x] drive (softclipping distortion)
	- [x] squash (compress/overdrive)
	- [ ] kink (waveshaping)
	- [x] filter
		- [ ] modulation
	- [ ] envFilter
	- [x] lfo
	- [x] reverb
		- [x] decaying noise convolution
		- [ ] dattorro reverb algorithm
	- [x] shift (pitchshift)
	- [ ] chorus
		- [ ] double

## 🔭 Vision / Goals

This subset of Mercury was designed to use as a teaching environment for:
- introduction to (electronic) music
- algorithmic composition
- sequencing and pattern generating
- sound design
- creative coding and live coding
- sampling and beat making

⭐️ *watch and star this repo to keep up-to-date with the latest changes whenever they're made*

## 👩‍💻👨‍💻 Collaborative Coding

It is possible to code together in Mercury using the amazing [**Flok**](https://flok.clic.cf/) live coding editor in the browser together with the Mercury standalone version in Max8.

- [Start coding together here](https://tmhglnd.github.io/mercury/collaborate.html)

## 🚀 Install

😎 **No need for installing!** You can start coding immediately in the browser:
[**https://mercury.timohoogland.com/**](https://mercury.timohoogland.com/)

### 💻 Running without internet

🤓 If you want to run the application locally (for using without internet, or using the OSC functionality or when developing extra features):

In the Terminal navigate to the folder you want to install Mercury. Then run:

`git clone http://github.com/tmhglnd/mercury-playground`

Navigate to the cloned folder with:

`cd mercury-playground`

Then install all the dependecies:

`npm install` (make sure you have NodeJS v18 installed, check by running `node -v`)

Then build your local version:

`npm run build` (or `$ npm run watch` while developing)

Now start the local server:

`npm start`

Open a browser and go to `http://localhost:3000`. Once connected the Terminal will print:

```
Connected yH0SGEdRHbZD1IACAAAB
Receive messages from Mercury on port 9000
Send messages to Mercury on port 8000
```

Mercury can now receive OSC-messages on port `8000`

## 📖 Documentation

Full explanation of all the possibilities in Mercury:

- [Open the documentation](https://tmhglnd.github.io/mercury/table-of-content.html)

*NB: The Mercury Playground still lacks some functionalities, see the list above*

## 💻 System Requirements

Any laptop/desktop that runs a browser like Chrome, Brave or Firefox.

## 🎵 Sounds

Many sounds in Mercury are downloaded from [freesound.org](http://www.freesound.org) and are licensed with Creative Commons Attribution or Creative Commons 0 licenses. If not downloaded from freesound it is made sure that the license allows to redistribute the sounds via the Mercury environment and that you can use them in your projects. A list of all the available sounds and the original sample can be found here:

- [List of sounds and credits](https://github.com/tmhglnd/mercury/blob/master/mercury_ide/media/README.md)

### Use your own sounds

If you like to include your own sounds you can click `Add sounds` on the bottom right of the editor. When you run the application locally you can also replace or add any sounds to the `public/assets/samples` folder and run `npm run build`, this creates a new database of soundfiles in `src/data/samples.json`.

## ⚡️ Visuals

You can load Hydra visuals by pasting the compressed url code in the textarea below the Editor. Removing the link will disable the visual rendering. [Hydra](https://hydra.ojack.xyz/) is a Live coding visual synthesizer developed Olivia Jack.

![The Mercury playground in the browser](media/screenshot3.png)

[*Visual "Pixelscape" by Marianne Teixido*](https://hydra.ojack.xyz/?code=JTJGJTJGUGl4ZWxzY2FwZSUwQSUyRiUyRk1hcmlhbm5lJTIwVGVpeGlkbyUwQSUyRiUyRmh0dHBzJTNBJTJGJTJGZ2l0aHViLmNvbSUyRk1hcmlhbm5lVGVpeGlkbyUwQSUwQXNyYyhvMCklMEElMjAuc2F0dXJhdGUoMS4wMSklMEElMjAuc2NhbGUoLjk5OSklMEElMjAuY29sb3IoMS4wMSUyQzEuMDElMkMxLjAxKSUwQSUyMC5odWUoLjAxKSUwQSUyMC5tb2R1bGF0ZUh1ZShzcmMobzEpLmh1ZSguMykucG9zdGVyaXplKC0xKS5jb250cmFzdCguNyklMkMyKSUwQSUyMCUyMC5sYXllcihzcmMobzEpJTBBJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwLmx1bWEoKSUwQSUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMC5tdWx0KGdyYWRpZW50KDEpJTBBJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwLnNhdHVyYXRlKC45KSkpJTBBJTIwJTIwLm91dChvMCklMEElMEFub2lzZSgxJTJDJTIwLjIpJTBBJTIwJTIwLnJvdGF0ZSgyJTJDLjUpJTBBJTIwJTIwLmxheWVyKHNyYyhvMCklMEElMjAlMjAuc2Nyb2xsWCguMikpJTBBJTIwJTIwLm91dChvMSklMEElMEFyZW5kZXIobzAp)

## 📝 Contribute

Contributions to the Mercury environment are much appreciated in whatever form they come! Please follow the [guidelines here](docs/contribute.md)

## 🔋 Powered By

- Mercury was granted funding from [**Creative Industries Fund NL**](https://stimuleringsfonds.nl/en/)
- Mercury was granted in-kind funding from [**Creative Coding Utrecht**](https://creativecodingutrecht.nl/)

## 🙏 Thanks

- The [SEMA/MIMIC project](https://mimicproject.com/about) team (Thor Magnusson, Chris Kiefer and Francisco Bernardo) for their awesome full week workshop at Sussex University in Brighton on designing a live coding language in the browser combined with machine learning
- Roald van Dillewijn for working together on osc and midi functionalities combined with his [Digilog modified guitar-pedals](https://roaldvandillewijn.nl/projects/digilog)
- Guillem Gongora Moral for using Mercury as a composition tool and sharing valuable feedback in the process
- Anne Veinberg for working with Mercury and a Mercury extensions for the [CodeKlavier](https://codeklavier.space/) project
- Rafaele Maria Andrade for collaboration on [networked performance](https://www.youtube.com/watch?v=7UWywv_DPHI&t=4s) between Mercury and Knurl

## ✨ Inspiration

During the development of Mercury (both the playground and the full version) I've found inspiration in many other live coding environments, practices and other platforms. Some of these are:

- [Hydra](https://hydra.ojack.xyz/) - Live coding visual synthesizer by Olivia Jack
- [Sema](https://sema.codes/about) - Live coding language design platform combined with Machine Learning
- [MIMIC Project](https://mimicproject.com/about) - a web platform for the artistic exploration of musical machine learning and machine listening.
- [Tidal](https://tidalcycles.org/index.php/Welcome) - Live coding of patterns
- [Sonic Pi](https://sonic-pi.net/) - The live coding synth for everyone
- [Tone.js](https://tonejs.github.io/) - Webaudio framework for programming synths and sequencers
- [Nearley](https://nearley.js.org/) - Parsing toolkit

## 📄 Licenses

- Main Source - [The GNU GPL v.3 License](https://choosealicense.com/licenses/gpl-3.0/) (c) Timo Hoogland 2019
- Sound Files - Individually licensed, listed under [media/README.md](https://github.com/tmhglnd/mercury/blob/master/mercury_ide/media/README.md)
- Documentation - [The CC BY-SA 4.0 License](https://creativecommons.org/licenses/by-sa/4.0/) (c) Timo Hoogland 2019
- Examples - [The CC BY-SA 4.0 License](https://creativecommons.org/licenses/by-sa/4.0/) (c) Timo Hoogland 2019

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
