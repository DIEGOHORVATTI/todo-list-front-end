type Id = string | number

export const userNamesStorage: Array<string> = JSON.parse(localStorage.getItem('userNames') || '[]')

export const endpoints = {
  uploads: {
    createUploads: '/uploads',
    deleteUploads: (id: Id) => `/uploads/${id}`,
  },
  boards: {
    getAllBoards: '/boards',
    createBoard: '/boards',
    updateBoard: (id: Id) => `/boards/${id}`,
    deleteBoard: (id: Id) => `/boards/${id}`,
  },
  columns: {
    getAllColumns: '/columns',
    createColumn: '/columns',
    updateColumn: (id: Id) => `/columns/${id}`,
    deleteColumn: (id: Id) => `/columns/${id}`,
  },
  tasks: {
    getAllTasks: '/tasks',
    createTask: '/tasks',
    archiveTask: (id: Id) => `/tasks/${id}/archive`,
    getTask: (id: Id) => `/tasks/${id}`,
    updateTask: (id: Id) => `/tasks/${id}`,
    deleteTask: (id: Id) => `/tasks/${id}`,
  },
}

export const HOST_API = 'https://todo-list-back-end-production.up.railway.app'

export const COLORS = ['primary', 'secondary', 'info', 'success', 'warning', 'error'] as const
