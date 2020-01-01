import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import Icon from '../Icon/Icon'
import styles from './SendButton.css'
function SendButton({children, onClick, disabled, ...props}) {
    
    const buttonRef = useRef()
    const [animated, setAnimated] = useState(false);
    const timer = useRef()
    
    const handleClick = e => { 
        if(disabled) {
            return
        }
        const { clientX, clientY } = e
        const buttonBCR = buttonRef.current.getBoundingClientRect()
        buttonRef.current.style.setProperty('--offsetX', `${clientX - buttonBCR.left - buttonBCR.width / 2}px`)
        buttonRef.current.style.setProperty('--offsetY', `${clientY - buttonBCR.top - buttonBCR.height / 2}px`)
        setAnimated(true)
        typeof onClick == 'function' && onClick(e) 
    }
    
    useEffect(() => {
        timer.current = setTimeout(() => {
            setAnimated(false);
        }, animDur)
        return () => {
            clearTimeout(timer.current)
        };
    }, [animated])

    const animDur = 1000

    return (
        <button disabled={disabled} ref={buttonRef} {...props} onClick={handleClick} className={styles['button']}>
            {/* <Icon icon={'envelope'} /> */}
            <Icon className={`${styles['animated-icon']} ${animated ? styles['animate'] : ''}`} style={{ animationDuration: animDur + 'ms' }} icon={'envelope'} />
            <Icon className={`${styles['animated-icon']} ${animated ? styles['animate'] : ''}`} style={{ animationDuration: animDur + 'ms' }} icon={'envelope'} />
            <Icon className={`${styles['animated-icon']} ${animated ? styles['animate'] : ''}`} style={{ animationDuration: animDur + 'ms' }} icon={'envelope'} />
            <Icon className={`${styles['animated-icon']} ${animated ? styles['animate'] : ''}`} style={{ animationDuration: animDur + 'ms' }} icon={'envelope'} />
            <Icon className={`${styles['animated-icon']} ${animated ? styles['animate'] : ''}`} style={{ animationDuration: animDur + 'ms' }} icon={'envelope'} />
            <Icon className={`${styles['animated-icon']} ${animated ? styles['animate'] : ''}`} style={{ animationDuration: animDur + 'ms' }} icon={'envelope'} />
            <Icon className={`${styles['animated-icon']} ${animated ? styles['animate'] : ''}`} style={{ animationDuration: animDur + 'ms' }} icon={'envelope'} />
            <Icon className={`${styles['animated-icon']} ${animated ? styles['animate'] : ''}`} style={{ animationDuration: animDur + 'ms' }} icon={'envelope'} />
            <Icon className={`${styles['animated-icon']} ${animated ? styles['animate'] : ''}`} style={{ animationDuration: animDur + 'ms' }} icon={'envelope'} />
            <Icon className={`${styles['animated-icon']} ${animated ? styles['animate'] : ''}`} style={{ animationDuration: animDur + 'ms' }} icon={'envelope'} />
            <Icon className={`${styles['animated-icon']} ${animated ? styles['animate'] : ''}`} style={{ animationDuration: animDur + 'ms' }} icon={'envelope'} />
            <Icon className={`${styles['animated-icon']} ${animated ? styles['animate'] : ''}`} style={{ animationDuration: animDur + 'ms' }} icon={'envelope'} />
            <span style={{ position: 'relative' }}>{children}</span>
        </button>
    )
}

SendButton.propTypes = {
    onClick: PropTypes.func,
    children: PropTypes.node,
    disabled: PropTypes.bool
}

export default SendButton
