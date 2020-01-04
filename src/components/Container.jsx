import React, { Suspense, memo } from 'react'
import { useLocation } from 'react-router'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import Loader from '@cmp/Loader/Loader'
import styles from './Container.css'
import maskStyles from './maskTransition.css'

function Container({ children }) {
    // const pathname = useMemo(() => location.pathname, [ location ])
    const location = useLocation()
    return (
        <TransitionGroup className={styles['container']}>
            <CSSTransition
                mountOnEnter={false}
                unmountOnExit={true}
                key={location.key + location.pathname}
                classNames={maskStyles}
                timeout={{
                    enter: 1500,
                    exit: 1500,
                }}
            >
                <div className={styles['app-inner']}>
                    <Suspense fallback={<Loader cover={true} />}>
                        {children}
                    </Suspense>
                </div>
            </CSSTransition>
        </TransitionGroup>
    )
}

export default memo(Container)
