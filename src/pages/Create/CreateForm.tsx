import React, { useState } from 'react'
import './CreateForm.scss'
import { ICreateForm, IImageFileProps } from 'constants/types'
import nftAbi from '../../utils/abi/nft.json'
import Form from './components/Form'
import { useTransactionModal } from 'hooks'
import { Button } from 'components'
import { NFT1Address, NFT2Address } from 'utils/address'
import { useAccount, useSigner } from 'wagmi'
import { ethers } from 'ethers'
import { Web3Storage } from 'web3.storage'
import ImageDropper from 'components/ImageDropper'

const initialState: ICreateForm = {
  name: '',
  image: '',
  description: '',
  // external_link: '',
  // royaltyFee: '',
  // totalSupply: '',
  // isMultiple: false,
  // attributes: [{ trait_type: '', value: '' }],
}

const CreateForm: React.FC<{}> = () => {
  const [image, setImage] = useState<IImageFileProps | null>(null)
  const [imageCID, setImageCID] = useState('')
  const [objectCID, setObjectCID] = useState('')
  const { address } = useAccount()
  const { data: signerData } = useSigner()
  const { setTransaction } = useTransactionModal()

  console.log('image:', imageCID)
  console.log('object:', objectCID)

  const handleSubmit = async (values: ICreateForm) => {
    if (!address || !signerData) return
    if (!image) return alert('upload image to mint.')
    try {
      setTransaction({ loading: true, status: 'pending' })
      const file = image.file
      if (file) {
        try {
          const token = process.env.REACT_APP_WEB3STORAGE_TOKEN

          const storage = new Web3Storage({ token: token as string })
          const imageFile = image.file
          const cid = await storage.put([imageFile])
          const res = await storage.get(cid)
          if (!res) return
          const imagefiles = await res.files()
          for (const file of imagefiles) {
            setImageCID(file.cid)
          }

          const obj = {
            name: values.name,
            description: values.description,
            image: imageCID,
          }

          console.log(obj)
          const blob = new Blob([JSON.stringify(obj)], {
            type: 'application/json',
          })
          const Objectfiles = [new File([blob], 'object.json')]
          const objectCid = await storage.put(Objectfiles)
          const objectres = await storage.get(objectCid)
          if (!objectres) return
          const files = await objectres.files()
          for (const file of files) {
            setObjectCID(file.cid)
          }
        } catch (error) {
          console.log('Error sending File to IPFS:')
          console.log(error)
        }
      }

      setTransaction({ loading: true, status: 'success' })
    } catch (error) {
      console.log(error)
      setTransaction({ loading: true, status: 'error' })
    }
  }

  const handleMint = async (nftAddress: string) => {
    if (!signerData || !address) return

    try {
      setTransaction({ loading: true, status: 'pending' })

      const mintContract = new ethers.Contract(
        nftAddress,
        nftAbi,
        signerData as any,
      )
      const tx = await mintContract.mint(address, objectCID)
      await tx.wait()
      setTransaction({ loading: true, status: 'success' })
    } catch (error: any) {
      console.log(error.reason)
      setTransaction({ loading: true, status: 'error', message: error })
    }
  }

  const renderImageContent = (
    <>
      <div className="flex mb-16">
        <h2>Create your</h2>
        <h2 className="primary ml-10 font-regular">NFTs</h2>
      </div>
      <p className="font-regular mb-8">Image, Video, Audio, or 3D Model</p>
      <p className="mb-8">
        File types supported
        <span className="font-regular">
          JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG, GLB, GLTF.
        </span>
      </p>
      <p>
        Max size: <span className="font-regular">100MB</span>
      </p>
    </>
  )

  return (
    <div className="create_form">
      <ImageDropper
        image={image}
        setImage={setImage}
        content={renderImageContent}
      />

      <Form initialState={initialState} handleSubmit={handleSubmit} />
      <div className="formcard_container">
        <Button onClick={() => handleMint(NFT1Address)}>mint nft 1</Button>
        <Button onClick={() => handleMint(NFT2Address)}>mint nft 2</Button>
      </div>
    </div>
  )
}

export default CreateForm
