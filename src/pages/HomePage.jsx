import React, { lazy, Suspense } from 'react'
import PropTypes from 'prop-types'

const Loader = lazy(() => import('../Loader/Loader'))
const FlippingText = lazy(() => import('../FlippingText/FlippingText'))
const FieldOfView = lazy(() => import('../PlanNavigation/PlanNavigation'))
const ShapeBackground = lazy(() => import('../ShapeBackground/ShapeBackground'))

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
  { style: { /* top: '1rem', bottom: '1rem', left: '1rem', right: '1rem', borderRadius: '.5rem', */ }, children:<ShapeBackground animated={false}/>, unReachable: true },
  { style: { /* top: '1rem', bottom: '1rem', left: '1rem', right: '1rem', borderRadius: '.5rem', */ }, children:<ShapeBackground animated={true}/>, unReachable: true },
  { style: { /* top: '1rem', bottom: '1rem', left: '1rem', right: '1rem', borderRadius: '.5rem', */ }, children:<ShapeBackground /> },
  { style: { /* top: '1rem', bottom: '1rem', left: '1rem', right: '1rem', borderRadius: '.5rem', */ }, children:<ShapeBackground /> },
  { style: { /* top: '1rem', bottom: '1rem', left: '1rem', right: '1rem', borderRadius: '.5rem', */ }, children:<ShapeBackground shapes={firstPlanShapes}/> }
].map((p, i) => { p.depth = i * initialDepth; return p })

const HomePage = () => (
    <Suspense fallback={<Loader cover={true}/>}>
        <FieldOfView 
            perspective={innerHeight/innerWidth * 1618} 
            mode="jumpPlan" 
            plans={plans} 
            minDepth={0} 
            maxDepth={(plans.length - 1) * initialDepth} 
            initialDepth={(plans.length - 1) * initialDepth}/>
        <FlippingText />
    </Suspense>
)

export default HomePage