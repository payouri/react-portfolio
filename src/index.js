import React from 'react'
import ReactDOM from 'react-dom';
import App from './App';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('SW registered: ', registration);
        }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
    });
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