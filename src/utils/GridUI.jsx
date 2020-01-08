import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Input from '@cmp/Inputs/Input'

//todo make controls reducable and draggable
function ControlPanel({ onControl, gapX, gapY, opacity }) {
    return (
        <div
            // onMouseDown
            // onMouseUp
            // onMouseMouseMove
            style={{
                width: '22rem',
                maxWidth: '100%',
                position: 'fixed',
                top: '1.25rem',
                left: '1.5rem',
                backgroundColor: 'white',
                boxShadow: '1px 2px 1px 0 rgba(18, 18, 18, .22)',
                padding: '.5rem 1rem 0',
                borderRadius: '.25rem',
                zIndex: 10000,
            }}
        >
            <div
                style={{ paddingBottom: '.75rem' }}
            >
                GridUI Controls
            </div>
            <div style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center' }}>
                <Input type="range" value={opacity} label="opacity" step='0.01' min="0" max="1" onInput={({ target }) => { onControl('opacity', target.value) }} />
                <span style={{ flex: '0 0 2.5rem', padding: '0 .25rem', textAlign: 'right' }}>{opacity}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center' }}>
                <Input type="range" value={gapX} label="gapX" step='1' min="1" onInput={({ target }) => { onControl('gapX', target.value) }} />
                <span style={{ flex: '0 0 2.5rem', padding: '0 .25rem', textAlign: 'right' }}>{gapX}px</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center' }}>
                <Input type="range" value={gapY} label="gapY" step='1' min="1" onInput={({ target }) => { onControl('gapY', target.value) }} />
                <span style={{ flex: '0 0 2.5rem', padding: '0 .25rem', textAlign: 'right' }}>{gapY}px</span>
            </div>
            {/* <Input type="range" label="opacity" onInput={handleInput} /> */}
        </div>
    )
}
//todo find the right linear gradients 
function GridUI({ spacingY, spacingX }) {
    const [gapX, setGapX] = useState(spacingX)
    const [gapY, setGapY] = useState(spacingY)
    const [opacity, setOpacity] = useState(.25)
    const _background = () => {
        const gridX = typeof gapX === 'number' && `repeating-linear-gradient(to right, transparent, transparent ${gapX - .3}px, red ${gapX - .3}px, red ${gapX + .3}px, transparent ${spacingX + .5}px)` || ''
        const gridY = typeof gapY === 'number' && `repeating-linear-gradient(to bottom, transparent, transparent ${gapY - .3}px, red ${gapY - .3}px, red ${gapY + .3}px, transparent ${gapY + .5}px)` || ''
        return {
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundImage: `${gridX} ${gridX && gridY && ',' || ''} ${gridY}`,
        }
    }
    const handleControl = (prop, value) => {
        console.log(prop);
        switch (prop) {
            case 'opacity':
                setOpacity(Number(value))
                break
            case 'gapX':
                setGapX(Number(value))
                break
            case 'gapY':
                setGapY(Number(value))
                break
        }
    }
    return (
        <>
            <ControlPanel gapX={gapX} gapY={gapY} opacity={opacity} onControl={handleControl} />
            <div style={{ opacity: opacity, pointerEvents: 'none', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, ..._background() }} />
        </>
    )
}

GridUI.propTypes = {
    spacingX: PropTypes.number,
    spacingY: PropTypes.number,
}

GridUI.defaultProps = {
    spacingX: 8,
    spacingY: 8
}

export default GridUI
