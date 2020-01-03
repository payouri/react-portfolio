import { basename } from '../constants.js'
import React, { Suspense, lazy, Component } from 'react';
import ReactDOM from 'react-dom';
// import PropTypes from 'prop-types';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from 'react-router-dom';
import styles from './styles.css';
import { debounce } from '@youri-kane/js_utils/EventUtils'
import AppContext from '@contexts/AppContext'
import Loader from '@cmp/Loader/Loader'
const Navigation = lazy(() => import('@cmp/Navigation/Navigation'))
const HomePage = lazy(() => import('@pages/HomePage'))
const ProjectPage = lazy(() => import('@pages/Projects'))
const AboutMe = lazy(() => import('@pages/AboutMe'))
const Contact = lazy(() => import('@pages/Contact'))
class App extends Component {

    componentDidMount(){
    
        this.setState({
            windowWidth: innerWidth,
        })

        window.addEventListener('resize', this.onWindowResize)

    }
    componentWillUnmount() {
      
        window.removeEventListener('resize', this.onWindowResize)

    }
    
    onWindowResize() {

        this.setState({
            windowWidth: innerWidth,
        })

    }

    componentDidCatch() {

        document.write('error')

    }
    
    constructor(props) {
        super(props);
        
        this.state = {
            windowWidth: undefined,
            navbarOpen: false,
            navbarHeight: undefined,
        }
        this.onWindowResize = debounce(this.onWindowResize.bind(this), 75)
        this.setNavbarHeight = n => {
            this.setState({
                navbarHeight: n,
            })
        }
        this.setAppState = ({ prop, value }) => {
            this.setState({
                [prop]: value,
            })
        }
    }
    render() {
        return (
            <AppContext.Provider value={{
                ...this.state,
                setNavbarHeight: this.setNavbarHeight,
                setAppState: this.setAppState
            }}>
                <Router basename={basename}>
                    <div className={styles["wrap"]}>
                        <Suspense fallback={<Loader cover={true}/>}>
                            <Navigation open={this.state.navbarOpen} onOpenStateChange={state => { this.setState({ navbarOpen: state }) }}/>
                        </Suspense>
                        <div style={{ flex: '0 0 100%', position: 'relative', overflow: 'hidden' }}>
                            <Suspense fallback={<Loader cover={true}/>}>
                                <Switch>
                                    <Route exact path="/projects" component={ProjectPage} />
                                    <Route exact path="/about" component={AboutMe} />
                                    <Route exact path="/media" component={Contact} />
                                    <Route path="/" component={HomePage} />
                                </Switch>
                            </Suspense>
                        </div>
                    </div>
                </Router>
            </AppContext.Provider>
        )
    }
}

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<App />, document.getElementById('app'));
})