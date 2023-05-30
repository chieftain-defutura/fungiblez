import React, { ChangeEvent, useState } from 'react'
import { Formik, Form as FormikForm, FieldArray } from 'formik'
import nftAbi from '../../../utils/abi/nft.json'
import { Button, TextField } from 'components'
import {
  validateMultiCollectionSchema,
  validateSingleCollectionSchema,
} from '../../../helpers/ValidationSchema'
import { useTransactionModal } from 'hooks'
import { useAccount, useSigner } from 'wagmi'
import { ethers } from 'ethers'
import { NFT1Address, NFT2Address } from 'utils/address'
import { ICreateForm } from 'constants/types'

interface IForm {
  initialState: any
  isMultiple: boolean
  handleSubmit: (values: any, actions: any) => Promise<void>
}

const Form: React.FC<IForm> = ({ initialState, isMultiple, handleSubmit }) => {
  const { address } = useAccount()
  const { data: signerData } = useSigner()
  const { setTransaction } = useTransactionModal()

  // const handleMint = async (nftAddress: string) => {
  //   try {
  //     if (!signerData || !address) return

  //     setTransaction({ loading: true, status: 'pending' })

  //     const mintContract = new ethers.Contract(
  //       nftAddress,
  //       nftAbi,
  //       signerData as any,
  //     )
  //     const tx = await mintContract.createNFT(address, '', '')
  //     await tx.wait()
  //     setTransaction({ loading: true, status: 'success' })
  //   } catch (error: any) {
  //     console.log(error.reason)
  //     setTransaction({ loading: true, status: 'error', message: error.reason })
  //   }
  // }

  return (
    <Formik
      initialValues={initialState}
      validationSchema={
        isMultiple
          ? validateMultiCollectionSchema
          : validateSingleCollectionSchema
      }
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <FormikForm>
          <div className="form_fields">
            <TextField name="name" label="Name" placeholder="Item Name" />

            <TextField
              name="description"
              label="Description"
              as="textarea"
              rows="5"
              placeholder="Provide a detailed discription of your item."
            />
          </div>
          <div className="flex-center">
            <Button disabled={isSubmitting} type="submit" variant="secondary">
              Create
            </Button>
            {/* <div className="formcard_container">
              <Button
                type="submit"
                disabled={isSubmitting}
                onClick={() => handleMint(NFT1Address)}
              >
                mint nft 1
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                onClick={() => handleMint(NFT2Address)}
              >
                mint nft 2
              </Button>
            </div> */}
          </div>
        </FormikForm>
      )}
    </Formik>
  )
}

export default Form