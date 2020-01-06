import React, { lazy, Suspense, memo, useContext, useEffect, useState } from 'react'
import { mobileSize } from '@constants'
// import PropTypes from 'prop-types'
import AppContext from '@contexts/AppContext';
const Loader = lazy(() => import('@cmp/Loader/Loader'))
const FlippingText = lazy(() => import('@cmp/FlippingText/FlippingText'))
const FieldOfView = lazy(() => import('@cmp/PlanNavigation/PlanNavigation'))
const ShapeBackground = lazy(() => import('@cmp/ShapeBackground/ShapeBackground'))
const initialDepth = innerWidth * .65
const firstPlanShapes = [
    { color: 'orange', top: '50%', left: '9rem', size: '9rem', icon: 'octagone' },
    { color: 'green', top: '70%', left: '92%', size: '2.5rem', icon: 'triangle' },
    { color: 'white', top: '20%', left: '66%', size: '3rem', icon: 'square' },
    { color: 'yellow', top: '23%', left: '41%', size: '3rem', icon: 'star' },
    { color: 'blue', top: '84%', left: '50%', size: '1.5rem', icon: 'arrows-down' },
    { color: 'orange', top: '80%', left: '50%', size: '1.75rem', icon: 'arrows-up' },
    { color: 'red', top: '12%', left: '81%', icon: 'circle' },
    { color: 'red', top: '82%', left: '20%', icon: 'circle' },
    { color: 'red', top: '33%', left: '30%', icon: 'circle' },
    { color: 'red', top: '85%', left: '75%', icon: 'circle' },
]
const plans = [
    { style: { /* top: '1rem', bottom: '1rem', left: '1rem', right: '1rem', borderRadius: '.5rem', */ }, animation:false,  unReachable: true },
    { style: { /* top: '1rem', bottom: '1rem', left: '1rem', right: '1rem', borderRadius: '.5rem', */ }, animation:true, unReachable: true },
    { style: { /* top: '1rem', bottom: '1rem', left: '1rem', right: '1rem', borderRadius: '.5rem', */ }, animation:true },
    { style: { /* top: '1rem', bottom: '1rem', left: '1rem', right: '1rem', borderRadius: '.5rem', */ }, animation:true },
    { style: { /* top: '1rem', bottom: '1rem', left: '1rem', right: '1rem', borderRadius: '.5rem', */ }, animation: false, shapes: firstPlanShapes }
]

const HomePage = () => {
    const { windowWidth } = useContext(AppContext)
    const [isMobile, setIsMobile] = useState(windowWidth <= mobileSize)
    useEffect(() => {
        setIsMobile(windowWidth <= mobileSize)
        return () => {
        };
    }, [windowWidth])
    const fields = plans.map((p, i) => { 
        p.depth = i * initialDepth
        p.children = <ShapeBackground animation={isMobile ? false : p.animation} shapes={p.shapes} />
        return p 
    })
    return (
        <Suspense fallback={<Loader cover={true} />}>
            <FieldOfView
                perspective={innerHeight / innerWidth * 1618}
                mode="jumpPlan"
                plans={fields}
                minDepth={0}
                maxDepth={(plans.length - 1) * initialDepth}
                initialDepth={(plans.length - 1) * initialDepth} />
            <FlippingText />
        </Suspense>
    )
}
    export default memo(HomePage)