import { baseURL } from 'api'
import axios from 'axios'
import { Backdrop, Button, ModalHeader } from 'components'
import { useUserStore } from 'constants/storeuser'
import { ethers } from 'ethers'
import { AnimatePresence, motion } from 'framer-motion'
import { useTransactionModal } from 'hooks'
import React from 'react'
import { useParams } from 'react-router-dom'
import { MINTED_EXCHANGE, STRATEGY, WCRO } from 'utils/address'
import { useAccount, useSigner } from 'wagmi'
import TokenAbi from '../../../utils/abi/token.json'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

interface IMakeOffer {
  setOpenOffer: React.Dispatch<React.SetStateAction<boolean>>
  openOffer: boolean
  owner: string
  collectionAddress: string
}

const MakeOffer: React.FC<IMakeOffer> = ({
  setOpenOffer,
  openOffer,
  owner,
  collectionAddress,
}) => {
  const { id } = useParams()
  const { data: nonceData, fetch } = useUserStore()
  const { address } = useAccount()
  const { data: signerData, refetch } = useSigner()
  const { setTransaction } = useTransactionModal()

  const validationSchema = Yup.object({
    price: Yup.number()
      .positive('Price must be greater than zero')
      .required('Price is required'),
    expiredate: Yup.number()
      .positive('Expire Date must be greater than zero')
      .required('Expire Date is required'),
  })

  const handleOffer = async (values: any) => {
    setOpenOffer(false)
    if (!address || !signerData) return
    try {
      setTransaction({ loading: true, status: 'pending' })

      const erc20Contract = new ethers.Contract(
        WCRO,
        TokenAbi,
        signerData as any,
      )
      const allowance = Number(
        (await erc20Contract.allowance(address, MINTED_EXCHANGE)).toString(),
      )
      if (allowance <= 0) {
        const tx = await erc20Contract.approve(
          MINTED_EXCHANGE,
          ethers.constants.MaxUint256,
        )
        await tx.wait()
      }

      const domain = {
        name: 'MintedExchange',
        version: '1',
        chainId: '5001',
        verifyingContract: MINTED_EXCHANGE,
      }

      const EIP712Domain = [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
      ]

      const permit = {
        isOrderAsk: false,
        signer: nonceData.user,
        collection: collectionAddress,
        price: ethers.utils.parseEther(`${values.price}`).toString(),
        tokenId: id,
        amount: 1,
        strategy: STRATEGY,
        currency: WCRO,
        nonce: nonceData.nonce,
        startTime: Math.round(Date.now() / 1000),
        endTime: Math.round((Date.now() + 86400000) / 1000),
        minPercentageToAsk: 8500,
        params: '0x',
      }

      const Permit = [
        { name: 'isOrderAsk', type: 'bool' },
        { name: 'signer', type: 'address' },
        { name: 'collection', type: 'address' },
        { name: 'price', type: 'uint256' },
        { name: 'tokenId', type: 'uint256' },
        { name: 'amount', type: 'uint256' },
        { name: 'strategy', type: 'address' },
        { name: 'currency', type: 'address' },
        { name: 'nonce', type: 'uint256' },
        { name: 'startTime', type: 'uint256' },
        { name: 'endTime', type: 'uint256' },
        { name: 'minPercentageToAsk', type: 'uint256' },
        { name: 'params', type: 'string' },
      ]

      const splitSig = (sig: string) => {
        const pureSig = sig.replace('0x', '')

        const _r = Buffer.from(pureSig.substring(0, 64), 'hex')
        const _s = Buffer.from(pureSig.substring(64, 128), 'hex')
        const _v = Buffer.from(
          parseInt(pureSig.substring(128, 130), 16).toString(),
        )

        return { _r, _s, _v }
      }

      let sign
      let r
      let s
      let v

      const msgParams = {
        types: {
          EIP712Domain,
          Permit,
        },
        primaryType: 'Permit',
        domain,
        message: permit,
      }

      const ethereum = window.ethereum as any

      sign = await ethereum.request({
        method: 'eth_signTypedData_v4',
        params: [address, JSON.stringify(msgParams)],
      })
      const { _r, _s, _v } = splitSig(sign)
      r = `0x${_r.toString('hex')}`
      s = `0x${_s.toString('hex')}`
      v = _v.toString()

      console.log(r)
      console.log(s)
      console.log(v)

      console.log(nonceData)

      console.log('set')
      const data = await axios.patch(`${baseURL}/marketplace/offer/${id}`, {
        userAddress: address,
        offers: {
          isOrderAsk: false,
          signer: address,
          collection: collectionAddress,
          price: ethers.utils.parseEther(`${values.price}`).toString(),
          tokenId: id,
          amount: 1,
          strategy: STRATEGY,
          currency: WCRO,
          nonce: nonceData.nonce,
          startTime: Math.round(Date.now() / 1000),
          endTime: Math.round(
            Date.now() + Number(values.expiredate) * 24 * 60 * 60 * 1000,
          ),
          minPercentageToAsk: 8500,
          params: '0x',
        },
      })
      console.log(data)
      fetch(address)
      refetch()
      setTransaction({ loading: true, status: 'success' })
    } catch (error) {
      setOpenOffer(false)
      console.log(error)
      const Error = Array(error).map((f: any) => f.reason)
      const message = Error.toString().split(':')

      setTransaction({
        loading: true,
        status: 'error',
        message: `${message[2]}  `,
      })
    }
  }
  return (
    <div>
      <Backdrop handleClose={() => setOpenOffer(false)} isOpen={openOffer}>
        <AnimatePresence exitBeforeEnter>
          {openOffer && (
            <motion.div
              className={'modal wallet_modal'}
              onClick={(e) => e.stopPropagation()}
              animate="animate"
              initial="initial"
              exit="exit"
            >
              <div className="wallet_modal-content">
                <ModalHeader
                  title="Put On Sale"
                  handleClose={() => setOpenOffer(false)}
                />
                {address?.toLowerCase() !== owner.toLowerCase() && (
                  <>
                    <Formik
                      initialValues={{ price: '', expiredate: '' }}
                      onSubmit={handleOffer}
                      validationSchema={validationSchema}
                    >
                      {({ errors, touched }) => (
                        <Form>
                          <div className="fixed-sale-form">
                            <div style={{ paddingBottom: '20px' }}>
                              <Field
                                type="number"
                                placeholder="Price"
                                name="price"
                              />
                              {touched.price && errors.price ? (
                                <p>{errors.price}</p>
                              ) : null}
                            </div>
                            <div style={{ paddingBottom: '20px' }}>
                              <Field
                                type="number"
                                placeholder="Expire Date"
                                name="expiredate"
                              />
                              {touched.expiredate && errors.expiredate ? (
                                <p>{errors.expiredate}</p>
                              ) : null}
                            </div>

                            <Button
                              variant="ternary"
                              type="submit"
                              style={{ margin: 'auto' }}
                            >
                              Make Offer
                            </Button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Backdrop>
    </div>
  )
}

export default MakeOffer
