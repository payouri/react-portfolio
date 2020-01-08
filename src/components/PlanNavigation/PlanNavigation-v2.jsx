import React from 'react'
// import { Transition, TransitionGroup, CSSTransition } from 'react-transition-group'
import PropTypes from 'prop-types'
import { clamp } from '@youri-kane/js_utils/MathUtils'
import { throttle } from '@youri-kane/js_utils/EventUtils'
import css from './PlanNavigation.css'

const handleWheel = (mode, getNextPlan, globalDepth, setGlobalDepth, minDepth, maxDepth, e) => {
    e.persist()
    const { deltaY } = e
    if (mode == 'freeWheel') {
        const newDepth = clamp(globalDepth + deltaY, minDepth, maxDepth)
        setGlobalDepth(newDepth)
    } else {
        const plan = getNextPlan(-1 * deltaY)
        if (plan) {
            setGlobalDepth(plan.depth)
        }
    }
}
const jumpPlanTransitionDuration = 500;
const debouncedMouseWheel = throttle(handleWheel, 500)
const Plan = ({ depth = 1, children, style, classNames }) => {
    return (
        <div 
            className={classNames}
            style={{
                transition: `transform ${jumpPlanTransitionDuration - 1}ms`,
                top: 0, left: 0, right: 0, bottom: 0,
                ...style,
                position: 'absolute',
                transform: `translateZ(${depth}px)`,
                transformStyle: 'preserve-3d',
                // pointerEvents: 'none'
            }}
        >
            {children}
        </div>
    )
}

function PlanNavigation({ mode = 'freeWheel', perspective = innerWidth, initialDepth = 0, plans = [], maxDepth = 100, minDepth = -25, style, ...rest }) {
    const [globalDepth, setGlobalDepth] = React.useState(initialDepth)
    const [isTransit, setIsTransit] = React.useState(false)

    if (mode == 'planJump') {
        initialDepth = plans[0].depth
    }

    const getNextPlan = delta => {
        const otherPlans = plans.filter(p => delta < 0 ? p.depth > globalDepth : delta > 0 ? p.depth < globalDepth : false)
        const plan = otherPlans[0] ? delta < 0 ? otherPlans[0] : otherPlans[otherPlans.length - 1] : null
        return plan && plan.unReachable ? null : plan
    }
    return (
        <div
            {...rest}
            className={css['wrapper']}
            onWheel={e => { mode == 'jumpPlan' ? debouncedMouseWheel(mode, getNextPlan, globalDepth, setGlobalDepth, minDepth, maxDepth, e) 
                                                : handleWheel(mode, getNextPlan, globalDepth, setGlobalDepth, minDepth, maxDepth, e) }}
            style={{
                overflow: 'hidden',
                position: 'absolute',
                // height: '100vh',
                // width: '100vw',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                transformStyle: 'preserve-3d',
                perspective,
                ...style,
            }}
        >
            {plans.map(({ unReachable, children, ...p }, index) => (
                <Plan
                    key={index} {...p}
                    style={{ 
                        ...p.style, 
                        transition: mode == 'freeWheel' ? 'unset' : p.style && p.style.transition || `transform ${jumpPlanTransitionDuration - 1}ms` 
                    }}
                    depth={!isNaN(p.depth) ? p.depth - globalDepth : index * innerWidth - globalDepth} 
                >
                    {children}
                    </Plan>
            ))}
        </div>
    )
}

export default PlanNavigation
