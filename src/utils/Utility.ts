import { BigNumber, Contract, ethers } from 'ethers'

export const getInfo = async (
  array: BigNumber[],
  contract: Contract,
  signerData: any,
) => {
  const ref = new Array(array.length)
  for (let i = 0; i < array.length; i++) {
    const address = await contract.connect(signerData).ownerOf(array[i])
    const details = await contract.tokenURI(i)
    ref[i] = {
      Id: i.toString(),
      owner: address,
      nftAddress: contract.address,
      details: details,
    }
  }

  return ref
}

export const getInfoMarketplace = async (
  array: BigNumber[],
  contract: Contract,
  signerData: any,
) => {
  const ref = new Array(array.length)
  for (let i = 0; i < array.length; i++) {
    const address = await contract.ownerOf(array[i])
    const details = await contract.tokenURI(i)
    ref[i] = {
      Id: i.toString(),
      owner: address,
      nftAddress: contract.address,
      details: details,
    }
  }

  return ref
}
