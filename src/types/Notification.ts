import { PriorityValues } from '@/shared/priorityValues'

export type Notification = {
  _id: string
  title: string
  description: string
  userId: string
  view: boolean
  taskId: string
  assignee?: Array<{ userId: string }>
  priority: PriorityValues
  createdAt: string
  updatedAt: string
}
