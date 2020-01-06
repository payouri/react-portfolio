import React, { Component, /* Suspense, */ lazy } from 'react'
import PropTypes from 'prop-types'
const Loader = lazy(() => import('@cmp/Loader/Loader'))
const CloseButton = lazy(() => import('@cmp/Button/CloseButton'))
// const iframe =lazy(() => {



// })

export default class ProjectIframe extends Component {
    componentDidMount() {
        if(this.iframeRef.current) {
            console.log(this.iframeRef.current)
        }
    }
    componentDidUpdate(prevProps) {

        if(prevProps.project != this.props.project) {
            this.setState({ loaded: false, })
        }

    }
    constructor(props) {
        super(props)
        this.wrapperRef = React.createRef();
        this.iframeRef = React.createRef();
        this.state = {
            loaded: false,
        }
    }
    render() {

        const { project, width, height, closeButton, onCloseClick } = this.props;
        const { loaded } = this.state;

        return (
            <div ref={this.wrapperRef} className='project-wrapper' style={{ position: 'relative', height: height ? height : '100%', width: width ? width : '100%' }}>
                { closeButton && onCloseClick && <CloseButton style={{ position: 'absolute', top: '3px', left: '.25rem' }} onClick={onCloseClick} /> }
                { project && <iframe ref={this.iframeRef} onLoad={() => { this.setState({ loaded: true }) }} style={{ width: 'inherit', height: 'inherit' }} src={`./projects/${project}/index.html`} frameBorder="0"></iframe> }
                { !loaded && <Loader cover={true} /> }
            </div>
        )
    }
}

ProjectIframe.propTypes = {
    closeButton: PropTypes.bool,
    onCloseClick: PropTypes.func,
    project: PropTypes.string,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
}