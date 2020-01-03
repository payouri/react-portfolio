import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { randomPick } from '@youri-kane/js_utils/ArrayUtils'
import styles from './ShapeBackground.css'
import icons from '@assets/css/geom-icons.css'

const Shape = function({ left, top, icon, style, color, size, delay, animated }) {

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
        animation: animated ? undefined : 'unset',
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
    animated: PropTypes.bool,
}

export default class ShapeBackground extends Component {

    componentDidMount() {
      
        // this.ctx = this.canvasRef.current.getContext('2d');
        // this._resizeCanvas();
        // this._drawBackground();
        // this._updateBackground();

    }
    
    constructor(props) {
        super(props)

        this.canvasRef = React.createRef();
        this.backgroundRef = React.createRef();

        this.backgroundImgURI = '';
        this.ctx = null;
        this.update;

        // this._drawBackground = this._drawBackground.bind(this);
        // this._resizeCanvas = this._resizeCanvas.bind(this);
        // this._updateBackground = this._updateBackground.bind(this);
    }
    // _updateBackground() {

    //     this._drawBackground();
    //     this.update = requestAnimationFrame(this._updateBackground);

    // }
    _resizeCanvas() {
        
        const canvas = this.canvasRef.current,
            background = this.backgroundRef.current,
            backgroundBCR = background.getBoundingClientRect();

        canvas.width = backgroundBCR.width
        canvas.height = backgroundBCR.height

    }
    _drawBackground() {

        const canvas = this.canvasRef.current,
            background = this.backgroundRef.current,
            backgroundBCR = background.getBoundingClientRect();

        const svgTemplate = `
            <svg height="${backgroundBCR.height}" width="${backgroundBCR.width}" xmlns="http://www.w3.org/2000/svg">
                <foreignObject x="0" y="0" width="${backgroundBCR.width}" height="${backgroundBCR.height}">
                    ${Array.from(document.head.querySelectorAll('style')).map(s => s.outerHTML).join('')}
                    <div xmlns="http://www.w3.org/1999/xhtml">
                        ${background.outerHTML}
                    </div>
                </foreignObject>
            </svg>
        `.trim();
        
        const svgElem = new Blob([svgTemplate], {type: 'image/svg+xml;charset=utf-8'});

        // console.log(svgElem)

        this.backgroundImgURI = (window.URL || window.webkitURL || window).createObjectURL(svgElem);

// console.log(this.backgroundImgURI)

        const img = new Image();
        img.onload = () => {
            this.ctx.clearRect(0, 0, canvas.width, canvas.height)
            // this.ctx.scale(2, 2)
            this.ctx.drawImage(img, 0, 0);
            // this.ctx.setTransform(1, 0, 0, 1, 0, 0);

            (window.URL || window.webkitURL || window).revokeObjectURL(this.backgroundImgURI);
        }
        img.src = this.backgroundImgURI

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
                animated={this.props.animated}
            />
        )))
    } 
    render() {
        const { shapes } = this.props
        return (
            <>
                <div className={styles['shapes-wrapper']} ref={this.backgroundRef}>
                    <div className={styles['shapes-pane']}>
                        { shapes
                            ? shapes.map(s => <Shape key={Object.values(s).join('')} {...s} />)
                            : this._generateShapes(80)
                        }
                        {/* <Shape color={'orange'} top={'50%'} left={'5rem'} size={'4rem'} icon={'octagone'}/>
                        <Shape color={'green'} top={'70%'} left={'92%'} size={'1.5rem'} icon={'triangle'}/>
                        <Shape color={'white'} top={'20%'} left={'66%'} size={'2rem'} icon={'square'}/>
                        <Shape color={'yellow'} top={'23%'} left={'41%'} size={'2rem'} icon={'star'}/>
                        <Shape color={'blue'} top={'6.5%'} left={'12%'} size='.75rem' icon={'arrows-down'}/>
                        <Shape color={'orange'} icon={'arrows-up'}/>
                        <Shape color={'red'} top={'12%'} left={'81%'} icon={'circle'}/>
                        <Shape color={'red'} top={'82%'} left={'20%'} icon={'circle'}/>
                        <Shape color={'red'} top={'33%'} left={'30%'} icon={'circle'}/>
                        <Shape color={'red'} top={'85%'} left={'75%'} icon={'circle'}/> */}
                    </div>
                </div>
                {/* <canvas style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, width: '100%', height: '100%',  }} ref={this.canvasRef}></canvas> */}
            </>
        )
    }
}

ShapeBackground.propTypes = {
    animated: PropTypes.bool,
    shapes: PropTypes.array,
}

ShapeBackground.defaultProps = {
    animated: true,
}
