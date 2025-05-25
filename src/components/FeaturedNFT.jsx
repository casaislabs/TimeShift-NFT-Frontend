import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { DYNAMIC_NFT_ADDRESS, DYNAMIC_NFT_ABI } from '../contract'

function decodeSVG(dataUri) {
  if (!dataUri?.startsWith('data:image/svg+xml;base64,')) return ''
  const base64 = dataUri.replace('data:image/svg+xml;base64,', '')
  return atob(base64)
}

export function FeaturedNFT({ nft, provider }) {
  const [dynamicSVG, setDynamicSVG] = useState(nft ? decodeSVG(nft.image) : '')

  useEffect(() => {
    if (!nft || !provider) return
    let cancelled = false
    let interval

    async function fetchSVG() {
      try {
        const contract = new ethers.Contract(DYNAMIC_NFT_ADDRESS, DYNAMIC_NFT_ABI, provider)
        const tokenURI = await contract.tokenURI(nft.tokenId)
        const json = JSON.parse(atob(tokenURI.split(',')[1]))
        if (!cancelled) setDynamicSVG(decodeSVG(json.image))
      } catch {
        // ignore
      }
    }

    fetchSVG()
    interval = setInterval(fetchSVG, 3000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [nft, provider])

  if (!nft) return null
  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative bg-gradient-to-br from-blue-50 via-purple-100 to-blue-200 rounded-3xl shadow-2xl p-8 max-w-xl w-full flex flex-col items-center border-4 border-blue-400 animate-fade-in">
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-400 text-white text-sm px-8 py-2 rounded-full shadow-lg font-black tracking-widest uppercase z-10 drop-shadow-xl animate-bounce">
          🌟 Featured NFT 🌟
        </span>
        <div className="w-52 h-52 md:w-64 md:h-64 overflow-hidden flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-200 via-purple-200 to-blue-100 shadow-lg border-2 border-blue-300 mb-7 mt-4 animate-pop">
          <div
            dangerouslySetInnerHTML={{ __html: dynamicSVG }}
            className="w-full h-full transition-transform duration-500 hover:scale-105"
          />
        </div>
        <div className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-700 to-blue-500 text-center drop-shadow-lg mb-2 animate-fade-in-slow">
          {nft.name || `TimeShift NFT #${nft.tokenId}`}
        </div>
        <div className="text-lg text-blue-900/80 mb-1 font-semibold tracking-wide animate-fade-in">
          Token ID: <span className="font-black">{nft.tokenId}</span>
        </div>
        <div className="absolute inset-0 rounded-3xl pointer-events-none border-8 border-blue-300/30 animate-glow" />
      </div>
      <style>
        {`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(24px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .animate-fade-in { animation: fade-in 0.8s cubic-bezier(.4,0,.2,1) both; }
          @keyframes fade-in-slow {
            from { opacity: 0; transform: translateY(40px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .animate-fade-in-slow { animation: fade-in-slow 1.2s cubic-bezier(.4,0,.2,1) both; }
          @keyframes pop {
            0% { transform: scale(0.95);}
            60% { transform: scale(1.05);}
            100% { transform: scale(1);}
          }
          .animate-pop { animation: pop 0.7s cubic-bezier(.4,0,.2,1) both; }
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 32px 8px #a5b4fc44, 0 0 0 0 #c4b5fd33; }
            50% { box-shadow: 0 0 48px 16px #a5b4fc88, 0 0 0 0 #c4b5fd66; }
          }
          .animate-glow { animation: glow 2.5s ease-in-out infinite; }
        `}
      </style>
    </div>
  )
}