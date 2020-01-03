import React from 'react'
import PropTypes from 'prop-types'
import WithAppContext from '@hoc/WithAppContext'

const AppScreen = ({ children, height, width, avoidNav, app, ...props }) => {
    return (
        <div {...props} style={ !avoidNav ? { 
            height: height || '100%', width: width || '100%',
            } : {
            transform: app.navbarOpen ? `translateY(${app.navbarHeight}px)` : 'translate(0)',
            transition: app.navbarOpen ? 'transform 225ms' : 'transform 225ms 175ms',
            position: 'relative', overflow: 'hidden',
            maxHeight: '100%', height: '100%', width: '100%',
        }}>
            { children }
        </div>
    )
} 

AppScreen.propTypes = {
    children: PropTypes.node,
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    avoidNav: PropTypes.bool,
    app: PropTypes.shape({
        navbarOpen: PropTypes.bool,
        navbarHeight: PropTypes.number
    })
}

export default WithAppContext(AppScreen);