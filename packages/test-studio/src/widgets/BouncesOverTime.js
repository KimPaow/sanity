/* global google */
import React from "react"
import { render } from "react-dom"
import PropTypes from 'prop-types'
import withAnalyticsData from "part:@sanity/google-analytics/withAnalyticsData"
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  Label,
  ResponsiveContainer
} from 'recharts';
import historyStore from 'part:@sanity/base/datastore/history'
import {from, merge, concat, timer, of as observableOf} from 'rxjs'
import {getPublishedId} from 'part:@sanity/base/util/draft-utils'
import {catchError, switchMap, map, mapTo, tap} from 'rxjs/operators'
import {format} from 'date-fns'
import styles from './AnalyticsWithPublished.css'
import {route} from '@sanity/state-router'
import {StateLink, withRouterHOC} from 'part:@sanity/base/router'

class AnalyticsWithPublished extends React.Component {

  _historyEventsSubscription = undefined

  state = {
    publishedEvents: []
  }

  componentDidMount() {
    this.createHistoryEventsSubscription()
  }

  componentWillUnmount() {
    if (this._historyEventsSubscription) this._historyEventsSubscription.unsubscribe()
  }

  createHistoryEventsSubscription = () => {
    const {draft, published} = this.props
    this._historyEventsSubscription =
      historyStore.historyEventsFor(getPublishedId((draft || published)._id))
      .pipe(
        map((events, i) => {
          const publishedEvents = events.filter(event => event.type === 'published')
          this.setState({publishedEvents})
          return events
        })
      )
      .subscribe()
  }

  convertNumberToDate = value => {
    const s = `${value}`
    const date = new Date()
    date.setFullYear( (s.substr(0,4)))
    date.setMonth( Number(s.substr(4,2)))
    date.setDate( Number(s.substr(6,2)))
    return date
  }

  handleClickPublished = rev => {
    alert(`Revision ${rev}`)
  }

  renderXtick = value => {
    return format(this.convertNumberToDate(value), 'D. MMM')
  }

  render() {
    const {data, labels, config, draft, published, historical, title} = this.props
    const {publishedEvents} = this.state

    if (!data) {
      return <div>Loading</div>
    }

    const formattedData = data.map(row => {
      return {
        date: Number(row[0]),
        b: Number(row[1]), // Bouncserate
      }
    })

    return (
      <div className={styles.root}>
        <h3>{title}</h3>
        <ResponsiveContainer width="100%" aspect={16 / 8}>
          <ComposedChart width={600} height={400} data={formattedData}>
            <defs>
              <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#156dff" stopOpacity={1}/>
                <stop offset="95%" stopColor="#156dff" stopOpacity={0.2}/>
              </linearGradient>
              <linearGradient id="newUsersGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16ae3c" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#16ae3c" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              minTickGap={100}
              tickFormatter={this.renderXtick}
              interval={7}
            />
            <YAxis
              datakey="b"
              type="number"
              domain={[0, 100]}
              interval={0}
            />

            <Line name={labels[1]} type="monotone" dataKey="b" stroke="#156dff" />
            <Tooltip
              labelFormatter={this.renderXtick}
              formatter={(value, name, props) => ([`${Math.round(value)}%`, name])}/>
            <Legend />
            {publishedEvents.map(event => {
              const endTime = new Date(event.endTime)
              const x = format(endTime, 'YYYYMMDD')
              return (
                <ReferenceLine
                  x={x}
                  stroke="#fa1607"
                  key={event.rev}
                  onClick={() => this.handleClickPublished(event.rev)}
                  strokeWidth={3}
                  opacity="0.4"
                />
              )
            })}
            {
              historical &&  (<ReferenceLine
                x={format(historical._updatedAt, 'YYYYMMDD')}
                stroke="#ffda15"
                strokeWidth={3}
                opacity="1"
              >
                <Label position="insideTop" content={()=> <div>Current version</div>} />
              </ReferenceLine>)
            }
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    )
  }
}

export default withAnalyticsData(withRouterHOC(AnalyticsWithPublished))
