export const handleTouchStart = (
  lastTap,
  setLastTap,
  setAnchorEl,
  event
) => {
  event.preventDefault()

  const currentTime = new Date().getTime()
  const tapLength = currentTime - lastTap
  let timeout

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
