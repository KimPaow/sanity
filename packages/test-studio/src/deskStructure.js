import React from 'react'
import RefreshIcon from 'part:@sanity/base/sync-icon'
import EyeIcon from 'part:@sanity/base/eye-icon'
import EditIcon from 'part:@sanity/base/edit-icon'
import MdImage from 'react-icons/lib/md/image'
import JsonDocumentDump from './components/JsonDocumentDump'
import {DeveloperPreview} from './previews/developer'
import S from '@sanity/desk-tool/structure-builder'
import AnalyticsWidget from 'part:@sanity/google-analytics/widget'
import AnalyticsWithPublished from './widgets/AnalyticsWithPublished'
import BouncesOverTime from './widgets/BouncesOverTime'

// For testing. Bump the timeout to introduce som lag
const delay = (val, ms = 10) => new Promise(resolve => setTimeout(resolve, ms, val))

function Preview(props) {
  const {history, draft, published} = props
  const {snapshot: historical, isLoading} = history.document

  if (!historical && isLoading) {
    return <Spinner center message="Loading document" />
  }

  return (
    <JSONPretty
      data={historical || draft || published}
      theme={monikai}
      mainStyle="white-space: pre-wrap"
    />
  )
}


function AnalyticsCustomComponent(props) {
  const {pathname} = props.displayedDocument
  return (
    <>
      <AnalyticsWithPublished
        title="Users all pages last year"
        draft={props.draft}
        published={props.published}
        historical={props.historical}
        labels={['Date', 'Users', 'Sessions', 'New users']}
        config={{
          reportType: 'ga',
          query: {
            dimensions: 'ga:date',
            metrics: 'ga:users, ga:sessions, ga:newUsers',
            'start-date': '365daysAgo',
            'end-date': 'yesterday'
          }
        }}
      />

      {pathname && (
        <BouncesOverTime
          title={`Bounce rate for ${pathname} last 30 days`}
          draft={props.draft}
          published={props.published}
          historical={props.historical}
          labels={['Date', 'Bounce rate']}
          config={{
            reportType: 'ga',
            query: {
              dimensions: 'ga:date',
              metrics: 'ga:bounceRate',
              'start-date': '30daysAgo',
              'end-date': 'yesterday',
              filters: `ga:pagePath=~^${pathname}`
            }
          }}
        />
      )}
    </>
  )
}

function AnalyticsComponent(props) {
  return (
    <div style={{padding: '1rem'}}>
      <h3>Users, sessions and new users last 30 days</h3>
      <AnalyticsWidget
        config={{
          onSelect: (selectedItem, cell, chart) => {
            console.log('select', selectedItem, cell, chart)
          },
          reportType: 'ga',
          query: {
            dimensions: 'ga:date',
            metrics: 'ga:users, ga:sessions, ga:newUsers',
            'start-date': '30daysAgo',
            'end-date': 'yesterday'
          },
          chart: {
            axes: {
              x: {
                0: { label: 'Date' }
              }
            },
            type: 'LINE',
            series: {
              0: {title: 'Users', color: '#145eda'},
              1: {title: 'Sessions', color: '#16ae3c'},
              2: {title: 'New users', color: '#cb160c'}
            }
          }
      }} />
      <h3>Bounce rate last 30 days</h3>
      <AnalyticsWidget config={{
        onSelect: (selectedItem, cell, chart) => {
          console.log('select', selectedItem, cell, chart)
        },
        reportType: 'ga',
        query: {
          dimensions: 'ga:date',
          metrics: 'ga:bounceRate',
          'start-date': '30daysAgo',
          'end-date': 'yesterday'
        },
        chart: {
          axes: {
            x: {
              0: { label: 'Date' }
            }
          },
          type: 'LINE',
          series: {
            0: {title: 'Bounce rate', color: '#145eda'},
          }
        }
      }} />
    </div>
  )
}

export default () =>
  S.list()
    .id('root')
    .title('Content')
    .items([
      S.documentListItem()
        .id('foo-bar')
        .title('Singleton author')
        .schemaType('author'),

      S.divider(),

      S.listItem()
        .title('Anything with a title')
        .icon(() => <span style={{fontSize: '2em'}}>T</span>)
        .child(() =>
          delay(
            S.documentList({
              id: 'title-list',
              title: 'Titles!',
              options: {
                filter: 'defined(title)'
              }
            })
          )
        ),

      S.listItem()
        .title('Singleton?')
        .child(delay(S.editor({id: 'editor', options: {id: 'circular', type: 'referenceTest'}})))
        .showIcon(false),

      S.documentListItem()
        .id('grrm')
        .schemaType('author')
        .child(
          S.component()
            .component(JsonDocumentDump)
            .menuItems([
              S.menuItem()
                .title('Reload')
                .action('reload')
                .icon(RefreshIcon)
                .showAsAction(true)
            ])
        ),
      S.listItem()
        .title('Deep')
        .child(
          S.list()
            .title('Deeper')
            .items([
              S.documentTypeListItem('book').title('Books'),
              S.documentTypeListItem('author').title('Authors')
            ])
        ),
      S.listItem()
        .title('Deep panes')
        .child(
          S.list()
            .title('Depth 1')
            .items([
              S.listItem()
                .title('Deeper')
                .child(
                  S.list()
                    .title('Depth 2')
                    .items([
                      S.listItem()
                        .title('Even deeper')
                        .child(
                          S.list()
                            .title('Depth 3')
                            .items([
                              S.listItem()
                                .title('Keep digging')
                                .child(
                                  S.list()
                                    .title('Depth 4')
                                    .items([
                                      S.listItem()
                                        .title('Dig into the core of the earth')
                                        .child(
                                          S.list()
                                            .title('Depth 5')
                                            .items([
                                              S.documentListItem()
                                                .id('grrm')
                                                .schemaType('author')
                                            ])
                                        )
                                    ])
                                )
                            ])
                        )
                    ])
                )
            ])
        ),

      S.listItem({
        id: 'developers',
        title: 'Developers',
        schemaType: 'author',
        child: () =>
          S.documentTypeList('author')
            .title('Developers')
            .filter('_type == $type && role == $role')
            .params({type: 'author', role: 'developer'})
            .initialValueTemplates(S.initialValueTemplateItem('author-developer'))
            .child(documentId =>
              S.document()
                .documentId(documentId)
                .schemaType('author')
                .views([
                  S.view.form().icon(EditIcon),
                  S.view
                    .component(DeveloperPreview)
                    .icon(EyeIcon)
                    .title('Preview'),
                  S.view.component(AnalyticsComponent).icon(EyeIcon).title('Simple anlytics'),
                  S.view.component(AnalyticsCustomComponent).title('Publish events').icon(EyeIcon)
                ])
            )
      }),

      S.listItem({
        id: 'books-by-author',
        title: 'Books by author',
        schemaType: 'book',
        child: () =>
          S.documentTypeList('author').child(authorId =>
            S.documentTypeList('book')
              .title('Books by author')
              .filter('_type == $type && author._ref == $authorId')
              .params({type: 'book', authorId})
              .initialValueTemplates([S.initialValueTemplateItem('book-by-author', {authorId})])
          )
      }),

      S.divider(),

      ...S.documentTypeListItems(),

      S.documentTypeListItem('sanity.imageAsset')
        .title('Images')
        .icon(MdImage)
    ])
