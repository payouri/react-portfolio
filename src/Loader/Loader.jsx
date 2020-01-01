import React, { Component } from 'react'
import PropTypes from 'prop-types'

import styles from './Loader.css';

const Loader = props => (
    <div className={styles['loader-outer']} style={{...props.style, position: props.cover ? 'absolute' : 'relative'}}>
        <div className={`${styles['loader']} ${styles[`loader-${props.size}`]}`} style={{
            background: props.background,
            borderColor: props.color,
        }}></div>
    </div>
)
Loader.propTypes = {
    background: PropTypes.string,
    cover: PropTypes.bool.isRequired,
    color: PropTypes.string,
    style: PropTypes.object,
    size: PropTypes.oneOf(['sm', 'md', 'lg']).isRequired,
}
Loader.defaultProps = {
    cover: false,
    size: 'md',
}

export default Loader;