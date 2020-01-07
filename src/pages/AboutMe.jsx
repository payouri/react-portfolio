// import PropTypes from 'prop-types'
import photo from '@assets/imgs/71497177_10221257600255596_4122671362911240192_o.jpg'
import React, { lazy, memo, Suspense, useEffect, useState } from 'react'
import styles from './AboutMe.css'

const Screen = lazy(() => import('@cmp/Screen/Screen'))
const TwoColumns = lazy(() => import('@cmp/Layouts/TwoColumns'))
const Image = lazy(() => import('@cmp/Image/Image'))
const Loader = lazy(() => import('@cmp/Loader/Loader'))
const TextTyper = lazy(() => import('@cmp/TextTyper/TextTyper'))
const Icon = lazy(() => import('@cmp/Icon/Icon'))

const aboutMeText = `
    Hello I am Youri and I want to build great <emotive data-emotion="👌">experiences</emotive>.<br>
    As a developer I <emotive data-emotion="🤩" style="animation-delay: 400ms;"><strong>thrive</strong></emotive>
    to craft tailored apps by combining industry standards and new cutting edge technics.<br>
    In order to achieve that I keep myself updated with the latest technologies.<br>`
const pausingIndexes = [100, 237]
const time = () => Math.random() * 50 + 20
const pauseTime = 2000

const AboutMe = () => {
    const [textDone, setTextDone] = useState(false)
    useEffect(() => {

    }, [])
    return (
        <Suspense fallback={<Loader cover={true} />}>
            <Screen avoidNav>
                <TwoColumns
                    wrapperStyles={{ height: '100%' }}
                    leftSlot={
                        <div className={styles['left-col-inner']}>
                            <Suspense fallback={<Loader cover={true} />}><Image height={'100%'} maxHeight={'100%'} fallback={photo} /></Suspense>
                            <ul
                                className={styles['social-list']}
                            >
                                <li>
                                    <a href="#" style={{ textDecoration: 'none', color: 'currentColor' }}>
                                        <span style={{ marginRight: '.25rem', borderBottom: '1px solid' }}>codepen.io/Zorlimar</span>
                                        <Icon prefix="fab" icon="codepen" />
                                    </a>
                                </li>
                                <li>
                                    <a href="#" style={{ textDecoration: 'none', color: 'currentColor' }}>
                                        <span style={{ marginRight: '.25rem', borderBottom: '1px solid' }}>github.com/payouri</span>
                                        <Icon prefix="fab" icon="github" />
                                    </a>
                                </li>
                                <li>
                                    <a href="#" style={{ textDecoration: 'none', color: 'currentColor' }}>
                                        <span style={{ marginRight: '.25rem', borderBottom: '1px solid' }}>contact form</span>
                                        <Icon icon="envelope" />
                                    </a>
                                </li>
                            </ul>

                        </div>
                    }
                    rightColStyle={{
                        padding: '.75rem'
                    }}
                    rightSlot={
                        <TextTyper
                            startIndex={textDone ? aboutMeText.length : undefined}
                            str={aboutMeText}
                            pausingIndexes={pausingIndexes}
                            timeBetweenType={time}
                            pauseTime={pauseTime}
                        />
                    }
                />
            </Screen>
        </Suspense>
    )
}


export default memo(AboutMe)