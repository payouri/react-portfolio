import React, { Component, Suspense, useState, createRef } from 'react'
import PropTypes from 'prop-types'
import { clamp } from '@youri-kane/js_utils/MathUtils'
import { capitalize } from '@youri-kane/js_utils/StringUtils'
import styles from './ProjectGrid.css'
import backgrounds from './CategoryBackground.css'
import projects from '../projects/build_index.json'
import Loader from '../Loader/Loader'
import AppContext from '../contexts/AppContext'

const Tooltip = React.lazy(() => import('../Tooltip/Tooltip'))
const ProjectIframe = React.lazy(() => import('../ProjectIframe/ProjectIframe'))
const Icon = React.lazy(() => import('../Icon/Icon'))
const Img = React.lazy(() => import('../Image/Image'))
const CloseButton = React.lazy(() => import('../Button/CloseButton'))
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

    const onMouse = function({ currentTarget, type }, label) {
        setToolTipLabel(type == 'mouseenter' ? label : '')
        setToolTipRef(type == 'mouseenter' ? currentTarget : null)
    }

    return (
        <div className={styles['project-social']}>
            { github && <a target="_blank" rel="noopener noreferrer" onMouseEnter={e => { onMouse(e, 'github') }} onMouseLeave={onMouse} href={github}><Icon prefix="fab" icon={'github-alt'} /></a> }
            { codepen && <a target="_blank" rel="noopener noreferrer" onMouseEnter={e => { onMouse(e, 'codepen') }} onMouseLeave={onMouse} href={codepen}><Icon prefix="fab" icon={'codepen'} /></a> }
            { npmjs && <a target="_blank" rel="noopener noreferrer" onMouseEnter={e => { onMouse(e, 'npmjs') }} onMouseLeave={onMouse} href={npmjs}><Icon prefix="fab" icon={'npm'} /></a> }
            { medium && <a target="_blank" rel="noopener noreferrer" onMouseEnter={e => { onMouse(e, 'medium') }} onMouseLeave={onMouse} href={medium}><Icon prefix="fab" icon={'medium-m'} /></a> }
            { (github || codepen || npmjs || medium) && <Tooltip label={labels[tooltipLabel]} position={'bottom'} rootElem={toolTipRef} show={!!toolTipRef}/> }
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

    return (
        <div className={styles['preview-wrapper']}>
            <div className={styles['project-jumbo']}>
                { cover && (jumboType == 'cover' || !jumboType)
                    ? <Img {...cover}/> 
                    : directory && (jumboType == 'iframe' || !jumboType)
                        ? <CategoryBackground category={category}><Suspense fallback={<Loader cover={true}/>}>{!hold && <ProjectIframe project={directory}/>}</Suspense></CategoryBackground>
                        : <CategoryBackground category={category} />
                }
            </div>
            <CloseButton style={{ position: 'absolute', top: '3px', left: '.25rem' }} onClick={onCloseClick} />
            <div className={styles['preview-body']}>
                <h2>{ name }</h2>
                { tagline && <p>{ tagline }</p> }
                <div style={{display: 'flex', flexFlow: 'row wrap', alignItems: 'center'}}>{ category && <div className={styles['preview-category']}><CategoryBackground category={category}>{capitalize(category.toLowerCase())}</CategoryBackground></div> }<SocialBar {...rest}/></div>
                { description && <p>{ description }</p> }
                { htmlBody && (
                    <div dangerouslySetInnerHTML={{ __html: htmlBody }}>
                    </div>
                )}
                { directory && !link &&
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
    jumboType: PropTypes.string
}

export default class ProjectsGrid extends Component {

    componentDidMount() {
        
        this.previewWrapperRef.current.addEventListener('transitionstart', this.handlePreviewTransition)
        this.previewWrapperRef.current.addEventListener('transitionend', this.handlePreviewTransition)

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

    }
    
    handlePreviewTransition({ type, target }) {

        if(target === this.previewWrapperRef.current)
            this.setState({
                inTransit: type == 'transitionstart'
            })

    }

    handleProjectClick(projectIndex) {
        this.setState({
            selected: projects[projectIndex],
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
        
        const { grid, selected, showcase, inTransit } = this.state;

        if(showcase)
            return <ProjectIframe project={selected.directory} closeButton={true} onCloseClick={() => this.setState({ showcase: false })}/>
        else
            return (
                <AppContext.Consumer>
                    {({ navbarOpen, navbarHeight, ...rest }) => (
                        <div className={styles['projects-grid-wrapper']}
                            style={{
                                transform: navbarOpen ? `translateY(${navbarHeight}px)` : 'translate(0)',
                                transition: navbarOpen ? 'transform 225ms' : 'transform 225ms 175ms',
                                position: 'relative', overflow: 'hidden',
                                maxHeight: '100%', height: '100%', width: '100%', 
                            }}>
                            <div
                                className={`${styles['projects-grid']} ${styles['grid-'+grid]}`}
                                style={{transition: `width ${clamp(projects.length * 10 + 100, 200, 425)}ms ease-out`}}
                            >
                                { projects.map((project, i, arr) => (
                                    <div onClick={() => { this.handleProjectClick(i) }} key={i} className={styles['project-wrapper']} style={{
                                        height: boxHeight + boxUnit,
                                        width: (grid == 'expanded' ? boxWidth : 100) + '%',
                                        maxWidth: grid == 'expanded' ? boxWidth + 'vw' : 'unset',
                                        top: `${(Math.floor(i/4) * boxHeight)}${boxUnit}`,
                                        left: `${i%4 * boxHeight}%`,
                                        transitionDuration: i * 25 + 200 + 'ms',
                                        transitionDelay: (arr.length - i) * 25 + 'ms',
                                        ...grid == 'expanded' ? {
                                        } : {
                                            transform: `translate(-${i%4 * 25}%, ${((i - Math.floor(i/4)) * boxHeight)}${boxUnit})`,
                                        }
                                    }}>
                                        <CategoryBackground
                                            category={project.category}
                                            className={`${styles['project-box']} ${project === selected && grid !== 'expanded' ? styles['active'] : ''}`}
                                        >
                                            <h2
                                                className={styles['project-box-title']}
                                                style={{}}>{project.name}</h2>
                                            <div
                                                className={styles['project-box-category']}
                                                style={{}}>{capitalize(project.category.toLowerCase())}</div>
                                        </CategoryBackground>
                                    </div>
                                ))}
                            </div>
                            <div 
                                ref={this.previewWrapperRef}
                                className={`${styles['project-preview']} ${styles['project-preview-'+grid]}`}
                                style={{ 
                                    left: boxWidth + '%',
                                    width: `${100 - boxWidth}%`,
                                    transitionDuration: projects.length * 10 + 200 + 'ms',
                                }}
                            >
                                { typeof selected != 'undefined' && 
                                    <Suspense fallback={<Loader cover={true}/>}>
                                        {
                                            <ProjectPreview
                                                { ...selected } 
                                                hold={inTransit}
                                                onSeeProjectClick={() => { 
                                                    if(selected.link)
                                                        window.open(selected[selected.link] ? selected[selected.link] : selected.link, '_blank')
                                                    else if(selected.directory)
                                                        this.setState({ showcase: true })
                                                }} 
                                                onCloseClick={() => this.setState({ grid: 'expanded'}) }
                                            />
                                        }
                                    </Suspense>
                                }
                            </div>
                        </div>
                    )}
                </AppContext.Consumer>
            );
    }
}
