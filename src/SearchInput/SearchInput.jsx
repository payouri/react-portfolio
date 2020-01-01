import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import Icon from '../Icon/Icon'

const SearchInput = ({ wrapperStyle, ...rest }) => {

    const inputRef = useRef()

    return (
        <label style={wrapperStyle}>
            <Icon icon={'search'}/>
            <input ref={inputRef} {...rest}/>
        </label>
    )
    
}

export default SearchInput