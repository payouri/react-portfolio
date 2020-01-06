const toggleFullScreen = (elem, callback) => {
    if(!(elem instanceof HTMLElement))
        elem = document.documentElement
    if (!document.fullscreenElement &&   // alternative standard method
        !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }
    typeof callback == 'function' && callback(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement)
}
export default toggleFullScreen