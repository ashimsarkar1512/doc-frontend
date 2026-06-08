import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

/**
 * Use these typed hooks throughout the app instead of the plain
 * `useDispatch` and `useSelector` from react-redux.
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
