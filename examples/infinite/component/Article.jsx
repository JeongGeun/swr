import useSWRInfinite from 'swr/infinite'
import { useSWRConfig } from 'swr'

import fetch from '../libs/fetch'
import React from 'react'
import { useEffect } from 'react'

export default function Article() {
  const { cache, fallback, mutate } = useSWRConfig()

  const { data, error, size, setSize, isValidating } = useSWRInfinite(
    index =>
      `https://jsonplaceholder.typicode.com/posts?_page=${index + 1}&_limit=1`,
    fetch,
    {
      revalidateFirstPage: false,
      revalidateOnMount: false
      // fallbackData
    }
  )
  console.log(cache, fallback)
  const issues = data ? [].concat(...data) : []
  const isLoadingInitialData = !data && !error
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === 'undefined')
  const isEmpty = data?.[0]?.length === 0
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < 1)
  const isRefreshing = isValidating && data && data.length === size

  useEffect(() => {
    mutate(
      'https://jsonplaceholder.typicode.com/posts?_page=1&_limit=1',
      [
        {
          userId: 1,
          id: 1,
          title:
            'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
          body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto'
        }
      ],
      { revalidate: false }
    )
  }, [])
  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <p>
        showing {size} page(s) of {isLoadingMore ? '...' : issues.length}{' '}
        issue(s){' '}
        <button
          disabled={isLoadingMore || isReachingEnd}
          onClick={() => setSize(size + 1)}
        >
          {isLoadingMore
            ? 'loading...'
            : isReachingEnd
            ? 'no more issues'
            : 'load more'}
        </button>
        <button disabled={isRefreshing} onClick={() => mutate()}>
          {isRefreshing ? 'refreshing...' : 'refresh'}
        </button>
        <button disabled={!size} onClick={() => setSize(0)}>
          clear
        </button>
      </p>
      {isEmpty ? <p>Yay, no issues found.</p> : null}
      {issues.map(issue => {
        return (
          <p key={issue.id} style={{ margin: '6px 0' }}>
            - {issue.title}
          </p>
        )
      })}
    </div>
  )
}
