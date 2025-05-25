import { useState } from 'react'
import { ethers } from 'ethers'
import { DYNAMIC_NFT_ADDRESS, DYNAMIC_NFT_ABI } from '../contract'

export function MintButton({ provider, disabled, onMinted }) {
  const [loading, setLoading] = useState(false)
  const [txHash, setTxHash] = useState(null)
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState(null)

  const handleMint = async () => {
    setLoading(true)
    setError(null)
    setTxHash(null)
    setConfirmed(false)
    try {
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(DYNAMIC_NFT_ADDRESS, DYNAMIC_NFT_ABI, signer)
      const tx = await contract.mint()
      setTxHash(tx.hash)
      await tx.wait()
      setConfirmed(true)
      if (onMinted) onMinted() // Notifica al padre
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  const handleClose = () => {
    setTxHash(null)
    setConfirmed(false)
    setError(null)
  }

  return (
    <div className="flex flex-col items-center">
      <button
        className="px-6 py-2 rounded bg-white text-blue-600 font-semibold shadow hover:bg-blue-100 transition disabled:opacity-50"
        onClick={handleMint}
        disabled={loading || disabled}
      >
        {loading ? 'Minting...' : 'Mint NFT'}
      </button>
      {txHash && (
        <div className="mt-3 flex flex-col items-center bg-black/60 rounded p-3">
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-300 underline"
          >
            View on Etherscan
          </a>
          {confirmed && (
            <div className="mt-2 text-green-300 text-xs font-semibold">
              Transaction confirmed!
            </div>
          )}
          {!confirmed && (
            <div className="mt-2 text-yellow-200 text-xs">
              Waiting for confirmation...
            </div>
          )}
          <button
            className="mt-2 text-xs text-white bg-blue-600 rounded px-2 py-1 hover:bg-blue-700"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      )}
      {error && (
        <div className="mt-3 flex flex-col items-center bg-red-700/80 rounded p-3">
          <div className="text-xs text-white">{error}</div>
          <button
            className="mt-2 text-xs text-white bg-red-500 rounded px-2 py-1 hover:bg-red-600"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      )}
    </div>
  )
}