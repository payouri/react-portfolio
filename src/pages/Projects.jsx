import React, { lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
const ProjectsGrid = lazy(() => import('../ProjectsGrid/ProjectsGrid'))
const Loader = lazy(() => import('../Loader/Loader'))

const Projects = () => {
    return(
        <Suspense fallback={<Loader cover={true}/>}>
            <ProjectsGrid />
        </Suspense>
    )
}

export default Projects