import React from 'react'
import PropTypes from 'prop-types'
import styles from './TextArea.css'
import { generateHexKey } from '@youri-kane/js_utils/StringUtils'

function TextArea({ inputRef, label, id, ...props }) {
    id = id ? id : generateHexKey()
    return (
        <div className={styles['textarea-wrapper']}>
            <textarea id={id} className={styles['textarea']} {...props} ref={inputRef} placeholder={' '}/>
            <label htmlFor={id} className={styles['label']}>{label ? label : 'Label'}</label>
        </div>
    )
}

TextArea.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    inputRef: PropTypes.object,
}

export default TextArea
