import React, { Component, memo } from 'react'
import PropTypes from 'prop-types'
import { randomPick } from '@youri-kane/js_utils/ArrayUtils'
import styles from './ShapeBackground.css'
import icons from '@assets/css/geom-icons.css'

const Shape = function({ left, top, icon, style, color, size, delay, animation }) {
    const colors = {
        red: styles['shape-red'],
        teal: styles['shape-teal'],
        blue: styles['shape-blue'],
        green: styles['shape-green'],
        orange: styles['shape-orange'],
        yellow: styles['shape-yellow'],
        indigo: styles['shape-indigo'],
        purple: styles['shape-purple'],
        white: styles['shape-white'],
        gray: styles['shape-gray'],
    }
    return <span className={`${styles['shape']} ${colors[color]} ${icons[`icon-${icon}`]}`} style={{
        ...style,
        display: 'block',
        left: left,
        top: top,
        fontSize: size,
        animation: animation ? undefined : 'unset',
        animationDelay: `${delay}ms`,
    }}></span>

}

Shape.propTypes = {
    left: PropTypes.string,
    top: PropTypes.string,
    icon: PropTypes.string,
    style: PropTypes.object,
    color: PropTypes.string,
    size: PropTypes.string,
    delay: PropTypes.number,
    animation: PropTypes.bool,
}

class ShapeBackground extends Component {
    
    shouldComponentUpdate(prevProps) {
        return prevProps.shapes !== this.props.shapes
    }

    constructor(props) {
        super(props)

        this.canvasRef = React.createRef();
        this.backgroundRef = React.createRef();

        this.backgroundImgURI = '';
        this.ctx = null;
        this.update;
    }
    _generateShapes = n => {
        const colors = [ 'red', 'teal', 'blue', 'green', 'orange', 'yellow', 'indigo', 'purple', 'white', 'gray', ]
        const shapes = [ 'octagone', 'square', 'star', 'triangle', 'arrows', 'arrows', 'circle', 'hexagone', ]
        return (Array.from({ length: n }, (x, index) => (
            <Shape
                key={index}
                color={randomPick(colors)}
                icon={randomPick(shapes)}
                size={2 + Math.random() * 3 + 'rem'}
                top={`${Math.random() * 200 - 50}%`}
                left={`${Math.random() * 200 - 50}%`}
                delay={Math.round(Math.random() * 1200 - 500)}
                animation={this.props.animation}
            />
        )))
    } 
    render() {
        const { shapes, wrapperStyle, paneStyle } = this.props
        return (
            <div className={styles['shapes-wrapper']} ref={this.backgroundRef} style={wrapperStyle}>
                <div className={styles['shapes-pane']} style={paneStyle}>
                    { shapes
                        ? shapes.map(s => <Shape key={Object.values(s).join('')} {...s} />)
                        : this._generateShapes(80)
                    }
                </div>
            </div>
        )
    }
}

ShapeBackground.propTypes = {
    animation: PropTypes.bool,
    shapes: PropTypes.array,
}

ShapeBackground.defaultProps = {
    animation: true,
}

export default memo(ShapeBackground)