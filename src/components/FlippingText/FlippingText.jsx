import React, { /* lazy, */ Component } from 'react'
// import PropTypes from 'prop-types'
import pausableTimeout from '@utils/pausableTimeout'
import { debounce } from '@youri-kane/js_utils/EventUtils'
import styles from './FlippingText.css'

const words = [
    'Creative',
    'Dedicated',
    'Curious',
    'Passionate',
]
const wordsByLen = words.map(w => w.length);
const offsetTime = 500;

class FlippingText extends Component {

    componentDidMount() {
        this.interval = pausableTimeout(() => {

            this.nextWord()

        }, this.timer + offsetTime);
        window.addEventListener('blur', this._onFocusBlur)
        window.addEventListener('focus', this._onFocusBlur)
        window.addEventListener('resize', debounce(this._onWindowResize, 75, true))
     
        this.titleWidth = this._getTitleWidth()
    }

    componentWillUnmount() {

        this.interval.pause();
        window.removeEventListener('blur', this._onFocusBlur)
        window.removeEventListener('focus', this._onFocusBlur)
        window.removeEventListener('resize', debounce(this._onWindowResize, 75, true))

    }
    
    constructor(props) {

        super(props)

        this.state = {
            index: 0,
        }
        this.interval = null;
        this.timer = this._calcInterval()
        this.titleWidth = 0;
        
        this.nextWord = this.nextWord.bind(this)
        
        this.longestWordIndex = wordsByLen.indexOf(Math.max.apply(this, wordsByLen));
        this.longestRef = React.createRef();

        this._onFocusBlur = this._onFocusBlur.bind(this)
        this._onWindowResize = this._onWindowResize.bind(this)

    }
    _onFocusBlur(e) {

        const { type } = e;

        if(type == 'blur')
            this.interval.pause();
        else
            this.interval.resume();

    }
    _onWindowResize() {

        this.titleWidth = this._getTitleWidth()

    }
    _getTitleWidth() {
        return this.longestRef.current.getBoundingClientRect()['width']
    }
    _calcInterval() {
        return words[this.state.index].length * 100;
    }
    _calcCharTransition(charArray, wordIndex) {
        
        return charArray.map((char, index) => <span key={char+index} className={`${styles['letter']} ${wordIndex == this.state.index ? styles['active'] : ''}`} style={{ transitionDelay: `${index * 55}ms` }}>{char}</span>)

    }
    _sliceWord(word) {
        return word.split('');
    }
    nextWord() {

        const { index } = this.state;

        this.setState({
            index: index < words.length - 1 ? index + 1 : 0,
        }, () => {
            clearTimeout(this.interval)
            const interval = this._calcInterval();
            this.interval = pausableTimeout(() => {
                this.nextWord()
            }, interval + offsetTime)
            this.timer = interval;
        })
        

    }
    render() {

        const titleWidth = this.titleWidth ? this.titleWidth : 'auto'

        return (
            <div className={styles['flipping-text-wrapper']}>
                <h2 className={styles['title']}>
                    <div className={styles['fixed-text']}>In my mind good developers are&nbsp;</div>
                    <div className={styles['changing-text']} style={{ flex: `0 0 ${titleWidth}px`, width: titleWidth  }}>
                        { words.map((word, index) => (
                            <div key={word+index} ref={index == this.longestWordIndex ? this.longestRef : undefined} className={styles['letters-wrap']}>
                                {this._calcCharTransition(this._sliceWord(word), index)}
                            </div>
                        )) }
                    </div>
                </h2>
            </div>
        )
    }
}

FlippingText.propTypes = {

}

export default FlippingText