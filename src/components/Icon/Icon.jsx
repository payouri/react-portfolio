import React from 'react';
// import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import lib from './IconLibrary'

const Icon = ({ icon, color, size, prefix, className, style }) => {
    const ic = lib
    return <FontAwesomeIcon style={style} className={className} icon={prefix ? [prefix, icon] : icon} color={color} size={size} />
}

Icon.propTypes = FontAwesomeIcon.propTypes
export const iconLibrary = lib
export default Icon