/* eslint-disable no-console */
/* eslint-disable prefer-template */
import React from 'react'
import studioHintsConfig from 'part:@sanity/studio-hints/config?'
import StudioHintsComponents from 'part:@sanity/studio-hints/components'
import {isTrayOpenSetting} from 'part:@sanity/studio-hints/datastore'

import styles from './styles/Sidecar.css'

const StudioHints = StudioHintsComponents.StudioHintsLayout

class Sidecar extends React.PureComponent {
  state = {
    isOpen: false
  }

  subscription = null

  componentDidMount() {
    this.subscription = isTrayOpenSetting.listen().subscribe(isOpen => {
      this.setState({isOpen})
    })
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

  render() {
    const {isOpen} = this.state
    console.log('isOpen', isOpen)

    if (studioHintsConfig && isOpen) {
      return <div className={styles.root}>{StudioHints()}</div>
    }

    return null
  }
}

export default Sidecar
