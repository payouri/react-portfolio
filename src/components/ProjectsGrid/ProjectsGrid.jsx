import React, { Component, Suspense, useState, createRef } from 'react'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import { clamp } from '@youri-kane/js_utils/MathUtils'
import { capitalize } from '@youri-kane/js_utils/StringUtils'
import { mobileSize } from '@constants'
import AppContext from '@contexts/AppContext'
import ProjectsContext from '@contexts/ProjectsContext'
import styles from './ProjectGrid.css'
import backgrounds from './CategoryBackground.css'
import Loader from '@cmp/Loader/Loader'
import Screen from '@cmp/Screen/Screen'
const Tooltip = React.lazy(() => import('@cmp/Tooltip/Tooltip'))
const ProjectIframe = React.lazy(() => import('@cmp/ProjectIframe/ProjectIframe'))
const Icon = React.lazy(() => import('@cmp/Icon/Icon'))
const Img = React.lazy(() => import('@cmp/Image/Image'))
const CloseButton = React.lazy(() => import('@cmp/Button/CloseButton'))
// const SearchInput = React.lazy(() => import('../SearchInput/SearchInput'))

const gridStates = {
    expanded: 'decked',
    decked: 'expanded'
}

const boxHeight = 25 //in vh unit
const boxUnit = 'vh'
const boxWidth = 25 //in % unit
const mobileBoxWidth = 100

const CategoryBackground = ({ category, style, className, ...rest }) => {
    const colors = backgrounds;
    return <div style={{ height: '100%', width: '100%', ...style }} {...rest} className={`${colors[category] ? colors[category] : colors['default']} ${className}`}></div>
}

CategoryBackground.propTypes = {
    category: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string
}

CategoryBackground.defaultProps = {
    className: '',
}

const SocialBar = ({ github, codepen, npmjs, medium }) => {

    const [tooltipLabel, setToolTipLabel] = useState('')
    const [toolTipRef, setToolTipRef] = useState(null)

    const labels = {
        github: 'Github Repository',
        codepen: 'CodePen',
        npmjs: 'npm Package',
        medium: 'Medium article',
    }

    const onMouse = function ({ currentTarget, type }, label) {
        setToolTipLabel(type == 'mouseenter' ? label : '')
        setToolTipRef(type == 'mouseenter' ? currentTarget : null)
    }

    return (
        <div className={styles['project-social']}>
            {github && <a target="_blank" rel="noopener noreferrer" onMouseEnter={e => { onMouse(e, 'github') }} onMouseLeave={onMouse} href={github}><Icon prefix="fab" icon={'github-alt'} /></a>}
            {codepen && <a target="_blank" rel="noopener noreferrer" onMouseEnter={e => { onMouse(e, 'codepen') }} onMouseLeave={onMouse} href={codepen}><Icon prefix="fab" icon={'codepen'} /></a>}
            {npmjs && <a target="_blank" rel="noopener noreferrer" onMouseEnter={e => { onMouse(e, 'npmjs') }} onMouseLeave={onMouse} href={npmjs}><Icon prefix="fab" icon={'npm'} /></a>}
            {medium && <a target="_blank" rel="noopener noreferrer" onMouseEnter={e => { onMouse(e, 'medium') }} onMouseLeave={onMouse} href={medium}><Icon prefix="fab" icon={'medium-m'} /></a>}
            {(github || codepen || npmjs || medium) && <Tooltip label={labels[tooltipLabel]} position={'bottom'} rootElem={toolTipRef} show={!!toolTipRef} />}
        </div>
    )
}

SocialBar.propTypes = {
    github: PropTypes.string,
    codepen: PropTypes.string,
    npmjs: PropTypes.string,
    medium: PropTypes.string,
}

const ProjectPreview = ({ name, cover, directory, htmlBody, description, tagline, category, onCloseClick, link, onSeeProjectClick, jumboType, hold, ...rest }) => {
    const project = {
        name, cover, directory, htmlBody, description, tagline, category, link
    }
    return (
        <div className={styles['preview-wrapper']}>
            <div className={styles['project-jumbo']}>
                {cover && (jumboType == 'cover' || !jumboType)
                    ? <Img {...cover} />
                    : directory && (jumboType == 'iframe' || !jumboType)
                        ? <CategoryBackground category={category}><Suspense fallback={<Loader cover={true} />}>{hold ? <Loader cover={true} /> : <ProjectIframe project={project} />}</Suspense></CategoryBackground>
                        : <CategoryBackground category={category} />
                }
            </div>
            <CloseButton style={{ position: 'absolute', top: '3px', left: '.25rem' }} onClick={onCloseClick} />
            <div className={styles['preview-body']}>
                <h2>{name}</h2>
                {tagline && <p>{tagline}</p>}
                <div style={{ display: 'flex', flexFlow: 'row wrap', alignItems: 'center' }}>{category && <div className={styles['preview-category']}><CategoryBackground category={category}>{capitalize(category.toLowerCase())}</CategoryBackground></div>}<SocialBar {...rest} /></div>
                {description && <p>{description}</p>}
                {htmlBody && (
                    <div dangerouslySetInnerHTML={{ __html: htmlBody }}>
                    </div>
                )}
                {directory && !link &&
                    <button onClick={() => { onSeeProjectClick() }}>
                        See
                    </button>
                }
            </div>
        </div>
    )

}

ProjectPreview.propTypes = {
    name: PropTypes.string,
    cover: PropTypes.string,
    path: PropTypes.string,
    directory: PropTypes.string,
    htmlBody: PropTypes.string,
    description: PropTypes.string,
    tagline: PropTypes.string,
    category: PropTypes.string,
    link: PropTypes.string,
    onCloseClick: PropTypes.func,
    onSeeProjectClick: PropTypes.func,
    jumboType: PropTypes.string,
    hold: PropTypes.bool
}

class ProjectsGrid extends Component {

    componentDidUpdate() {

        const { selectedRef: { current } } = this
        const active = current.querySelector('[class*="active"]')
        if (active) {
            active.parentNode.scrollIntoView({ behavior: 'smooth' })
        }

    }

    componentDidMount() {
        this.previewWrapperRef.current.addEventListener('transitionstart', this.handlePreviewTransition)
        this.previewWrapperRef.current.addEventListener('transitionend', this.handlePreviewTransition)
        const { selectedProject } = this.context
        if(selectedProject > -1) {
            this.setState({ grid: 'decked' })
        }
    }
    componentWillUnmount() {
        this.previewWrapperRef.current.removeEventListener('transitionstart', this.handlePreviewTransition)
        this.previewWrapperRef.current.removeEventListener('transitionend', this.handlePreviewTransition)
    }

    constructor(props) {

        super(props)

        this.state = {
            grid: 'expanded',
            selected: null,
            showcase: false,
            inTransit: false,
        }

        this.previewWrapperRef = createRef()
        this.handleProjectClick = this.handleProjectClick.bind(this)
        this.handlePreviewTransition = this.handlePreviewTransition.bind(this)
        this.selectedRef = createRef()
    }

    handlePreviewTransition({ type, target }) {

        if (target === this.previewWrapperRef.current)
            this.setState({
                inTransit: type == 'transitionstart'
            })

    }

    handleProjectClick() {
        this.setState({
            grid: 'decked',
        })
    }

    _toggleGrid() {

        const { grid } = this.state;

        this.setState({
            grid: gridStates[grid],
        })

    }

    render() {

        const { selectedRef } = this
        const { grid, inTransit } = this.state
        const { projects, selectedProject, setSelectedProject, selectedProjectData, openProjectIframe } = this.context

        return (
            <Screen avoidNav className={styles['projects-grid-wrapper']}>
                <AppContext.Consumer>
                    {({ windowWidth }) => {
                        const isMobile = windowWidth <= mobileSize
                        return (
                            <>
                                <div
                                    className={`${styles['projects-grid']} ${styles[isMobile ? 'grid-expanded' : 'grid-' + grid]}`}
                                    style={{ transition: `width ${clamp(projects.length * 10 + 100, 200, 425)}ms ease-out` }}
                                    ref={selectedRef}

                                >
                                    {projects.map((project, i, arr) => (
                                        <button
                                            onClick={() => { setSelectedProject(i); this.setState({ grid: 'decked' }) }}
                                            key={i}
                                            className={styles['project-wrapper']}
                                            data-active={i === selectedProject}
                                            style={{
                                                height: boxHeight + boxUnit,
                                                width: isMobile ? '100%' : (selectedProject === -1 ? boxWidth : 100) + '%',
                                                maxWidth: isMobile ? '100%' : selectedProject === -1 ? boxWidth + 'vw' : 'unset',
                                                top: isMobile ? `${i * boxHeight}${boxUnit}` : `${(Math.floor(i / 4) * boxHeight)}${boxUnit}`,
                                                left: isMobile ? 0 : `${i % 4 * boxHeight}%`,
                                                transitionDuration: i * 25 + 200 + 'ms',
                                                transitionDelay: (arr.length - i) * 25 + 'ms',
                                                ...selectedProject === -1 ? {
                                                } : {
                                                        transform: isMobile ? 'unset' : `translate(-${i % 4 * 25}%, ${((i - Math.floor(i / 4)) * boxHeight)}${boxUnit})`,
                                                    }
                                            }}
                                        >
                                            <CategoryBackground
                                                category={project.category}
                                                className={`${styles['project-box']} ${i === selectedProject ? styles['active'] : ''}`}
                                            >
                                                <h2
                                                    className={styles['project-box-title']}
                                                    style={{}}>{project.name}</h2>
                                                <div
                                                    className={styles['project-box-category']}
                                                    style={{}}>{capitalize(project.category.toLowerCase())}</div>
                                            </CategoryBackground>
                                        </button>
                                    ))}
                                </div>
                                <div
                                    ref={this.previewWrapperRef}
                                    className={`${styles['project-preview']} ${styles['project-preview-' + grid]} ${isMobile && styles['project-preview-mobile'] || ''}`}
                                    style={{
                                        left: isMobile ? 0 : boxWidth + '%',
                                        width: isMobile ? '100%' : `${100 - boxWidth}%`,
                                        transitionDuration: isMobile ? undefined : projects.length * 10 + 200 + 'ms',
                                    }}
                                >
                                    {
                                        selectedProject > -1 &&
                                        <Suspense fallback={<Loader cover={true} />}>
                                            <ProjectPreview
                                                {...selectedProjectData}
                                                hold={inTransit}
                                                onSeeProjectClick={() => {
                                                    if (selectedProjectData.directory)
                                                        openProjectIframe(selectedProject)
                                                    else if (selectedProjectData.link)
                                                        window.open(selectedProjectData[selectedProjectData.link] ? selectedProjectData[selectedProjectData.link] : selectedProjectData.link, '_blank')
                                                }}
                                                onCloseClick={() => { setSelectedProject(-1); this.setState({ grid: 'expanded' }) }}
                                            />
                                        </Suspense>
                                    }
                                </div>

                            </>
                        )
                    }}
                </AppContext.Consumer>
            </Screen>

        );
    }
}
ProjectsGrid.contextType = ProjectsContext
export default withRouter(ProjectsGrid)