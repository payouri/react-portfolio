import React from 'react'
import PropTypes from 'prop-types'
import styles from './CloseButton.css'

const Icon = React.lazy(() => import('@cmp/Icon/Icon'))

const CloseButton = props => {

    return (
        <button { ...props } className={styles['button']}>
            <span>
                <Icon icon={'times'} size={'2x'}/>
            </span>
            <span style={{ display: 'none' }}>Close</span>
        </button>
    )
}

export default CloseButton