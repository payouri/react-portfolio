import React, { lazy, memo, useEffect, useState } from 'react'
import { Switch, Route, useLocation, useRouteMatch, useHistory } from 'react-router'
import PropTypes from 'prop-types'

const ProjectsGrid = lazy(() => import('@cmp/ProjectsGrid/ProjectsGrid'))
const ProjectIframe = lazy(() => import('@cmp/ProjectIframe/ProjectIframe'))

const ProjectRoutes = ({ selectedProject }) => {
    const [location, setLocation] = useState(useLocation())
    const match = useRouteMatch()
    const loc = useLocation()
    useEffect(() => {
        if (loc.key !== location.key) {
            setLocation(loc)
        }
        return () => { }
    }, [selectedProject])
    return (
        <Switch location={location}>
            <Route exact path={`${match.path}/project/:id`} component={() => <ProjectIframe projectIndex={selectedProject} closeButton />}/>
            <Route path={`${match.path}`} component={ProjectsGrid} />
        </Switch>
    )
}

ProjectRoutes.propTypes = {
    projectIndex: PropTypes.number
}

export default memo(ProjectRoutes)
