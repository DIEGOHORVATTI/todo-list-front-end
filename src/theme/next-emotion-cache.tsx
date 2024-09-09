'use client'

import * as React from 'react'
import createCache from '@emotion/cache'
import { CacheProvider as DefaultCacheProvider } from '@emotion/react'
import type { EmotionCache, Options as OptionsOfCreateCache } from '@emotion/cache'

export type NextAppDirEmotionCacheProviderProps = {
  /** This is the options passed to createCache() from 'import createCache from "@emotion/cache"' */
  options: Omit<OptionsOfCreateCache, 'insertionPoint'>
  /** By default <CacheProvider /> from 'import { CacheProvider } from "@emotion/react"' */
  CacheProvider?: (props: {
    value: EmotionCache
    children: React.ReactNode
  }) => React.JSX.Element | null
  children: React.ReactNode
}

// Adapted from https://github.com/garronej/tss-react/blob/main/src/next/appDir.tsx
export default function NextAppDirEmotionCacheProvider(props: NextAppDirEmotionCacheProviderProps) {
  const { options, CacheProvider = DefaultCacheProvider, children } = props

  const [cache] = React.useState(() => {
    const cache = createCache(options)
    cache.compat = true
    return cache
  })

  const [insertedStyles, setInsertedStyles] = React.useState<string[]>([])

  React.useEffect(() => {
    const prevInsert = cache.insert
    let inserted: { name: string; isGlobal: boolean }[] = []
    cache.insert = (...args: [any, any]) => {
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

    setInsertedStyles(styles as string[])
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
