import React, { lazy } from 'react'
import { Switch, Route, useLocation } from 'react-router'

const HomePage = lazy(() => import('@pages/HomePage'))
const ProjectPage = lazy(() => import('@pages/Projects'))
const AboutMe = lazy(() => import('@pages/AboutMe'))
const Contact = lazy(() => import('@pages/Contact'))

function Routes() {
    const location = useLocation()
    return (
        <Switch location={location}>
            <Route exact path="/projects" component={ProjectPage} />
            <Route exact path="/about" component={AboutMe} />
            <Route exact path="/media" component={Contact} />
            <Route path="/" component={HomePage} />
        </Switch>
    )
}

export default Routes
