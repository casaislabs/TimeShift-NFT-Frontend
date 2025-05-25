import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { DYNAMIC_NFT_ADDRESS, DYNAMIC_NFT_ABI } from '../contract'

export function useWalletNFTs(provider, address, refresh = 0) {
  const [nfts, setNfts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function fetchNFTs() {
      setLoading(true)
      setError(null)
      setNfts([])
      try {
        const contract = new ethers.Contract(DYNAMIC_NFT_ADDRESS, DYNAMIC_NFT_ABI, provider)
        const total = await contract.tokenCounter()
        const owned = []
        for (let i = 0; i < total; i++) {
          try {
            const owner = await contract.ownerOf(i)
            if (owner.toLowerCase() === address.toLowerCase()) {
              const tokenURI = await contract.tokenURI(i)
              const json = JSON.parse(atob(tokenURI.split(',')[1]))
              owned.push({ tokenId: i, ...json })
            }
          } catch {}
        }
        if (!cancelled) setNfts(owned)
      } catch (err) {
        if (!cancelled) setError('Error fetching NFTs: ' + err.message)
      }
      if (!cancelled) setLoading(false)
    }
    if (provider && address) fetchNFTs()
    return () => { cancelled = true }
  }, [provider, address, refresh])

  return { nfts, loading, error }
}