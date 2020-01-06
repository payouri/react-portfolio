import Loader from '@cmp/Loader/Loader';
import AppContext from '@contexts/AppContext';
import { debounce } from '@youri-kane/js_utils/EventUtils';
import React, { Component, lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
// import PropTypes from 'prop-types';
import { BrowserRouter as Router } from 'react-router-dom';
import { basename } from '../constants.js';
import Container from './components/Container.jsx';
import Routes from './Routes';
import styles from './styles.css';
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

    componentDidCatch() {

        document.write('error')

    }

    handleRouteChange(e) {
        console.log('dqse',e);
    }

    constructor(props) {
        super(props);

        this.state = {
            windowWidth: undefined,
            navbarOpen: false,
            navbarHeight: undefined,
        }
        this.handleRouteChange = debounce(this.handleRouteChange.bind(this), 75)
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
                    </div>
                </Router>
            </AppContext.Provider>
        )
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const AppRoot = document.getElementById('app')
    // window.addEventListener('focus', () => {
    //     toggleFullscreen(AppRoot, (v) => { console.log(v); })
    // })
    // window.addEventListener('blur', () => {
    //     toggleFullscreen(AppRoot, (v) => { console.log(v); })
    // })
    ReactDOM.render(<App />, AppRoot);
})