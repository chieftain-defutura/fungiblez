import { baseURL } from 'api'
import axios from 'axios'
import create from 'zustand'

interface IUser {
  data: {
    user: string
    nonce: number
  }
  fetch: (address: string) => Promise<void>
  // setUser: (newUser: string) => void
  // setNonce: (newNonce: number) => void
}

export const useUserStore = create<IUser>((set) => ({
  data: {
    user: '',
    nonce: 0,
  },
  fetch: async (address: string) => {
    try {
      await axios
        .post(`${baseURL}/users/create`, {
          userAddress: address,
        })
        .then(({ data }) =>
          set({ data: { nonce: data.nonce, user: data.userAddress } }),
        )
    } catch (error) {
      console.log(error)
    }
  },
}))
