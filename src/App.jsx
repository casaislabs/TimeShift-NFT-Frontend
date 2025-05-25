import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useConnectorClient } from 'wagmi'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { MintButton } from './components/MintButton'
import { useWalletNFTs } from './hooks/useWalletNFTs'
import { FeaturedNFT } from './components/FeaturedNFT'
import { NFTGallery } from './components/NFTGallery'

function App() {
  const { address, isConnected } = useAccount()
  const { data: client } = useConnectorClient()
  const [balance, setBalance] = useState(null)
  const [provider, setProvider] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [refreshNFTs, setRefreshNFTs] = useState(0)

  useEffect(() => {
    if (window.ethereum && isConnected) {
      setProvider(new ethers.BrowserProvider(window.ethereum))
    } else {
      setProvider(null)
    }
  }, [isConnected])

  useEffect(() => {
    async function fetchBalance() {
      if (provider && address) {
        const bal = await provider.getBalance(address)
        setBalance(ethers.formatEther(bal))
      }
    }
    fetchBalance()
  }, [provider, address])

  const { nfts, loading: nftsLoading, error: nftsError } = useWalletNFTs(provider, address, refreshNFTs)

  useEffect(() => {
    if (nfts && nfts.length > 0) {
      const maxTokenId = Math.max(...nfts.map(nft => nft.tokenId))
      setSelectedId(maxTokenId)
    }
  }, [nfts])

  const featuredNFT = nfts.find(nft => nft.tokenId === selectedId) || nfts[0]
  const handleMinted = () => setRefreshNFTs(r => r + 1)

  // 1. Animaciones y microinteracciones: spinner y hover/focus
  function Spinner() {
    return (
      <div className="flex items-center justify-center mt-10">
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin-glow" aria-label="Loading" />
      </div>
    )
  }

  // 3. Glassmorphism y fondo animado extra
  // 4. Accesibilidad: aria-labels, roles, focus-visible, alt texts
  // 5. Responsive: paddings, scroll, fuentes
  // 6. Logo animado y badge en el NFT destacado

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 relative overflow-x-hidden">
      {/* Fondo animado de partículas */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <canvas id="particles-bg" className="w-full h-full" style={{ position: 'absolute', inset: 0, zIndex: 0 }} aria-hidden="true"></canvas>
      </div>
      {/* Logo animado */}
      <div className="absolute top-6 left-8 z-30 flex items-center gap-3 animate-logo-pop">
        <img src="/timeshift.svg" alt="TimeShift Logo" className="w-14 h-14 drop-shadow-xl animate-spin-slow" />
        <span className="text-3xl font-black text-white bg-gradient-to-r from-blue-400 via-purple-300 to-blue-200 bg-clip-text text-transparent drop-shadow-lg hidden md:inline animate-titlepop">TimeShift</span>
      </div>
      <div className="absolute top-6 right-8 z-20 animate-fade-in">
        <ConnectButton label="Conectar Wallet" />
      </div>
      {/* Decorative blurred background shapes */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-blue-400 via-purple-400 to-indigo-500 opacity-30 rounded-full blur-3xl pointer-events-none animate-bgfloat" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tr from-purple-400 via-blue-400 to-indigo-400 opacity-20 rounded-full blur-2xl pointer-events-none animate-bgfloat2" />
      <div className="flex flex-col items-center justify-center min-h-screen px-2 relative z-10">
        <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-200 to-blue-100 mb-12 drop-shadow-2xl tracking-tight text-center animate-titlepop focus-visible:outline-none" tabIndex={0}>
          TimeShift-NFT
        </h1>
        {!isConnected ? (
          <p className="text-2xl text-white/90 bg-black/40 px-10 py-8 rounded-3xl shadow-2xl mb-12 animate-fade-in-slow border-2 border-blue-400/30" role="alert">
            Connect your wallet to proceed
          </p>
        ) : (
          <>
            {!nftsLoading && nfts.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-20 animate-fade-in-slow">
                <div className="text-white text-2xl font-bold mb-8 bg-gradient-to-br from-blue-700/80 via-purple-700/80 to-blue-900/80 px-12 py-8 rounded-3xl shadow-2xl text-center max-w-xl border-2 border-blue-400/40 animate-pop" tabIndex={0} aria-live="polite">
                  You don't have any NFTs yet.<br />
                  <span className="text-blue-200 font-extrabold text-3xl block mt-2 animate-glowtext">Mint your first NFT to get started!</span>
                </div>
                <div className="bg-gradient-to-br from-white/90 via-blue-100/80 to-purple-100/80 rounded-3xl shadow-2xl p-10 flex flex-col items-center border-4 border-blue-200/40 animate-pop glassmorphism">
                  <MintButton provider={provider} onMinted={handleMinted} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center justify-center gap-14 w-full max-w-5xl mb-14 animate-fade-in">
                <div className="w-full md:w-1/3 flex justify-center">
                  <div className="bg-gradient-to-br from-white/90 via-blue-100/80 to-purple-100/80 rounded-3xl shadow-2xl p-8 flex flex-col items-center border-4 border-blue-200/40 animate-pop glassmorphism">
                    <MintButton provider={provider} onMinted={handleMinted} />
                  </div>
                </div>
                <div className="w-full md:w-2/3 flex justify-center">
                  <FeaturedNFT nft={featuredNFT} provider={provider} />
                </div>
              </div>
            )}
            {nftsLoading && (
              <Spinner />
            )}
            {nftsError && (
              <div className="text-red-300 mt-10 text-lg font-semibold animate-shake" role="alert">{nftsError}</div>
            )}
            {!nftsLoading && nfts.length > 0 && (
              <div className="w-full max-w-6xl animate-fade-in-slow">
                <h2 className="text-white text-2xl font-bold mb-6 text-center tracking-wide drop-shadow-lg animate-titlepop" tabIndex={0}>
                  Your NFTs
                </h2>
                <NFTGallery
                  nfts={nfts}
                  onSelect={setSelectedId}
                  selectedId={featuredNFT?.tokenId}
                  provider={provider}
                />
              </div>
            )}
          </>
        )}
      </div>
      {/* Animations, glassmorphism, logo, spinner, accessibility */}
      <style>
        {`
          /* Glassmorphism effect */
          .glassmorphism {
            background: rgba(255,255,255,0.18);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1.5px solid rgba(255,255,255,0.18);
          }
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(32px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .animate-fade-in { animation: fade-in 0.8s cubic-bezier(.4,0,.2,1) both; }
          @keyframes fade-in-slow {
            from { opacity: 0; transform: translateY(64px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .animate-fade-in-slow { animation: fade-in-slow 1.2s cubic-bezier(.4,0,.2,1) both; }
          @keyframes pop {
            0% { transform: scale(0.95);}
            60% { transform: scale(1.08);}
            100% { transform: scale(1);}
          }
          .animate-pop { animation: pop 0.7s cubic-bezier(.4,0,.2,1) both; }
          @keyframes titlepop {
            0% { opacity: 0; transform: scale(0.92) translateY(-40px);}
            60% { opacity: 1; transform: scale(1.04) translateY(0);}
            100% { opacity: 1; transform: scale(1) translateY(0);}
          }
          .animate-titlepop { animation: titlepop 1.1s cubic-bezier(.4,0,.2,1) both; }
          @keyframes bgfloat {
            0%, 100% { transform: translateY(0) scale(1);}
            50% { transform: translateY(40px) scale(1.05);}
          }
          .animate-bgfloat { animation: bgfloat 8s ease-in-out infinite; }
          @keyframes bgfloat2 {
            0%, 100% { transform: translateY(0) scale(1);}
            50% { transform: translateY(-30px) scale(1.07);}
          }
          .animate-bgfloat2 { animation: bgfloat2 10s ease-in-out infinite; }
          @keyframes glowtext {
            0%, 100% { text-shadow: 0 0 16px #a5b4fc, 0 0 32px #c4b5fd; }
            50% { text-shadow: 0 0 32px #818cf8, 0 0 64px #a5b4fc; }
          }
          .animate-glowtext { animation: glowtext 2.5s ease-in-out infinite; }
          @keyframes shake {
            0%, 100% { transform: translateX(0);}
            20%, 60% { transform: translateX(-8px);}
            40%, 80% { transform: translateX(8px);}
          }
          .animate-shake { animation: shake 0.5s cubic-bezier(.4,0,.2,1) both; }
          /* Logo pop and spin */
          @keyframes logo-pop {
            0% { opacity: 0; transform: scale(0.7) rotate(-10deg);}
            60% { opacity: 1; transform: scale(1.08) rotate(8deg);}
            100% { opacity: 1; transform: scale(1) rotate(0);}
          }
          .animate-logo-pop { animation: logo-pop 1.2s cubic-bezier(.4,0,.2,1) both; }
          @keyframes spin-slow {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
          .animate-spin-slow { animation: spin-slow 8s linear infinite; }
          /* Spinner */
          @keyframes spin-glow {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
          .animate-spin-glow {
            animation: spin-glow 1.1s linear infinite;
            box-shadow: 0 0 16px 4px #818cf8, 0 0 32px 8px #a5b4fc;
          }
        `}
      </style>
      {/* Fondo de partículas animadas */}
      <script dangerouslySetInnerHTML={{
        __html: `
        (() => {
          const canvas = document.getElementById('particles-bg');
          if (!canvas) return;
          let ctx = canvas.getContext('2d');
          let w, h, particles = [];
          function resize() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
          }
          window.addEventListener('resize', resize);
          resize();
          function Particle() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.radius = 1 + Math.random() * 2.5;
            this.alpha = 0.15 + Math.random() * 0.15;
            this.dx = (Math.random() - 0.5) * 0.3;
            this.dy = (Math.random() - 0.5) * 0.3;
            this.color = ['#818cf8', '#a5b4fc', '#c4b5fd', '#f3e8ff'][Math.floor(Math.random()*4)];
          }
          function createParticles() {
            particles = [];
            for (let i = 0; i < 70; i++) particles.push(new Particle());
          }
          function animate() {
            ctx.clearRect(0, 0, w, h);
            for (let p of particles) {
              ctx.globalAlpha = p.alpha;
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
              ctx.fillStyle = p.color;
              ctx.shadowColor = p.color;
              ctx.shadowBlur = 12;
              ctx.fill();
              p.x += p.dx;
              p.y += p.dy;
              if (p.x < 0 || p.x > w) p.dx *= -1;
              if (p.y < 0 || p.y > h) p.dy *= -1;
            }
            requestAnimationFrame(animate);
          }
          createParticles();
          animate();
        })();
        `
      }} />
    </div>
  )
}

export default App