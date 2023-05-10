import { useContext } from 'react'
import { TransactionContext } from 'store/context/TransactionContext'

export default function useTransactionModal() {
  return useContext(TransactionContext)
}
