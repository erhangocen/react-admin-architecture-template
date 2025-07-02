// RouteTracker.js
import { useHistory } from '@/hooks/use-history'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const RouteTracker = () => {
  const location = useLocation()
  const { addRoute } = useHistory()

  useEffect(() => {
    addRoute(location.pathname)
  }, [location, addRoute])

  return null
}

export default RouteTracker
