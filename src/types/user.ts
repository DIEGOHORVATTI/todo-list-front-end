export type User = {
  _id: string
  name: string
  permissions: 'user' | 'admin'
  createdAt: string
  updatedAt: string
}
