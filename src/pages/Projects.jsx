import React, { lazy, Suspense } from 'react'
// import PropTypes from 'prop-types'
const ProjectsGrid = lazy(() => import('@cmp/ProjectsGrid/ProjectsGrid'))
const Loader = lazy(() => import('@cmp/Loader/Loader'))

const Projects = () => {
    return(
        <Suspense fallback={<Loader cover={true}/>}>
            <ProjectsGrid />
        </Suspense>
    )
}

export default Projects