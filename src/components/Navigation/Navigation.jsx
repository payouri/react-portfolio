import React, { Component, memo } from 'react';
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import styles from './Navigation.css'
import AppContext from '@contexts/AppContext';
import { debounce } from '@youri-kane/js_utils/EventUtils';
import MenuButton from '@cmp/Button/MenuButton'
import { withRouter } from 'react-router-dom'
class Navigation extends Component {

    componentDidMount() {
     
        this.context.setNavbarHeight(this.navbarRef.current.getBoundingClientRect()['height'])
        window.addEventListener('resize', this.handleWindowResize)
        window.addEventListener('click', this.handleOutSideClick)

    }
    componentWillUnmount() {

        window.removeEventListener('resize', this.handleWindowResize)
        window.addEventListener('click', this.handleOutSideClick)

    }
    
    
    constructor(props) {

        super(props)

        this.menuButtonRef = React.createRef();
        this.navbarRef = React.createRef();

        this.navbarImgURI = '';
        this.ctx = null;
        this.update;

        this.state = {
            open: this.props.open,
            locked: false,
        }

        this.handleMouse = this.handleMouse.bind(this);
        this.handleWindowResize = debounce(this.handleWindowResize.bind(this), 75, false);
        this.handleOutSideClick = this.handleOutSideClick.bind(this);
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.handleLinkClick = this.handleLinkClick.bind(this);

    }
    handleMenuClick() {
        const { onOpenStateChange } = this.props;
        this.setState({ locked: !this.state.locked, open: !this.state.locked },
            () => { typeof onOpenStateChange == 'function' && onOpenStateChange(this.state.open) })
    }
    handleOutSideClick({ target }) {
        
        const { locked, } = this.state
        const { onOpenStateChange } = this.props;

        if(this.navbarRef.current.contains(target))
            return;

        if(locked)
            this.setState({ locked: false, open: false },
                () => { typeof onOpenStateChange == 'function' && onOpenStateChange(this.state.open) })
    }
    handleWindowResize() {

        this.context.setNavbarHeight(this.navbarRef.current.getBoundingClientRect()['height'])

    }
    handleLinkClick(e) {
        
        const { onOpenStateChange, /* location */ } = this.props
        const { target } = e
        // if(target.href === location.pathname) {
        //     e.preventDefault()
        //     e.stopPropagation()
        //     e.stopImmediatePropagation()
        // }
        if(target.href) {
            this.setState({
                open: false,
                locked: false,
            }, () => { typeof onOpenStateChange == 'function' && onOpenStateChange(this.state.open) })
        }
    }
    handleMouse({ type, target }) {

        const { locked, open } = this.state;
        const { onOpenStateChange } = this.props;
        
        if(target == this.menuButtonRef.current && !open)
            return

        this.setState({
            open: locked || type == 'mouseenter'
        }, () => { typeof onOpenStateChange == 'function' && onOpenStateChange(this.state.open) })

    }

    render() {

        const { open } = this.state
        const { location } = this.props

        return (
            <div
                ref={this.navbarRef}
                className={`${styles['navbar']} ${open && styles['active']} ${location.pathname !== '/' && styles['flat-background']}`}
                onMouseEnter={this.handleMouse}
                onMouseLeave={this.handleMouse}
            >
                <nav style={{ position: 'relative', }} onClick={this.handleLinkClick}>
                    <NavLink exact to={'/'} activeClassName={styles['active']}>Home</NavLink>
                    <NavLink exact to={'/projects'} activeClassName={styles['active']}>Project</NavLink>
                    <NavLink exact to={'/about'} activeClassName={styles['active']}>Myself</NavLink>
                    <NavLink exact to={'/media'} activeClassName={styles['active']}>Contact</NavLink>
                </nav>
                <MenuButton
                    open={open}
                    buttonRef={this.menuButtonRef}
                    className={styles['menu-btn']}
                    style={{
                        color: location.pathname === '/' ? 'white' : 'black',
                    }}
                    onClick={this.handleMenuClick}
                />
            </div>
        )
    }
}

Navigation.contextType = AppContext

Navigation.propTypes = {
    open: PropTypes.bool,
    onOpenStateChange: PropTypes.func,
    ...withRouter.propTypes
}

export default withRouter(memo(Navigation))