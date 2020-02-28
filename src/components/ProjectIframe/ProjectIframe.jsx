import React, { Component, /* Suspense, */ lazy, memo } from 'react'
import PropTypes from 'prop-types'
import ProjectsContext from '@contexts/ProjectsContext'
import styles from './ProjectIframe.css'
const Loader = lazy(() => import('@cmp/Loader/Loader'))
const CloseButton = lazy(() => import('@cmp/Button/CloseButton'))
class ProjectIframe extends Component {
    componentDidMount() {
        // if(this.iframeRef.current) {
        //     console.log(this.iframeRef.current)
        // }
    }

    shouldComponentUpdate() {
        return (this.context.selectedProject !== this.props.projectIndex) && this.context.selectedProject > -1
    }

    componentDidUpdate(prevProps) {
        console.log(prevProps.projectIndex != this.props.projectIndex && this.props.projectIndex > -1);
        if (prevProps.projectIndex != this.props.projectIndex && this.props.projectIndex > -1) {
            this.setState({ loading: false })
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

        const { closeProjectIframe, selectedProject, selectedProjectData } = this.context
        const { showHeader, width, height, closeButton, onCloseClick } = this.props;
        const { loaded } = this.state;

        return (
            <div ref={this.wrapperRef} className={styles['project-wrapper']} style={{ height, width }}>
                {closeButton && <CloseButton style={{ position: 'absolute', top: '3px', left: '.25rem' }} onClick={onCloseClick || closeProjectIframe} />}
                {showHeader && <div>{selectedProjectData?.name}</div>}
                {selectedProjectData && <iframe ref={this.iframeRef} onLoad={() => { this.setState({ loaded: true }) }} style={{ width: 'inherit', height: 'inherit' }} src={`/my_projects/${selectedProjectData.directory}/index.html`} frameBorder="0"></iframe>}
                {!loaded && <Loader cover={true} />}
            </div>

        )
    }
}

ProjectIframe.contextType = ProjectsContext

ProjectIframe.propTypes = {
    closeButton: PropTypes.bool,
    onCloseClick: PropTypes.func,
    showHeader: PropTypes.bool,
    // project: PropTypes.object.isRequired,
    projectIndex: PropTypes.number,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
}

export default memo(ProjectIframe)