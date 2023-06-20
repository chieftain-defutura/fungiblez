export enum IContractType {
  ERC721 = 'ERC721',
  ERC1155 = 'ERC1155',
}

export enum ISaleType {
  AUCTION = 'AUCTION',
  FIXED_SALE = 'FIXED_SALE',
}

export enum IMarketplaceStatus {
  LIVE = 'LIVE',
  FINISHED = 'FINISHED',
}

export type IAttributes = {
  trait_type: string
  value: string
}

export interface ITokenUri {
  name: string
  description: string
  external_link: string
  image: string
  attributes: IAttributes[]
}

export interface IUserNfts {
  token_address: string
  token_id: string
  contract_type: string
  owner_of: string
  block_number?: string
  block_number_minted?: string
  token_uri?: string
  metadata?: ITokenUri
  synced_at?: string
  amount?: string
  name: string
  symbol: string
}

export interface ICollectionData {
  contract_address: string
  total: number
  owners: string
  volcro: string
  volusdc: string
  name: string
  crofloor: number
  img: string
  usdcfloor: number
  isVerified: boolean
}

export interface IAllCollection {
  latestCollection?: ICollectionData[]
  topCollection?: ICollectionData[]
}

export interface ICreateForm {
  name: string
  image: string
  description: string
  // external_link: string
  // royaltyFee: string
  // totalSupply: string
  // isMultiple: boolean
  // attributes: IAttributes[]
}

export interface IImageFileProps {
  file: File
  url: string
}

export interface IMarketplace {
  userAddress: string
  status: string
  tokenId: string
  collectionAddress: string
  ask: {
    isOrderAsk: boolean
    signer: string
    collection: string
    price: number
    tokenId: number
    amount: number
    strategy: string
    currency: string
    nonce: number
    startTime: number
    endTime: number
    minPercentageToAsk: number
    params: string
  }
  isfinished?: boolean
  offers: [
    {
      isOrderAsk: boolean
      signer: string
      collection: string
      price: number
      tokenId: number
      amount: number
      strategy: string
      currency: string
      nonce: number
      startTime: number
      endTime: number
      minPercentageToAsk: number
      params: string
    },
  ]
  orderHash: {
    r: string
    s: string
    v: string
  }
}

//@typescript-eslint/no-unused-expressions
