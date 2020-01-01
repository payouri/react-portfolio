export default function(callback, delay) {

    let timer;
    let start, remaining = delay;


    const pause = function() {
        clearTimeout(timer);
        remaining = Date.now();
        remaining -= Date.now() - start;
    }

    const resume = function(newDelay) {

        clearTimeout(timer);
        start = Date.now();
        if(typeof newDelay == 'number') {
            remaining = newDelay;
        }
        timer = setTimeout(callback, remaining);

    }

    resume();

    return {
        resume,
        pause,
        start,
        delay: remaining
    }

}