import { useContext } from 'react'
import { AppContext } from './context.js'

export function useApp() {
  return useContext(AppContext)
}
