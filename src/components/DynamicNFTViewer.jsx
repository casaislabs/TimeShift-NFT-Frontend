import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { DYNAMIC_NFT_ADDRESS, DYNAMIC_NFT_ABI } from '../contract'

export function DynamicNFTViewer({ provider, address }) {
  const [tokenId, setTokenId] = useState(null)
  const [svg, setSvg] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Busca el tokenId del usuario recorriendo todos los tokenId existentes
  useEffect(() => {
    let cancelled = false
    async function fetchNFT() {
      setLoading(true)
      setError(null)
      setTokenId(null)
      try {
        const contract = new ethers.Contract(DYNAMIC_NFT_ADDRESS, DYNAMIC_NFT_ABI, provider)
        const total = await contract.tokenCounter()
        let found = false
        for (let i = 0; i < total; i++) {
          try {
            const owner = await contract.ownerOf(i)
            if (owner.toLowerCase() === address.toLowerCase()) {
              if (!cancelled) setTokenId(i)
              found = true
              break
            }
          } catch {}
        }
        if (!found && !cancelled) setError('No NFT found for this address.')
      } catch (err) {
        if (!cancelled) setError('Error fetching NFT: ' + err.message)
      }
      if (!cancelled) setLoading(false)
    }
    if (provider && address) fetchNFT()
    return () => { cancelled = true }
  }, [provider, address])

  // Actualiza la metadata/SVG cada 3 segundos
  useEffect(() => {
    let interval
    let cancelled = false
    async function fetchSVG() {
      setError(null)
      if (provider && tokenId !== null) {
        try {
          const contract = new ethers.Contract(DYNAMIC_NFT_ADDRESS, DYNAMIC_NFT_ABI, provider)
          const tokenURI = await contract.tokenURI(tokenId)
          const json = JSON.parse(atob(tokenURI.split(',')[1]))
          if (!cancelled) setSvg(json.image)
        } catch (err) {
          if (!cancelled) setError('Error fetching SVG: ' + err.message)
        }
      }
    }
    if (tokenId !== null) {
      fetchSVG()
      interval = setInterval(fetchSVG, 3000)
    }
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [provider, tokenId])

  if (loading) return <div className="text-white mt-8">Loading NFT...</div>
  if (error) return <div className="text-red-300 mt-8">{error}</div>
  if (!svg) return null

  return (
    <div className="mt-8 flex flex-col items-center">
      <div className="bg-white rounded shadow-lg p-4">
        <div dangerouslySetInnerHTML={{ __html: svg }} />
      </div>
      <div className="text-xs text-white mt-2">Token ID: {tokenId}</div>
    </div>
  )
}