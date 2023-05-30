import React, { ChangeEvent, useState } from 'react'
import { Web3Storage } from 'web3.storage'
import './Marketplace.scss'
import Main from './Main'
import { FilterLayout } from 'components'
import MarketplaceCollection from './MarketplaceCollection'
import { useAccount, useSigner } from 'wagmi'

const collectionFilters = [
  { label: 'Price: Low to high', value: 'asc' },
  { label: 'Price: High to low', value: 'desc' },
]

const Marketplace: React.FC<{}> = () => {
  const { address } = useAccount()
  const { data: signerData } = useSigner()
  const [selectedFilter, setSelectedfilter] = useState<string | null>(null)
  const [searchInput, setSearchInput] = useState('')
  const [openFile, setOpenFile] = useState<File | null>(null)
  const [image, setImage] = useState('')
  function makeFileObjects() {
    // You can create File objects from a Blob of binary data
    // see: https://developer.mozilla.org/en-US/docs/Web/API/Blob
    // Here we're just storing a JSON object, but you can store images,
    // audio, or whatever you want!
    const obj = { hello: 'world' }
    const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' })

    const files = [new File([blob], 'hello.json')]
    return files
  }

  const createData = async () => {
    if (!address || !signerData) return
    if (!openFile) {
      try {
        const token = process.env.REACT_APP_WEB3STORAGE_TOKEN

        const storage = new Web3Storage({ token: token as string })

        const file = makeFileObjects()
        // const imageFile = openFile

        const cid = await storage.put(file)
        // console.log('stored files with cid:', cid)

        const res = await storage.get(cid)

        if (!res) return

        console.log(res)
        const files = await res.files()
        for (const file of files) {
          console.log(`${file.cid} -- -- ${file.size}`)
          setImage(file.cid)
        }
      } catch (error) {
        console.log('Error sending File to IPFS:')
        console.log(error)
      }
    }
  }

  return (
    <div className="Marketplace">
      <div className="mx pad">
        <FilterLayout
          dropdownFilter={collectionFilters}
          handleChangeInput={(val) => setSearchInput(val)}
          handleChangeDropdown={(val) => setSelectedfilter(val)}
          renderFilterBox={<MarketplaceCollection />}
          renderMain={
            <Main selectedFilter={selectedFilter} searchInput={searchInput} />
          }
          onMountOpenFilter={true}
        />
      </div>

      <input
        type="file"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          if (!e.target.files || !e.target.files.length) return
          setOpenFile(e.target.files[0])
        }}
      />

      <button onClick={() => createData()}>create</button>
      {image && JSON.stringify(image, null, 2)}
    </div>
  )
}

export default Marketplace
