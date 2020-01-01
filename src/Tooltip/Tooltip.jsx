import React, { useLayoutEffect, useEffect, useState } from 'react';
import PropTypes from 'prop-types'
import styles from './Tooltip.css'
import { faBtc } from '@fortawesome/free-brands-svg-icons';

const Tooltip = ({ label, position, rootElem, show, offsetX, offsetY, style, ...rest }) => {

    const [pos, setPos] = useState({ left: null, top: null, right: null, bottom: null, })

    useEffect(() => {
        if(rootElem) {
            setPos(calcPosition())
        } else {
            setPos({ left: null, top: null, right: null, bottom: null, })
        }
        return () => { setPos({ left: null, top: null, right: null, bottom: null, }) }
    }, [rootElem, show])

    const calcPosition = () => {
        const parentBCR = rootElem.parentNode.getBoundingClientRect()
        const bcr = rootElem.getBoundingClientRect()
        
        switch(position) {
            case 'bottom':
                return ({
                    left: `calc(${bcr.x - parentBCR.x + bcr.width / 2 + offsetX}px)`,
                    top: `calc(${bcr.y - parentBCR.y + bcr.height + offsetY}px)`,
                    right: null,
                    bottom: null,
                })
            case 'left':
                return ({
                    left: `calc(${parentBCR.x - bcr.x - bcr.width / 2}px - 100%)`,
                    top: `calc(${bcr.y - parentBCR.y + bcr.height /2 + offsetY}px)`,
                    right: null,
                    bottom: null,
                })
            case 'right':
                return ({
                    right: `calc(${parentBCR.x - bcr.x - bcr.width / 2}px - 100%)`,
                    top: `calc(${bcr.y - parentBCR.y + bcr.height /2 + offsetY}px)`,
                    left: null,
                    bottom: null,
                })
            case 'top':
            default:
                return ({
                    left: `calc(${bcr.x - parentBCR.x + bcr.width /2 + offsetX}px `,
                    top: `calc(${bcr.y - parentBCR.y + offsetY}px - .625rem)`,
                    right: null,
                    bottom: null,
                })
        }
    }
    return (
        <div {...rest} className={`${styles['tooltip-outer']} ${show ? styles['visible'] : ''} ${styles[position] ? styles[position] : styles['top']}`} style={{ ...style, zIndex: 9999, ...pos }}>
            { label }
        </div>
    )
}

Tooltip.propTypes = {
    label: PropTypes.string,
    position: PropTypes.oneOf([ 'top', 'bottom', 'left', 'right' ]),
    rootElem: PropTypes.node,
}

Tooltip.defaultProps = {
    offsetY: 0,
    offsetX: 0,
    position: 'right',
}

export default Tooltip