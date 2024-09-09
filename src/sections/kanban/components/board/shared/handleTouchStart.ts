export const handleTouchStart = (
  lastTap: number,
  setLastTap: React.Dispatch<React.SetStateAction<number>>,
  setAnchorEl: React.Dispatch<React.SetStateAction<null | HTMLElement>>,
  event: TouchEvent
) => {
  event.preventDefault()

  const currentTime = new Date().getTime()
  const tapLength = currentTime - lastTap
  let timeout: NodeJS.Timeout | undefined

  clearTimeout(timeout)

  const isDoubleClick = tapLength < 500 && tapLength > 0

  if (isDoubleClick) {
    setAnchorEl(null)
    event.preventDefault()
  }

  if (!isDoubleClick) {
    timeout = setTimeout(() => {
      clearTimeout(timeout)
    }, 500)
  }

  setLastTap(currentTime)
}
