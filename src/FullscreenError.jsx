import React, { Component } from 'react'

export default class FullscreenError extends Component {
    // constructor(props) {
    //     super(props)
    //     this.state = {
    //         hasError: false
    //     }
    // }
    // componentDidCatch({ ...rest }, err) {
    //     console.log('sdqd', ...rest, err);
    // }
    render() {
        const { children, error } = this.props 
        return (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999 }}>
                { 
                    error 
                        ? <div style={{ background: 'rgba(18, 18, 18, 88)', height: '100%', width: '100%' }}>{ error }</div> 
                        : children 
                }
            </div>
        )
    }
}