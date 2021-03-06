import * as React from 'react'
import DocumentPane from './DocumentPane'
import withInitialValue from '../utils/withInitialValue'
import {throttle} from 'lodash'
import {
  useConnectionState,
  useDocumentOperation,
  useEditState,
  useValidationStatus
} from '@sanity/react-hooks'

interface Props {
  title?: string
  paneKey: string
  type: any
  isLoading: boolean
  isSelected: boolean
  isCollapsed: boolean
  onChange: (patches: any[]) => void
  isClosable: boolean
  onExpand?: () => void
  onCollapse?: () => void
  menuItems: {title: string}[]
  menuItemGroups: {id: string}[]
  views: {
    type: string
    id: string
    title: string
    options: {}
    component: React.ComponentType<any>
  }[]
  initialValue?: {[field: string]: any}
  options: {
    id: string
    type: string
    template?: string
  }
  urlParams: {
    view: string
    rev: string
  }
}

function useThrottled(fn, wait, opts, deps) {
  const callback = React.useMemo(() => throttle(fn, wait, opts), deps)
  React.useEffect(() => () => callback.flush(), deps)
  return callback
}

export const DocumentPaneProvider = withInitialValue((props: Props) => {
  const {patch, commit}: any = useDocumentOperation(props.options.id, props.options.type)
  const editState: any = useEditState(props.options.id, props.options.type)
  const {markers} = useValidationStatus(props.options.id, props.options.type)
  const {isConnected} = useConnectionState(props.options.id, props.options.type)

  const runThrottled = useThrottled(run => run(), 1000, {leading: true, trailing: true}, [])

  const value = (editState && (editState.draft || editState.published)) || props.initialValue
  return (
    <DocumentPane
      {...props}
      onChange={patches => {
        patch.execute(patches)
        runThrottled(commit.execute)
      }}
      markers={markers}
      isConnected={isConnected}
      value={value}
      draft={editState && editState.draft}
      published={editState && editState.published}
      isLoading={!editState}
    />
  )
})
