import React, { lazy, Suspense, } from 'react'
// import PropTypes from 'prop-types'
import photo from '@assets/imgs/71497177_10221257600255596_4122671362911240192_o.jpg'

const Screen = lazy(() => import('@cmp/Screen/Screen'))
const TwoColumns = lazy(() => import('@cmp/Layouts/TwoColumns'))
const Image = lazy(() => import('@cmp/Image/Image'))
const Loader = lazy(() => import('@cmp/Loader/Loader'))
const TextTyper = lazy(() => import('@cmp/TextTyper/TextTyper'))

const aboutMeText = `Hello I am Youri and I want to build great <emotive data-emotion="👌">experiences</emotive>.<br>
As a developer I <emotive data-emotion="🤩" style="animation-delay: 400ms;"><strong>thrive</strong></emotive> to find new cutting edge technics, while trying to keep myself updated with all what`
const pausingIndexes = [ 3, 21, 66 ]
const time = () => Math.random() * 50 + 20
const pauseTime = 3000

const AboutMe = () => (
    <Suspense fallback={<Loader cover={true} />}>
        <Screen avoidNav>
            <TwoColumns
                wrapperStyles={{ height: '100%' }}
                leftColStyle={{ position: 'relative' }}
                leftSlot={ <Suspense fallback={<Loader cover={true} />}><Image height={'100%'} maxHeight={'100%'} fallback={photo} /></Suspense> }
                rightSlot={<TextTyper str={aboutMeText} pausingIndexes={pausingIndexes} timeBetweenType={time} pauseTime={pauseTime}/>}
            />
        </Screen>
    </Suspense>
)

export default AboutMe