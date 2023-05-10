import React, { ReactNode } from 'react'

import TransactionContextProvider from './context/TransactionContext'

const Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <TransactionContextProvider>{children}</TransactionContextProvider>
}

export default Provider
