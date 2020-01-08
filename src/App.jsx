import Loader from '@cmp/Loader/Loader';
import AppContext from '@contexts/AppContext';
import { debounce } from '@youri-kane/js_utils/EventUtils';
import React, { Component, lazy, Suspense } from 'react';
// import PropTypes from 'prop-types';
import { BrowserRouter as Router } from 'react-router-dom';
import { basename } from '../constants.js';
import Container from './components/Container.jsx';
import Routes from './Routes';
import styles from './styles.css';
// import FullscreenError from './FullscreenError.jsx';
import GridUI from '@utils/GridUI'
// const Container = lazy(() => import('./components/Container.jsx'))
// const Routes = lazy(() => import('./Routes.jsx'))
const Navigation = lazy(() => import('@cmp/Navigation/Navigation'))
class App extends Component {

    componentDidMount() {

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

    componentDidCatch(error, trace) {
        // console.log(param);
        const errorDisplay = document.querySelector('#error-display')
        errorDisplay.innerText = error + trace.componentStack
        errorDisplay.style.display = 'block'
        // document.write('error')
    }

    // handleRouteChange(e) {
    //     console.log('dqse',e);
    // }

    constructor(props) {
        super(props);

        this.state = {
            windowWidth: undefined,
            navbarOpen: false,
            navbarHeight: undefined,
            hasError: false,
        }
        // this.handleRouteChange = debounce(this.handleRouteChange.bind(this), 75)
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
                        <Suspense fallback={<Loader cover={true} />}>
                            <Navigation open={this.state.navbarOpen} onOpenStateChange={state => { this.setState({ navbarOpen: state }) }} />
                        </Suspense>
                        <Container>
                            <Routes />
                        </Container>
                        {/* <GridUI /> */}
                    </div>
                </Router>
            </AppContext.Provider>
        )
    }
}

export default App