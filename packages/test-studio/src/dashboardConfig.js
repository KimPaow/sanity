import { resolve } from "url"

export default {
  widgets: [
    {
      name: 'google-analytics',
      layout: {
        width: 'large'
      },
      options: {
        title: 'Last 30 days',
        gaConfig: {
          onSelect: (selectedItem, cell, chart) => {
            console.log(selectedItem, cell, chart)
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
        }
      }
    },
    {
      name: 'google-analytics',
      layout: {
        width: 'medium'
      },
      options: {
        title: 'World map',
        onSelect: (selectedItem, cell, chart) => {
          console.log(selectedItem, cell, chart)
        },
        gaConfig: {
          reportType: 'ga',
          query: {
            dimensions: 'ga:country',
            metrics: 'ga:users',
            'start-date': '30daysAgo',
            'end-date': 'yesterday'
          },
          chart: {
            type: 'GEO',
            width: '100%',
            colorAxis: { colors: ['#f6eafd', '#a935f0', '#331455']}
          }
        }
      }
    },
    {
      name: 'google-analytics',
      layout: {
        width: 'medium'
      },
      options: {
        title: 'Top 5 countries',
        gaConfig: {
          onSelect: (selectedItem, cell, chart) => {
            console.log(selectedItem, cell, chart)
          },
          reportType: 'ga',
          query: {
            dimensions: 'ga:country',
            metrics: 'ga:users, ga:newUsers',
            'start-date': '30daysAgo',
            'end-date': 'yesterday',
            sort: '-ga:users',
            'max-results': 5
          },
          chart: {
            type: 'BAR',
            width: '100%',
            title: 'Title',
            axes: {
              x: {
                0: { label: 'Country' }
              }
            },
            series: {
              0: {
                title: 'Users',
                color: '#ff7a00'
              },
              1: {
                title: 'New users',
                color: '#16ae3c'
              }
            }
          }
        }
      }
    },
    {
      name: 'google-analytics',
      layout: {
        width: 'medium'
      },
      options: {
        title: 'Total page views by browser',
        gaConfig: {
          reportType: 'ga',
          query: {
            dimensions: 'ga:browser',
            metrics: 'ga:pageViews',
            'max-results': 5,
            sort: '-ga:pageViews',
          },
          chart: {
            title: 'Browsers',
            type: 'BAR',
            width: '100%',
            height: '500px',
            legend: { position: 'none' }
          }
        }
      }
    },
    {
      name: 'google-analytics',
      layout: {
        width: 'medium'
      },
      options: {
        title: 'Top 10 bouncing blog posts',
        gaConfig: {
          onSelect: (selectedItem, cell, chart) => {
            console.log(selectedItem, cell, chart)
          },
          reportType: 'ga',
          query: {
            dimensions: 'ga:pagePath',
            'max-results': 10,
            metrics: 'ga:bounceRate, ga:bounces, ga:pageViews',
            sort: '-ga:bounceRate',
            'start-date': '30daysAgo',
            'end-date': 'yesterday',
            filters: 'ga:pagePath=~^/blog;ga:bounces>50'
          },
          chart: {
            type: 'TABLE',
            options: {
              width: '100%',
            }
          }
        }
      }
    },
    {
      name: 'google-analytics',
      layout: {
        width: 'small'
      },
      options: {
        title: 'Top 10 pages',
        gaConfig: {
          onSelect: (selectedItem, cell, chart) => {
            console.log(selectedItem, cell, chart)
          },
          reportType: 'ga',
          query: {
            dimensions: 'ga:pagePath',
            'max-results': 10,
            metrics: 'ga:pageViews',
            sort: '-ga:pageViews',
            'start-date': '30daysAgo',
            'end-date': 'yesterday'
          },
          chart: {
            type: 'TABLE',
            options: {
              width: '100%',
            },
            axes: {
              x: {
                0: { label: 'Country' }
              }
            },
            series: {
              0: { title: 'Users'},
              1: { title: 'New users'}
            }
          }
        }
      }
    },
    {
      name: 'google-analytics',
      layout: {
        width: 'large'
      },
      options: {
        title: 'Top 10 screen resolutions',
        gaConfig: {
          onSelect: (selectedItem, cell, chart) => {
            console.log(selectedItem, cell, chart)
          },
          reportType: 'ga',
          query: {
            dimensions: 'ga:screenResolution',
            metrics: 'ga:users, ga:newUsers',
            'start-date': '365daysAgo',
            'end-date': 'yesterday',
            'max-results': 10,
            sort: '-ga:users',
          },
          chart: {
            axes: {
              x: {
                0: { label: 'Screen resolution' }
              }
            },
            type: 'BAR',
            series: {
              0: {title: 'Users', color: '#145eda'},
              1: {title: 'New users', color: '#cb160c'}
            }
          }
        }
      }
    }
  ]
}
