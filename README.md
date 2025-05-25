# 🚀 TimeShift-NFT Frontend

A cutting-edge frontend for minting and visualizing **dynamic NFTs** on the Sepolia blockchain. Built for next-gen web3 experiences, it features seamless wallet integration, animated UI, glassmorphism, and a fully responsive design.

---

## ✨ Features

- **Wallet Connection** via [RainbowKit](https://rainbowkit.com/) (Metamask, WalletConnect, and more)
- **Dynamic NFT Minting** with real-time metadata/SVG updates
- **Interactive Gallery** with featured NFT, smooth animations, and visual effects
- **Modern UI**: glassmorphism, gradients, animated particle backgrounds
- **Accessibility** and mobile-first responsive design
- **Modular, maintainable codebase** for rapid development

---

## 🗂️ Project Structure

```text
.
├── public/
│   └── timeshift.svg         # Project logo
├── src/
│   ├── App.jsx               # Main app component
│   ├── contract.js           # Contract address & ABI
│   ├── index.css             # Global styles (TailwindCSS)
│   ├── main.jsx              # Entry point
│   ├── providers.jsx         # Context providers
│   ├── wagmiConfig.js        # Wagmi/RainbowKit config
│   ├── components/
│   │   ├── DynamicNFTViewer.jsx
│   │   ├── FeaturedNFT.jsx
│   │   ├── MintButton.jsx
│   │   └── NFTGallery.jsx
│   └── hooks/
│       └── useWalletNFTs.js  # Custom wallet/NFT hooks
├── .env                      # Environment variables
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── eslint.config.js
└── README.md
```

---

## ⚡ Quickstart

### 1. Clone & Install

```bash
git clone https://github.com/martinperezcss/TimeShift-NFT-Frontend.git
cd TimeShift-NFT-Frontend
npm install
```

### 2. Configure Environment

Create a `.env` file with your WalletConnect Project ID:

```env
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
```

### 3. Smart Contract Setup

Edit `src/contract.js`:

```js
export const DYNAMIC_NFT_ADDRESS = "0xYourContractAddress";
export const DYNAMIC_NFT_ABI = [ /* ...your contract ABI... */ ];
```
> Your contract must be ERC721-compatible and expose methods like `mint`, `tokenURI`, `ownerOf`, etc.

---

## 🖥️ Usage

1. **Start the dev server:**
    ```bash
    npm run dev
    ```
2. **Open** [http://localhost:5173](http://localhost:5173) in your browser.
3. **Connect your wallet** and mint your first dynamic NFT!

---

## 🎨 Customization

- **Logo:** Replace `public/timeshift.svg` with your own.
- **Styles:** Edit `src/index.css` or tweak Tailwind classes in components.
- **Contract:** Ensure your smart contract matches the frontend's expected interface.

---

## 🌌 Visual Experience

- **Glassmorphism** overlays and animated gradients for a futuristic look
- **Particle backgrounds** for immersive feel
- **Smooth transitions** and hover effects
- **Mobile-first** layouts for seamless experience on any device

---

## 🛠️ Tech Stack

| Core         | UI/UX         | Blockchain      | Tooling        |
|--------------|---------------|----------------|----------------|
| React        | TailwindCSS   | Ethers.js      | Vite           |
| RainbowKit   | Animations    | Wagmi          | ESLint         |

---

## 🙏 Credits

- [RainbowKit](https://rainbowkit.com/)
- [Wagmi](https://wagmi.sh/)
- [Ethers.js](https://docs.ethers.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

---

> **Developed with ❤️ by [Martin]**