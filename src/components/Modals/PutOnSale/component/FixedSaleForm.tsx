import React, { useRef, useState } from 'react'
import Button from 'components/Button'
import { Field, Form, Formik } from 'formik'
import { useAccount, useSigner } from 'wagmi'
import { ethers } from 'ethers'
import * as Yup from 'yup'

import {
  CROTokenAddress,
  MARKETPLACE_CONTRACT_ADDRESS,
  WCROTokenAddress,
} from 'utils/address'
import { useTransactionModal } from 'hooks'
import MarketplaceABI from '../../../../utils/abi/marketplace.json'
import { ReactComponent as ArrowLeft } from '../../../../assets/icons/arrow-left.svg'
import { parseUnits } from 'ethers/lib/utils.js'

const tokensLists = [
  {
    tokenAddress: CROTokenAddress,
    isApproved: false,
    name: 'CRO',
    balance: 0,
  },
  {
    tokenAddress: WCROTokenAddress,
    isApproved: false,
    name: 'WCRO',
    balance: 0,
  },
]

interface IFixedSaleForm {
  setPutOnSaleOpen: React.Dispatch<React.SetStateAction<string>>
  modal: boolean
  id: string
  nftAddress: string
}
const FixedSaleForm: React.FC<IFixedSaleForm> = ({
  setPutOnSaleOpen,
  nftAddress,
  id,
}) => {
  const { address } = useAccount()
  const parent = useRef(null)
  const { data: signerData } = useSigner()
  const { setTransaction } = useTransactionModal()
  const [dropdown, setDropdown] = useState(false)
  const [selectedToken, setSelectedToken] = useState(tokensLists[0])

  const validationSchema = Yup.object({
    amount: Yup.number()
      .positive('Amount must be greater than zero')
      .required('Amount is required'),
  })

  const handlePutOnSale = async (values: any) => {
    if (!address || !signerData) return
    try {
      setTransaction({
        loading: true,
        status: 'pending',
      })
      const contract = new ethers.Contract(
        MARKETPLACE_CONTRACT_ADDRESS,
        MarketplaceABI,
        signerData as any,
      )
      const tx = await contract.fixedSale(
        id.toString(),
        parseUnits(values.amount.toString()),
        selectedToken.tokenAddress,
        nftAddress,
      )
      await tx.wait()
      setTransaction({
        loading: true,
        status: 'success',
      })
    } catch (error) {
      console.log('------Error On Put on sale--------')
      console.log(error)
      setTransaction({ loading: true, status: 'error' })
    }
  }
  return (
    <div>
      <Formik
        initialValues={{ amount: '' }}
        onSubmit={handlePutOnSale}
        validationSchema={validationSchema}
      >
        {({ errors, touched }) => (
          <Form>
            <div onClick={() => setPutOnSaleOpen('')}>
              <ArrowLeft />
            </div>
            <div className="fixed-sale-form">
              <div>
                <Field type="number" placeholder="Amount" name="amount" />
                {touched.amount && errors.amount ? (
                  <p>{errors.amount}</p>
                ) : null}
              </div>

              <div className="dropDown">
                <div
                  className="select-dropDown"
                  onClick={() => setDropdown((d) => !d)}
                >
                  <p>{selectedToken.name}</p>
                </div>
                <div ref={parent}>
                  {dropdown && (
                    <div className="dropDown-list">
                      {tokensLists.map((f, index) => {
                        return (
                          <div
                            className="dropDown-items usdt-img"
                            key={index}
                            onClick={() => {
                              setSelectedToken(f)
                              setDropdown(false)
                            }}
                          >
                            <p>{f.name}</p>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              <Button variant="ternary" type="submit">
                Confirm
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default FixedSaleForm
