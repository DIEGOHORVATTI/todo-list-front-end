export const endpoints = {
  uploads: {
    createUploads: '/uploads',
    deleteUploads: (id) => `/uploads/${id}`,
  },
  boards: {
    getAllBoards: '/boards',
    createBoard: '/boards',
    updateBoard: (id) => `/boards/${id}`,
    deleteBoard: (id) => `/boards/${id}`,
  },
  columns: {
    getAllColumns: '/columns',
    createColumn: '/columns',
    updateColumn: (id) => `/columns/${id}`,
    deleteColumn: (id) => `/columns/${id}`,
  },
  tasks: {
    getAllTasks: '/tasks',
    createTask: '/tasks',
    archiveTask: (id) => `/tasks/${id}/archive`,
    getTask: (id) => `/tasks/${id}`,
    updateTask: (id) => `/tasks/${id}`,
    deleteTask: (id) => `/tasks/${id}`,
  },
}

export const HOST_API = 'https://todo-list-back-end-production.up.railway.app'

export const COLORS = ['primary', 'secondary', 'info', 'success', 'warning', 'error']
