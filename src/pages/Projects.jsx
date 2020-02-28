import React, { lazy, Suspense, memo, useEffect, useState, useRef } from 'react'
import projects from '../projects/build_index.json'
import { Switch, Route, useLocation, useHistory, useRouteMatch } from 'react-router'
import ProjectsContext from '@contexts/ProjectsContext'
import ProjectRoutes from '../ProjectRoutes.jsx'

const Loader = lazy(() => import('@cmp/Loader/Loader'))

let ref = -1
const Projects = () => {
    const match = useRouteMatch()
    const history = useHistory()
    const openProjectIframe = id => {
        history.push(`${match.path}/project/${id}`)
    }
    const closeProjectIframe = _ => {
        history.goBack()
    }
    return (
        <ProjectsContext.Provider value={{
            projects,
            get selectedProject() {
                return ref
            },
            setSelectedProject: i => {
                ref = i
            },
            get selectedProjectData() {
                return this.selectedProject > -1 ? projects[this.selectedProject] : null
            },
            openProjectIframe,
            closeProjectIframe
        }}>
            <ProjectRoutes />
        </ProjectsContext.Provider>
    )
}

export default memo(Projects)