type Id = string | number

export const userCurrencyStorage =
  localStorage.getItem('userId') ?? (localStorage.getItem('userName') || 'anonymous')

export const categoriesStorage: Array<string> = JSON.parse(
  localStorage.getItem('categories') || '[]'
)

export const userNamesStorage: Array<string> = JSON.parse(localStorage.getItem('userNames') || '[]')

const urlEndpointsParams = new URLSearchParams({ userName: userCurrencyStorage }).toString()

export const endpoints = {
  uploads: {
    createUploads: '/uploads',
    deleteUploads: (id: Id) => `/uploads/${id}`,
  },
  user: {
    getAllUsers: '/users',
    createUser: '/users',
    getUser: `/users/${userCurrencyStorage}`,
    getUserById: (id: Id) => `/users/${id}`,
    updateUser: (id: Id) => `/users/${id}?${urlEndpointsParams}`,
    deleteUser: (id: Id) => `/users/${id}`,
  },
  boards: {
    getAllBoards: `/boards?${urlEndpointsParams}`,
    createBoard: '/boards',
    updateBoard: (id: Id) => `/boards/${id}?${urlEndpointsParams}`,
    deleteBoard: (id: Id) => `/boards/${id}`,
  },
  columns: {
    getAllColumns: '/columns',
    createColumn: '/columns',
    updateColumn: (id: Id) => `/columns/${id}?${urlEndpointsParams}`,
    deleteColumn: (id: Id) => `/columns/${id}`,
  },
  tasks: {
    getAllTasks: `/tasks?${urlEndpointsParams}`,
    createTask: '/tasks',
    archiveTask: (id: Id) => `/tasks/${id}/archive`,
    getTask: (id: Id) => `/tasks/${id}`,
    updateTask: (id: Id) => `/tasks/${id}?${urlEndpointsParams}`,
    deleteTask: (id: Id) => `/tasks/${id}`,
  },
  notifications: {
    getAllNotifications: '/notifications',
    createNotification: '/notifications',
    updateNotification: (id: Id) => `/notifications/${id}?${urlEndpointsParams}`,
    deleteNotification: (id: Id) => `/notifications/${id}`,
  },
}

export const HOST_API = 'http://192.168.2.15:8000'

export const COLORS = ['primary', 'secondary', 'info', 'success', 'warning', 'error'] as const
