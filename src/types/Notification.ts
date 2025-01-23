import { PriorityValues } from '@/shared/priorityValues'

export type Notification = {
  _id: string
  title: string
  description: string
  view: boolean
  taskId: string
  priority: PriorityValues
  createdAt: string
  updatedAt: string
}
