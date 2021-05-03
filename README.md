# 🌕 Mercury Live Coding Playground

**A fun lite version of the Mercury Live Coding Environment running in the browser for quick experimentation and exploration.**

[**🚀 Start Sketching Online!**](https://mercury-sketch.glitch.me/)

[**🙏 Support Mercury by becoming a Patron**](https://www.patreon.com/bePatron?u=9649817) 

[**💬 Join the Discord Community**](https://discord.gg/vt59NYU)

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
ring loBeat [1 0 0 1 0.5]
ring hiBeat [0 1 0.2 0]

new sample tabla_lo time(1/8) play(loBeat)
new sample tabla_hi time(1/8) play(hiBeat)
```

<!-- Generate psuedorandom melodic content for a synthesizer in a range and set a scale

```java
set scale minor d
set randomSeed 31415

ring melody random(16 0 24)

new synth saw note(melody) time(1/16) shape(4 100)
```

Design sounds with various effects

```java
new sample chimes time(2) speed(-0.25) fx(reverb 0.3 15) fx(drive 10) fx(lfo 1/8 sine)
```

Easily give multiple instruments the same effects

```java
new sample chimes time(2)
new sample harp_down time(3)
new sample gong_lo time(5)

set all fx(lfo 1/16) fx(delay) fx(reverb 0.5 11)
```

Generate sequences algorithmically to compose complex structures and choose from an extensive library of algorithms to work with

```java
set scale minor a 

ring rhythm euclidean(32 13)

ring melody spread(5 0 24)
ring melody palinedrome(melody)
ring melody clone(melody 0 5 7 3)
ring melody lace(melody melody)

new synth triangle note(melody 1) shape(1 80) play(rhythm)
```

Control external midi devices or send midi to other applications and use clock sync

```java
set midi getPorts
//=> prints the available devices to the console
new midi "Your Awesome Midi Device" time(1/4) note(7 1) length(100) sync(on)
```

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

Easily control parameters in Mercury via external OSC-messages

```java
new synth triangle fx(reverb /extOSC/verbAmount) fx(filter low /extOSC/cutoff 0.4) time(1) shape(1 1000)
``` -->

**AND MANY MORE (TO COME...)**

Currently the playground does not have the full functionality of the original Mercury environment.

- [x] tempo
- [ ] scale / root
- [ ] highPass / lowPass
- [x] randomSeed
- [x] ring
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
	- [x] pan
	- [x] name
	- [ ] fx
- [ ] synth
- [ ] polySynth
- [ ] midi
- [ ] osc
- [ ] FX
	- [ ] reverb
	- [ ] filter
	- [ ] envFilter
	- [ ] drive
	- [ ] chip
	- [ ] delay
	- [ ] lfo
	- [ ] kink

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

It is now possible to code together in Mercury using the amazing [**Flok**](https://flok.clic.cf/) live coding environment in the browser.

- [Start coding together here](https://tmhglnd.github.io/mercury/collaborate.html)

## 🚀 Install

😎 No need for installing! You can start coding immediately here:
[**https://mercury-sketch.glitch.me/**](https://mercury-sketch.glitch.me/)

🤓 If you want to run and develop the application locally:

`$ git clone http://github.com/tmhglnd/mercury-playground`

`$ npm install`

`$ npm run build`

`$ npm start`

`$ open -a Google\ Chrome http://localhost:3000`

While developing: `npm run watch`

## 📖 Documentation

Full explanation of all the possibilities in Mercury:

- [Open the documentation](https://tmhglnd.github.io/mercury/table-of-content.html)

## 💻 System Requirements

A computer that runs a browser like Chrome or Firefox.

## 🎵 Sounds

Many sounds in Mercury are downloaded from [freesound.org](http://www.freesound.org) and are licensed with Creative Commons Attribution or Creative Commons 0 licenses. If not downloaded from freesound it is made sure that the license allows to redistribute the sounds via the Mercury environment and that you can use them in your projects. A list of all the available sounds and the original sample can be found here:

- [List of sounds and credits](https://github.com/tmhglnd/mercury/blob/master/mercury_ide/media/README.md)

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
