import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'

import styles from './TextTyper.css'

const TextTyper = ({ str, pausingIndexes, pauseTime, timeBetweenType, typeUntil, ...rest }) => {

    const [index, setIndex] = useState(0)
    const [emoCount, setEmoCount] = useState(0)
    const ref = useRef(null)

    useEffect(() => {
        const wait = pausingIndexes.includes(index) ? pauseTime : typeof timeBetweenType == 'function' ? timeBetweenType(index) : timeBetweenType
        ref.current = setTimeout(() => {
            if(index < str.length && (typeof typeUntil != 'number' || index < typeUntil))
                type();
            else {
                clearTimeout(ref.current)
                if(typeof typeUntil == 'number')
                    setIndex(str.length)
            }
        }, wait)
        return () => { clearTimeout(ref.current) }
    }, [str, index])

    const type = () => {

        let newIndex = index + 1
        if(str[newIndex] === '<') {

            newIndex = str.indexOf('>', newIndex)

        }
        setIndex(newIndex)

    }
    return (
        <div { ...rest} className={styles['about-me']}>
            <span
                className={styles['my-text']}
                dangerouslySetInnerHTML={{ __html: str.substring(0, index) }} />
            <span
                style={{ position: "relative", top: -4 }}
                className={pausingIndexes.includes(index) || index == str.length || index == typeUntil ? styles['blinking-cursor'] : ''}>
                |
            </span>
        </div>
    )

}

TextTyper.propTypes = {
    str: PropTypes.string,
    pausingIndexes: PropTypes.arrayOf(PropTypes.number),
    pauseTime: PropTypes.number,
    timeBetweenType: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
    typeUntil: PropTypes.number,
}

export default TextTyper