// 'use client'

import { useState, useRef, useEffect } from 'react'

type MutableRefObject<T> = {
  current: T
}

type EventType = 'resize' | 'scroll'

const useEffectInEvent = (event: EventType, useCapture?: boolean, set?: () => void) => {
  useEffect(() => {
    if (set) {
      set()
      window.addEventListener(event, set, useCapture)

      return () => window.removeEventListener(event, set, useCapture)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export const useRect = <T extends HTMLDivElement | null>(
  event: EventType = 'resize'
): {
  rect: DOMRect | undefined
  reference: MutableRefObject<T | null>
  screenHeight: number
  screenWidth: number
} => {
  const [rect, setRect] = useState<DOMRect>()

  const reference = useRef<T>(null)

  const [screenHeight, setScreenHeight] = useState(window.innerHeight)
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)

  const set = (): void => {
    setRect(reference.current?.getBoundingClientRect())
  }

  useEffectInEvent(event, true, set)
  const handleResize = () => {
    setScreenHeight(window.innerHeight)
    setScreenWidth(window.innerWidth)
  }

  useEffect(() => {
    window.addEventListener(event, handleResize)
    return () => {
      window.removeEventListener(event, handleResize)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { rect, reference, screenHeight, screenWidth }
}
