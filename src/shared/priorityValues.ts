export const priorityValues = ['baixa', 'média', 'alta'] as const

export type PriorityValues = (typeof priorityValues)[number]
