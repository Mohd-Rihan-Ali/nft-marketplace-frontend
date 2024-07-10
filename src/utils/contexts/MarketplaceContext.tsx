import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import { ethers } from "ethers";
import { MARKETPLACE_ABI } from "../ABIs/MarketplaceABI";
import { MINTER_ABI } from "../ABIs/NFTMinterABI";


const NFT_MINTER_CONTRACT = process.env.REACT_APP_MINTER_CONTRACT_ADDRESS as string; // nft minter contract address
const CONTRACT_ADDRESS = process.env.REACT_APP_MARKETPLACE_CONTRACT_ADDRESS as string; // nft marketplace contract address

console.log("REACT_APP_MINTER_CONTRACT_ADDRESS:", NFT_MINTER_CONTRACT);
console.log("REACT_APP_MARKETPLACE_CONTRACT_ADDRESS:", CONTRACT_ADDRESS);

const marketplaceABI = MARKETPLACE_ABI;
const nftMinterABI = MINTER_ABI;

interface MarketplaceContextProps {
  connectWallet: () => void;
  account: string | null;
  owner: string | null;
  listNft: (tokenId: number, price: number) => void;
  buyNft: (tokenId: number) => void;
  cancelListing: (tokenId: number) => void;
  updatePrice: (tokenId: number, newPrice: number) => void;
  getListing: (tokenId: number) => void;
}

export const MarketplaceContext = createContext<MarketplaceContextProps>({
  connectWallet: async () => {},
  account: null,
  owner: null,
  listNft: async (tokenId: number, price: number) => {},
  buyNft: async (tokenId: number) => {},
  cancelListing: async (tokenId: number) => {},
  updatePrice: async (tokenId: number, newPrice: number) => {},
  getListing: async (tokenId: number) => {},
});

export const MarketplaceProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(
    null
  );
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [minterContract, setMinterContract] = useState<ethers.Contract | null>(
    null
  );
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [account, setAccount] = useState<string | null>(null);
  const [owner, setOwner] = useState<string | null>(null);

  useEffect(() => {
    if ((window as any).ethereum && provider) {
      (window as any).ethereum.on("accountsChanged", (accounts: string[]) => {
        setAccount(accounts[0]);
      });
    }
  }, [provider, account]);

  const connectWallet = async () => {
    if ((window as any).ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(
          (window as any).ethereum
        );
        await provider.send("eth_requestAccounts", []);
        const accounts = await provider.listAccounts();

        const signer = provider.getSigner();
        const nftMinter = new ethers.Contract(
          NFT_MINTER_CONTRACT,
          nftMinterABI,
          signer
        );
        setMinterContract(nftMinter);

        const marketplace_contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          marketplaceABI,
          signer
        );
        setProvider(provider);
        setSigner(signer);
        setContract(marketplace_contract);
        setAccount(accounts[0]);
        setOwner(await marketplace_contract.owner);

        console.log("Contract address:", CONTRACT_ADDRESS);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install MetaMask");
      console.log("Please install MetaMask");
    }
  };

  // Listing NFT on the marketplace
  const listNft = async (tokenId: number, price: number) => {
    try {
      if (contract && signer && minterContract) {
        console.log("Listing NFT:", tokenId, price);

        const allowance = await minterContract.getApproved(tokenId);
        console.log("Current allowance:", allowance);

        // Approve the marketplace contract to transfer the NFT
        console.log("Approving marketplace contract...");
        const approveTx = await minterContract.approve(
          contract.address,
          tokenId,
          {
            gasLimit: 100000,
          }
        );
        console.log("Approve transaction:", approveTx);
        await approveTx.wait();

        const priceInWei = ethers.utils.parseEther(price.toString());

        // List the NFT
        console.log("Listing the NFT on the marketplace...");
        const tx = await contract.listNFT(tokenId, priceInWei, {
          gasLimit: 100000,
        });
        console.log("List transaction:", tx);
        await tx.wait();

        alert("NFT listed successfully");
        console.log("NFT listed successfully");
      } else {
        throw new Error("Contract or account not found");
      }
    } catch (error: any) {
      console.error("Error listing NFT:", error.message);
      alert("Error listing NFT: " + error.message);
    }
  };

  // Buying NFT from the marketplace
  const buyNft = async (tokenId: number) => {
    try {
      if (!contract) throw new Error("Contract not found");

      console.log("Fetching listing for token ID:", tokenId);
      const listing = await contract.getListing(tokenId);
      console.log("Listing fetched:", listing);

      if (!listing || listing.price === 0) throw new Error("NFT not listed");

      console.log(
        "Preparing to buy NFT. Token ID:",
        tokenId,
        "Price:",
        listing.price
      );
      const tx = await contract.buyNFT(tokenId, {
        gasLimit: 200000,
        value: listing.price,
      });

      console.log("Transaction sent:", tx);
      await tx.wait();

      alert("NFT bought successfully");
      console.log("NFT bought successfully");
    } catch (error: any) {
      console.error("Error buying NFT:", error.message);
      alert("Error buying NFT: " + error.message);
    }
  };

  // Canceling NFT listing
  const cancelListing = async (tokenId: number) => {
    try {
      if (contract) {
        const tx = await contract.cancelListing(tokenId);
        await tx.wait();
        console.log("Listing canceled successfully: ", tx);
      } else {
        throw new Error("Contract not found");
      }
      alert("Listing canceled successfully");
      console.log("Listing canceled successfully");
    } catch (error) {
      console.error("Error canceling listing:", error);
    }
  };

  // Update NFT price
  const updatePrice = async (tokenId: number, newPrice: number) => {
    try {
      if (contract) {
        const priceInWei = ethers.utils.parseEther(newPrice.toString());
        const tx = await contract.updatePrice(tokenId, priceInWei);
        await tx.wait();
      } else {
        throw new Error("Contract not found");
      }
      alert("Price updated successfully");
      console.log("Price updated successfully");
    } catch (error) {
      console.error("Error updating price:", error);
    }
  };

  // Get listing
  const getListing = async (tokenId: number) => {
    try {
      if (contract) {
        const listing = await contract.getListing(tokenId);
        console.log("Listing:", listing);
      } else {
        throw new Error("Contract not found");
      }
      alert("Listing fetched successfully");
      console.log("Listing fetched successfully");
    } catch (error) {
      console.error("Error getting listing:", error);
    }
  };

  return (
    <MarketplaceContext.Provider
      value={{
        connectWallet,
        account,
        owner,
        listNft,
        buyNft,
        cancelListing,
        updatePrice,
        getListing,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => useContext(MarketplaceContext);
