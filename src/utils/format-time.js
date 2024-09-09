import { format, formatDistanceToNow } from 'date-fns'

export function fDate(date, newFormat?) {
  const fm = newFormat || 'dd MMM yyyy'

  return date ? format(new Date(date), fm) : ''
}

export function fToNow(date) {
  return date
    ? formatDistanceToNow(new Date(date), {
      addSuffix: true,
    })
    : ''
}
