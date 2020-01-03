import React from 'react'
import PropTypes from 'prop-types'
import styles from './Input.css'
import { generateRandom } from '@youri-kane/js_utils/StringUtils'

function Input({ inputRef, label, id, ...props }) {
    id = id ? id : generateRandom()
    return (
        <div className={styles['input-wrapper']}>
            <input id={id} className={styles['input']} {...props} ref={inputRef} placeholder={' '}/>
            <label htmlFor={id} className={styles['label']}>{label ? label : 'Label'}</label>
        </div>
    )
}

Input.propTypes = {
    id: PropTypes.string,
    inputRef: PropTypes.object,
    label: PropTypes.string
}

export default Input
