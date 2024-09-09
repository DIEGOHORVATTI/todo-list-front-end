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

export type VariantsType = {
  distance?
  durationIn?
  durationOut?
  easeIn?: EaseType
  easeOut?: EaseType
}

export type TranHoverType = {
  duration?
  ease?: EaseType
}

export type TranEnterType = {
  durationIn?
  easeIn?: EaseType
}

export type TranExitType = {
  durationOut?
  easeOut?: EaseType
}

export type BackgroundType = {
  colors?[]
  duration?
  ease?: EaseType
}
