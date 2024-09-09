import { useEffect } from 'react'
import rtlPlugin from 'stylis-plugin-rtl'
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'

export default function RTL({ children, themeDirection }) {
  useEffect(() => {
    document.dir = themeDirection
  }, [themeDirection])

  const cacheRtl = createCache({
    key: 'rtl',
    prepend: true,
    stylisPlugins: [rtlPlugin],
  })

  if (themeDirection === 'rtl') {
    return <CacheProvider value={cacheRtl}>{children}</CacheProvider>
  }

  return <>{children}</>
}

export function direction(themeDirection) {
  const theme = {
    direction: themeDirection,
  }

  return theme
}
