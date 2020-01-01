import React from 'react'
import PropTypes from 'prop-types'
import { Consumer } from '../contexts/AppContext'
export default WrappedComponent => ({ ...props }) => (
    
        <Consumer>
            { ctx => <WrappedComponent app={ctx} {...props} /> }
        </Consumer>
        
)
