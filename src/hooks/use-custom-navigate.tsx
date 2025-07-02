import { NavigateOptions, To, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './use-auth'

export function useCustomNavigate() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthanticated } = useAuth()

  const customNavigate = (to: To, options?: NavigateOptions) => {
    if (to === '/') {
      navigate(-1)
      return
    } else {
      navigate(to, options)
    }
  }

  return customNavigate
}
