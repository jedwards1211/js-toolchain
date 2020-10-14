/**
 * @flow
 * @prettier
 */

import * as React from 'react'
import { useContext, useEffect, useRef } from 'react'

export type TransitionState =
  | 'out'
  | 'in'
  | 'appearing'
  | 'entering'
  | 'leaving'

const BaseTransitionContext: React.Context<TransitionState> = React.createContext(
  'in'
)

export function useTransitionContext(): TransitionState {
  return useContext(BaseTransitionContext)
}

const priority: Array<TransitionState> = [
  'out',
  'leaving',
  'appearing',
  'entering',
]

export function overallTransitionState(
  parentState: TransitionState,
  childState: TransitionState
): TransitionState {
  for (let state of priority) {
    if (parentState === state || childState === state) return state
  }
  return childState
}

export type Props = {
  state: TransitionState,
  children: React.Node,
}

export function TransitionContext({ state, children }: Props): React.Node {
  const parentState = useTransitionContext()
  const overallState = overallTransitionState(parentState, state)
  return (
    <BaseTransitionContext.Provider value={overallState}>
      {children}
    </BaseTransitionContext.Provider>
  )
}

function outish(state: ?TransitionState): boolean {
  return state === 'out' || state === 'leaving'
}

export type TransitionStateEffect = (
  prevState: ?TransitionState,
  nextState: TransitionState
) => any

export function useTransitionStateEffect(effect: TransitionStateEffect) {
  const nextState = useTransitionContext()
  const prevStateRef = useRef(null)
  const effectRef = useRef(effect)
  effectRef.current = effect

  useEffect(() => {
    const prevState = prevStateRef.current
    const effect: TransitionStateEffect = (effectRef.current: any)
    prevStateRef.current = nextState
    effect(prevState, nextState)
  }, [nextState])

  useEffect((): (() => void) => {
    return () => {
      const effect: TransitionStateEffect = (effectRef.current: any)
      if (!outish(nextState)) effect(nextState, 'leaving')
    }
  }, [])
}

type TransitionStateEffectFilter = (TransitionStateEffect) => void

export function useTransitionStateEffectFilter(
  filter: (prevState: ?TransitionState, nextState: TransitionState) => boolean
): TransitionStateEffectFilter {
  return (effect: TransitionStateEffect) =>
    useTransitionStateEffect(
      (prevState: ?TransitionState, nextState: TransitionState) => {
        if (filter(prevState, nextState)) effect(prevState, nextState)
      }
    )
}

export const useAppearingEffect: TransitionStateEffectFilter = useTransitionStateEffectFilter(
  (prevState, nextState) =>
    outish(prevState || 'out') && nextState === 'appearing'
)
export const useEnteringEffect: TransitionStateEffectFilter = useTransitionStateEffectFilter(
  (prevState, nextState) =>
    outish(prevState || 'out') && nextState === 'entering'
)
export const useAppearedEffect: TransitionStateEffectFilter = useTransitionStateEffectFilter(
  (prevState, nextState) => prevState === 'appearing' && nextState === 'in'
)
export const useEnteredEffect: TransitionStateEffectFilter = useTransitionStateEffectFilter(
  (prevState, nextState) => prevState === 'entering' && nextState === 'in'
)
export const useCameInEffect: TransitionStateEffectFilter = useTransitionStateEffectFilter(
  (prevState, nextState) => nextState === 'in'
)
export const useLeavingEffect: TransitionStateEffectFilter = useTransitionStateEffectFilter(
  (prevState, nextState) =>
    !outish(prevState || 'out') && nextState === 'leaving'
)
export const useLeftEffect: TransitionStateEffectFilter = useTransitionStateEffectFilter(
  (prevState, nextState) => prevState === 'leaving' && nextState === 'out'
)
export function useAutofocusRef(): React.ElementRef<any> {
  const ref = useRef()
  useCameInEffect(() => {
    const el = ref.current
    if (el) {
      el.focus()
      if (typeof el.select === 'function') el.select()
    }
  })
  return ref
}
