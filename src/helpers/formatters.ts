import { ethers } from 'ethers'
export const formatEther = (value: any, decimals = 18) => {
  return Number(ethers.utils.formatUnits(value.toString(), String(decimals)))
}

export const getEllipsisTxt = (str: string, n = 6) => {
  if (str) {
    return `${str.slice(0, n)}...${str.slice(str.length - n)}`
  }
  return ''
}

export const n6 = new Intl.NumberFormat('en-us', {
  style: 'decimal',
  minimumFractionDigits: 0,
  maximumFractionDigits: 6,
})

export const formatLinks = (link: string) => {
  const lowercaseString = link.toLocaleLowerCase()
  return lowercaseString.split(' ').join('-')
}
