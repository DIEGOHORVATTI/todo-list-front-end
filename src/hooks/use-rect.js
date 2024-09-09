import { useState, useRef, useEffect } from 'react'

const useEffectInEvent = (event, useCapture, set) => {
  useEffect(() => {
    if (set) {
      set()
      window.addEventListener(event, set, useCapture)

      return () => window.removeEventListener(event, set, useCapture)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export const useRect = (event) => {
  const [rect, setRect] = useState()

  const reference = useRef(null)

  const [screenHeight, setScreenHeight] = useState(window.innerHeight)
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)

  const set = () => {
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
