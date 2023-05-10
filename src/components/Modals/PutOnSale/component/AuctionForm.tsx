import React, { useRef, useState } from 'react'
import Button from 'components/Button'
import { Field, Form, Formik } from 'formik'
import {
  CROTokenAddress,
  MARKETPLACE_CONTRACT_ADDRESS,
  WCROTokenAddress,
} from 'utils/address'
import MarketplaceABI from '../../../../utils/abi/marketplace.json'
import { ReactComponent as ArrowLeft } from '../../../../assets/icons/arrow-left.svg'
import { useAccount, useSigner } from 'wagmi'
import { useTransactionModal } from 'hooks'
import { ethers } from 'ethers'
import * as Yup from 'yup'
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

interface IAuctionForm {
  setPutOnSaleOpen: React.Dispatch<React.SetStateAction<string>>
  id: string
  nftaddress: string
}
const AuctionForm: React.FC<IAuctionForm> = ({
  setPutOnSaleOpen,
  id,
  nftaddress,
}) => {
  const { address } = useAccount()
  const parent = useRef(null)
  const { data: signerData } = useSigner()
  const { setTransaction } = useTransactionModal()
  const [dropdown, setDropdown] = useState(false)
  const [selectedToken, setSelectedToken] = useState(tokensLists[0])

  const validationSchema = Yup.object({
    minimumAmount: Yup.number()
      .required('Minimum amount is required')
      .min(0, 'Minimum amount cannot be negative'),
    days: Yup.number()
      .required('Days is required')
      .min(1, 'Days must be at least 1'),
  })

  const handlePutOnSale = async (values: {
    minimumAmount: string
    days: string
  }) => {
    if (!address || !signerData) return
    console.log(values)

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
      const tx = await contract.createSaleAuction(
        id.toString(),
        parseUnits(values.minimumAmount.toString()),
        selectedToken.tokenAddress,
        values.days,
        nftaddress,
      )
      await tx.wait()
      setTransaction({
        loading: true,
        status: 'success',
      })
    } catch (error) {
      console.log('------Error On Put on Auction--------')
      console.log(error)
      setTransaction({ loading: true, status: 'error' })
    }
  }

  return (
    <div>
      <Formik
        initialValues={{ minimumAmount: '', days: '' }}
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
                <Field
                  type="number"
                  placeholder="MinimumAmount"
                  name="minimumAmount"
                />
                {touched.minimumAmount && errors.minimumAmount ? (
                  <p>{errors.minimumAmount}</p>
                ) : null}
              </div>

              <div>
                <Field type="number" name="days" placeholder="Days" />
                {touched.days && errors.days ? <p>{errors.days}</p> : null}
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

export default AuctionForm
