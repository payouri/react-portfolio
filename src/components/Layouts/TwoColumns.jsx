import React from 'react'
import PropTypes from 'prop-types'
import styles from './TwoColumns.css'

/**
 * 
 * @param {Object} props
 *  
 */
//TODO use props to 
const TwoColumns = ({ leftColStyle, rightColStyle, wrapperStyles, ratio, leftSlot, rightSlot }) => {

    const percentRatio = 100 * ratio;

    return (
        <div className={styles['wrapper']} style={wrapperStyles}>
            <div style={{...leftColStyle, /* maxWidth: `${percentRatio}%`, flexBasis: `${percentRatio}%`, */ }}>
                { leftSlot }
            </div>
            <div style={{...rightColStyle, /* maxWidth: `${100 - percentRatio}%`, flexBasis: `${100 - percentRatio}%`, */ }}>
                { rightSlot }
            </div>
        </div>
    )

}

TwoColumns.propTypes = {
    leftColStyle: PropTypes.object,
    rightColStyle: PropTypes.object,
    wrapperStyles: PropTypes.object,
    ratio: PropTypes.number,
    leftSlot: PropTypes.oneOfType([ PropTypes.element, PropTypes.node ]),
    rightSlot: PropTypes.oneOfType([ PropTypes.element, PropTypes.node ]),
}

TwoColumns.defaultProps = {
    leftColStyle: {},
    rightColStyle: {},
    wrapperStyles: {},
    ratio: .25,
}

export default TwoColumns;