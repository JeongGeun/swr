import useSWRInfinite, {
  unstable_serialize as infinite_unstable_serialize
} from 'swr/infinite'
import { useSWRConfig, unstable_serialize } from 'swr'

import fetch from '../libs/fetch'
import React from 'react'
import { useEffect } from 'react'

function useSetInfiniteSwrInitialCache(getKey) {
  const { mutate, fallback } = useSWRConfig()

  useEffect(() => {
    const [fallbackData] = fallback[infinite_unstable_serialize(getKey)]
    mutate(unstable_serialize(getKey(0)), fallbackData, {
      revalidate: false
    })
  }, [mutate])
}

const getKey = index => {
  return {
    url: 'https://jsonplaceholder.typicode.com/posts',
    page: index + 1
  }
}

export default function Article() {
  const { data, error, size, setSize, isValidating, mutate } = useSWRInfinite(
    getKey,
    ({ url, page }) => fetch(`${url}/?_page=${page}&_limit=1`),
    {
      revalidateFirstPage: false
    }
  )

  const issues = data ? [].concat(...data) : []
  const isLoadingInitialData = !data && !error
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === 'undefined')
  const isEmpty = data?.[0]?.length === 0
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < 1)
  const isRefreshing = isValidating && data && data.length === size

  useSetInfiniteSwrInitialCache(getKey)

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
