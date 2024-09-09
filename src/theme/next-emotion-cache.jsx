'use client'

import * as React from 'react'
import createCache from '@emotion/cache'
import { CacheProvider as DefaultCacheProvider } from '@emotion/react'

export default function NextAppDirEmotionCacheProvider(props) {
  const { options, CacheProvider = DefaultCacheProvider, children } = props

  const [cache] = React.useState(() => {
    const cache = createCache(options)
    cache.compat = true
    return cache
  })

  const [insertedStyles, setInsertedStyles] = React.useState([])

  React.useEffect(() => {
    const prevInsert = cache.insert
    let inserted = []
    cache.insert = (...args) => {
      const [selector, serialized] = args
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push({
          name: serialized.name,
          isGlobal: !selector,
        })
      }
      /* @ts-ignore */
      return prevInsert(...args)
    }

    const flush = () => {
      const prevInserted = inserted
      inserted = []
      return prevInserted
    }

    const styles = flush()
      .map(({ name, isGlobal }) => {
        const style = cache.inserted[name]
        if (typeof style !== 'boolean') {
          if (isGlobal) {
            return `<style data-emotion="${cache.key}-global ${name}">${style}</style>`
          } else {
            return `<style data-emotion="${cache.key} ${name}">${style}</style>`
          }
        }
        return null
      })
      .filter(Boolean)

    setInsertedStyles(styles)
  }, [cache])

  return (
    <CacheProvider value={cache}>
      {children}
      {insertedStyles.map((style, index) => (
        <div key={index} dangerouslySetInnerHTML={{ __html: style }} />
      ))}
    </CacheProvider>
  )
}
