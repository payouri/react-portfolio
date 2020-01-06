import React, { lazy, memo, useState, useEffect } from 'react'
import { Switch, Route, useLocation, Redirect } from 'react-router'

const HomePage = lazy(() => import('@pages/HomePage'))
const ProjectPage = lazy(() => import('@pages/Projects'))
const AboutMe = lazy(() => import('@pages/AboutMe'))
const Contact = lazy(() => import('@pages/Contact'))

const Routes = () => {
    const [location, setLocation] = useState(useLocation())
    const loc = useLocation()
    useEffect(() => {
        if (loc.key !== location.key) {
            setLocation(loc)
        }
        return () => { }
    }, [location])
    return (
        <Switch location={location}>
            <Route exact path='/projects' component={ProjectPage} />
            <Route exact path='/about' component={AboutMe} />
            <Route exact path='/media' component={Contact} />
            <Route path='/' component={HomePage} />
            {/* <Redirect from="/*" to={'/'} /> */}
        </Switch>
    )
}

export default memo(Routes)
