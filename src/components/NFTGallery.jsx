import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { DYNAMIC_NFT_ADDRESS, DYNAMIC_NFT_ABI } from '../contract'

function decodeSVG(dataUri) {
  if (!dataUri?.startsWith('data:image/svg+xml;base64,')) return ''
  const base64 = dataUri.replace('data:image/svg+xml;base64,', '')
  return atob(base64)
}

export function NFTGallery({ nfts, onSelect, selectedId, provider }) {
  const [dynamicNFTs, setDynamicNFTs] = useState(nfts)
  const [showAll, setShowAll] = useState(false)

  // Recarga los metadatos/SVGs cada 3 segundos
  useEffect(() => {
    let cancelled = false
    let interval

    async function refreshNFTs() {
      if (!provider || !nfts || nfts.length === 0) return
      try {
        const contract = new ethers.Contract(DYNAMIC_NFT_ADDRESS, DYNAMIC_NFT_ABI, provider)
        const updated = await Promise.all(
          nfts.map(async (nft) => {
            try {
              const tokenURI = await contract.tokenURI(nft.tokenId)
              const json = JSON.parse(atob(tokenURI.split(',')[1]))
              return { ...nft, ...json }
            } catch {
              return nft
            }
          })
        )
        if (!cancelled) setDynamicNFTs(updated)
      } catch {
        // ignore
      }
    }

    refreshNFTs()
    interval = setInterval(refreshNFTs, 3000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [provider, nfts])

  if (!dynamicNFTs || dynamicNFTs.length === 0) return null

  const visibleNFTs = showAll ? dynamicNFTs : dynamicNFTs.slice(0, 3)

  return (
    <div className="flex flex-col items-center mb-24">
      <div className="flex flex-wrap gap-10 justify-center mt-10">
        {visibleNFTs.map(nft => (
          <button
            key={nft.tokenId}
            type="button"
            aria-label={`Select NFT ${nft.tokenId}`}
            className={`
              group relative bg-gradient-to-br from-blue-100 via-purple-100 to-blue-200
              rounded-[2rem] shadow-2xl p-6 w-56 flex flex-col items-center border-4 transition-all duration-300 outline-none
              ${selectedId === nft.tokenId
                ? 'border-blue-600 ring-4 ring-blue-300 scale-105 shadow-blue-200'
                : 'border-transparent hover:border-blue-400 hover:scale-105 hover:ring-2 hover:ring-blue-200'
              }
              focus:ring-4 focus:ring-blue-400
              animate-nftcard
            `}
            onClick={() => onSelect(nft.tokenId)}
            style={{
              boxShadow:
                selectedId === nft.tokenId
                  ? '0 8px 32px 0 rgba(59,130,246,0.18)'
                  : '0 2px 12px 0 rgba(80,80,160,0.10)'
            }}
          >
            <div className="w-36 h-36 overflow-hidden flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-200 via-purple-100 to-blue-50 shadow-inner mb-3 border-2 border-blue-200 group-hover:scale-110 transition-transform duration-300 animate-pop">
              <div
                dangerouslySetInnerHTML={{ __html: decodeSVG(nft.image) }}
                className="w-full h-full"
              />
            </div>
            <div className="mt-2 text-lg text-blue-800 font-extrabold text-center truncate w-full drop-shadow animate-fade-in-slow">{nft.name || `NFT #${nft.tokenId}`}</div>
            <div className="text-xs text-blue-500 mb-1 font-semibold tracking-wide animate-fade-in">ID: {nft.tokenId}</div>
            {selectedId === nft.tokenId && (
              <span className="absolute top-3 right-3 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-400 text-white text-[11px] px-3 py-1 rounded-full shadow font-bold animate-bounce z-10 border-2 border-white">
                Featured
              </span>
            )}
            <div className="absolute inset-0 rounded-[2rem] pointer-events-none border-8 border-blue-300/20 group-hover:animate-glow" />
          </button>
        ))}
      </div>
      {dynamicNFTs.length > 3 && (
        <button
          className="mt-10 px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-400 text-white font-bold shadow-lg hover:bg-blue-700 transition text-lg animate-fade-in"
          onClick={() => setShowAll(v => !v)}
        >
          {showAll ? 'Show Less' : 'Show More'}
        </button>
      )}
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
            60% { transform: scale(1.08);}
            100% { transform: scale(1);}
          }
          .animate-pop { animation: pop 0.7s cubic-bezier(.4,0,.2,1) both; }
          @keyframes nftcard {
            from { opacity: 0; transform: scale(0.95);}
            to { opacity: 1; transform: scale(1);}
          }
          .animate-nftcard { animation: nftcard 0.7s cubic-bezier(.4,0,.2,1) both; }
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 32px 8px #a5b4fc44, 0 0 0 0 #c4b5fd33; }
            50% { box-shadow: 0 0 48px 16px #a5b4fc88, 0 0 0 0 #c4b5fd66; }
          }
          .animate-glow { animation: glow 2.5s ease-in-out infinite; }
          .group:hover .group-hover\\:animate-glow { animation: glow 2.5s ease-in-out infinite; }
        `}
      </style>
    </div>
  )
}