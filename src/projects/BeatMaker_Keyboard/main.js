import './index.html'
import styles from './styles.css'

console.log(styles)

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
// window.addEventListener('keydown', e => {
//   console.log(e)
// }, false)
function genCharArray(charA, charZ) {
    var a = [],
        i = charA.charCodeAt(0),
        j = charZ.charCodeAt(0);
    for (; i <= j; ++i) {
        a.push(String.fromCharCode(i));
    }
    return a;
}

function on(event, target, callback, force) {
    if (force === undefined) {
        target.addEventListener(event, callback, false)
    } else {
        target.addEventListener(event, callback, force)
    }
}
class Screen {
    constructor(DOMCtx, AudioCtx, analyser) {
        this.DOMCtx = DOMCtx;
        this.DOMElem;
        this.ctx;
        this.AudioCtx = AudioCtx;
        this.analyser = analyser;
        this.data;
        this.ad;
        this.b;
    }
    animate() {

    }
    createScreen() {
        let canvas = document.createElement('canvas');
        // console.log(this.DOMCtx.getBoundingClientRect());
        canvas.classList.add(styles['keyboard--visualizer']);
        // canvas.style.width = '100%';
        // canvas.style.height = '20vmin';
        this.DOMElem = canvas;
    }
    setup() {
        this.ctx = this.DOMElem.getContext('2d');
        this.b = this.analyser.fftSize / 2;
        this.data = new Uint8Array(this.b);
        let canvas = {
                height: this.DOMElem.height,
                width: this.DOMElem.width
            },
            ctx = this.ctx;
        let width = this.DOMElem.width / this.b;
        let draw = _ => {

            let x = 0,
                y = canvas.height / 2;
            ctx.fillStyle = "#ddd";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fill();
            this.analyser.getByteTimeDomainData(this.data);
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(18, 18, 18, .5)';
            ctx.beginPath();
            for (let i = 0; i < this.data.length; i++) {
                let v = this.data[i] / 128;
                if (i === 0) {
                    ctx.moveTo(x, y)
                } else {
                    ctx.lineTo(x, v * y);
                    // ctx.moveTo(x, v * y);
                }
                x += width;
            }
            // ctx.lineTo(this.DOMElem.width, this.DOMElem.height/2);
            // console.log(x)
            ctx.stroke();
            requestAnimationFrame(draw);
        }
        draw();
    }
}
class Key {
    constructor({
        letter,
        parent,
        soundUri
    }) {

        this.letter = letter;
        this.parent = parent;
        this.sound = soundUri;
        this.output;
        this.createDOMElem = _ => {
            let key = document.createElement('div');
            key.setAttribute('data-key', this.letter);
            key.style.gridArea = this.letter;
            key.classList.add(styles['keyboard--key'])
            key.classList.add('key--' + this.letter);
            key.innerText = this.letter;

            return key;
        }
        this.domElem = this.createDOMElem();
        this.keypress = ({
            key
        }) => {
            if (key === this.letter) {
                this.domElem.classList.toggle(styles['pressed'], true);
                if (this.sound) {
                    // console.log(this.sound)
                    if (this.sound instanceof OscillatorNode)
                        this.sound.connect(this.output);
                    else if (this.sound instanceof HTMLAudioElement)
                        this.sound.play();
                }
            }
        };
        this.keyrelease = ({
            key
        }) => {

            if (key === this.letter) {
                this.domElem.classList.toggle(styles["pressed"], false);
                if (this.sound) {

                    if (this.sound instanceof OscillatorNode)

                        this.sound.disconnect(this.output);

                    else if (this.sound instanceof HTMLAudioElement) {

                        this.sound.pause();
                        this.sound.currentTime = 0;

                    }
                }
            }

        }
        this.onKeyDown = on('keydown', document, this.keypress);
        this.onKeyDown = on('keyup', document, this.keyrelease);
    }
    linkSound(audioCtx, type, options = {
        output: audioCtx.destination
    }) {
        if (audioCtx) {
            switch (type) {
                case 'oscillator':
                    this.sound = audioCtx.createOscillator();

                    if (options && options.waveType) {
                        this.sound.type = options.waveType;
                    } else {
                        this.sound.type = 'sine';
                    }
                    if (options && options.frequency) {
                        this.sound.frequency.value = options.frenquency;
                    } else {
                        this.sound.frequency.value = getRandomInt(1, 22000);
                    }
                    this.sound.start();
                    break;

                case 'audioBuffer':
                    break;

                case 'audioUri':

                    const audioNode = document.createElement('audio');
                    audioNode.src = this.sound;
                    audioCtx.createMediaElementSource(audio);

                    this.sound = audioNode;

                    break;

                default:
                    console.log(type);
                    break;
            }
            this.output = options.output;
        }
        // console.log(audioCtx);
    }
}
class AudioKeyboard {
    constructor(wrapper, keys) {

        this.wrapper = wrapper;
        this.keys;
        this.visualizer;
        this.audioContext = new AudioContext;
        this.analyser;
        this.DOMKeyboard;
        this.setupKeys = parent => {
            this.keys = keys.map(letter => {
                return new Key({
                    letter,
                    parent
                });
            });
            this.keys.forEach(key => {
                key.linkSound(this.audioContext, 'oscillator', {
                    output: this.analyser,
                    soundUri: key.sound
                });
                this.DOMKeyboard.appendChild(key.domElem);
            })
        }
        this.setupAnalyser = _ => {
            let analyser = new AnalyserNode(this.audioContext, {
                fftSize: 2048,
                maxDecibels: -10,
                minDecibels: -80,
                smoothingTimeConstant: .9,
            });
            this.analyser = analyser;
            this.analyser.connect(this.audioContext.destination);
        }
        this.updateVisualizer = _ => {
            // this.visualizer.update(this.analyser.getByteTimeDomainData(new Uint8Array(this.analyser.fftSize)));
            // requestAnimationFrame(this.updateVisualizer);
        }
        this.setupVisualizer = _ => {
            this.visualizer.setup();
        }
        this.createNewVisualizer = _ => {
            this.visualizer = new Screen(this.wrapper, this.audioContext, this.analyser);
            this.visualizer.createScreen();
        }
        this.setupKeyboard = _ => {
            let DOMKeyboard = document.createElement('div');
            DOMKeyboard.classList.add(styles['keyboard']);
            this.DOMKeyboard = DOMKeyboard;
            this.setupAnalyser();
            this.setupKeys(this.DOMKeyboard);
            this.createNewVisualizer(this.wrapper, this.audioContext);
            this.wrapper.appendChild(this.visualizer.DOMElem);
            this.visualizer.DOMElem.width = this.wrapper.getBoundingClientRect().width;
            this.visualizer.DOMElem.height = this.wrapper.getBoundingClientRect().height;
            this.wrapper.appendChild(DOMKeyboard);
        };
    }
    onWindowResize(e) {

    }
    sizeWrapper() {
        this.wrapper.style.width = '99.5vmin';
        window.addEventListener('resize', this.onWindowResize, false);
    }
    init() {
        this.sizeWrapper();
        this.setupKeyboard();
        this.setupVisualizer();
    }
    update(options = {}) {
        this.updateVisualizer();
    }
}
document.addEventListener('DOMContentLoaded', e => {
    const keyboardWrapper = document.querySelector('.keyboard--wrapper')
    keyboardWrapper.classList.add(styles['keyboard--wrapper'])
    const alphabet = genCharArray('a', 'z');

    let keyboard = new AudioKeyboard(keyboardWrapper, alphabet);

    keyboard.init();
}, false)