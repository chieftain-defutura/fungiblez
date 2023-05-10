import React, { createContext, ReactNode, useMemo, useState } from 'react'
import TransactionModal from '../../components/Modals/TransactionModal'
import useUpdateEffect from '../../hooks/useUpdateEffect'

interface ITransaction {
  loading: boolean
  status: 'pending' | 'success' | 'error'
  message?: string
}

interface ITransactionContext extends ITransaction {
  setTransaction: React.Dispatch<React.SetStateAction<ITransaction>>
}

export const TransactionContext = createContext<ITransactionContext>({
  loading: false,
  status: 'pending',
  message: undefined,
  setTransaction: () => {},
})

const TransactionContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [transaction, setTransaction] = useState<ITransaction>({
    loading: false,
    status: 'pending',
    message: undefined,
  })

  useMemo(() => {
    if (transaction.status === 'error' || transaction.status === 'success') {
      setTimeout(() => {
        setTransaction({ ...transaction, status: 'pending', loading: false })
      }, 3000)
    }
  }, [transaction, setTransaction])

  useUpdateEffect(() => {
    if (!transaction.loading) {
      setTransaction({
        loading: false,
        status: 'pending',
        message: undefined,
      })
    }
  }, [transaction.loading])

  return (
    <TransactionContext.Provider value={{ ...transaction, setTransaction }}>
      {children}
      <TransactionModal
        modal={transaction.loading}
        message={transaction.message}
        status={transaction.status}
      />
    </TransactionContext.Provider>
  )
}

export default TransactionContextProvider
