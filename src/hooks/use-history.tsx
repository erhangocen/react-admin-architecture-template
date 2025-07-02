import { ReactNode, createContext, useContext, useState } from 'react'

interface IHistoryContext {
  addRoute: (route: string) => void
  getPreviousRoute: () => string | null
  historyStack: string[]
  resetHistory: () => void
}

interface HistoryProviderProps {
  children: ReactNode
}

export const HistoryContext = createContext<IHistoryContext>(
  {} as IHistoryContext
)

export const HistoryProvider: React.FC<HistoryProviderProps> = ({
  children,
}) => {
  const [historyStack, setHistoryStack] = useState<string[]>([])

  const addRoute = (route: string) => {
    if (historyStack.at(-1) !== route) {
      setHistoryStack((prevStack) => [...prevStack, route])
    }
  }

  const resetHistory = () => {
    setHistoryStack([])
  }

  const getPreviousRoute = () => {
    if (historyStack.length > 1) {
      const newStack = [...historyStack]
      newStack.pop() // Remove current route
      const previousRoute = newStack[newStack.length - 1]
      setHistoryStack(newStack)
      return previousRoute
    }
    return null
  }

  return (
    <HistoryContext.Provider
      value={{
        addRoute,
        getPreviousRoute,
        historyStack,
        resetHistory,
      }}
    >
      {children}
    </HistoryContext.Provider>
  )
}

export const useHistory = () => useContext(HistoryContext)
