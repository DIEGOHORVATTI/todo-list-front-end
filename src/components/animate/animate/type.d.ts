type EaseType =
  | 'linear'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | 'circIn'
  | 'circOut'
  | 'circInOut'
  | 'backIn'
  | 'backOut'
  | 'backInOut'
  | 'anticipate'
  | number[]

type VariantsType = {
  distance?: number
  durationIn?: number
  durationOut?: number
  easeIn?: EaseType
  easeOut?: EaseType
}

type TranHoverType = {
  duration?: number
  ease?: EaseType
}

type TranEnterType = {
  durationIn?: number
  easeIn?: EaseType
}

type TranExitType = {
  durationOut?: number
  easeOut?: EaseType
}

export type BackgroundType = {
  colors?: string[]
  duration?: number
  ease?: EaseType
}
