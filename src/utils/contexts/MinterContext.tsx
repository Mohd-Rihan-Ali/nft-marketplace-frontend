import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import { ethers } from "ethers";
import { MINTER_ABI } from "../ABIs/NFTMinterABI";

const CONTRACT_ADDRESS = process.env.REACT_APP_MINTER_CONTRACT_ADDRESS as string;
console.log("REACT_APP_MINTER_CONTRACT_ADDRESS:", CONTRACT_ADDRESS);

const contractABI = MINTER_ABI;

interface MinterContextProps {
  connectWallet: () => void;
  mintToken: (accountAddress: string, uri: string) => Promise<void>;
  transfer: (to: string, tokenId: number) => Promise<void>;
  account: string | null;
  owner: string | null;
  contractName: string | null;
  contractSymbol: string | null;
}

export const MinterContext = createContext<MinterContextProps>({
  connectWallet: async () => {},
  mintToken: async () => {},
  transfer: async () => {},
  account: null,
  owner: null,
  contractName: null,
  contractSymbol: null,
});

export const MinterProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(
    null
  );
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [owner, setOwner] = useState<string | null>(null);
  const [contractName, setContractName] = useState<string | null>(null);
  const [contractSymbol, setContractSymbol] = useState<string | null>(null);

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
        const signer = provider.getSigner();
        const minter = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractABI,
          signer
        );
        const accounts = await provider.listAccounts();
        setProvider(provider);
        setSigner(signer);
        setContract(minter);
        setAccount(accounts[0]);

        setContractName(await minter.name());
        setContractSymbol(await minter.symbol());
        setOwner(await minter.owner());

        console.log("Contract address:", CONTRACT_ADDRESS);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install MetaMask");
      console.log("Please install MetaMask");
    }
  };

  const mintToken = async (accountAddress: string, uri: string) => {
    if (contract && owner) {
      try {
        const tx = await contract.mint(accountAddress, uri);
        const data = await tx.wait();
        console.log("Token minted:", data);
        alert(`Token is minted: ${data.transactionHash}`);
      } catch (error) {
        alert("Error minting token");
        console.error("Error minting token:", error);
      }
    } else {
      console.log("Contract or owner not found");
      alert("Contract or owner not found");
    }
  };

  const transfer = async (to: string, tokenId: number) => {
    if (contract && account) {
      try {
        const tx = await contract.transferFrom(account, to, tokenId);
        const data = await tx.wait();
        console.log("Token transferred:", data);
        alert(`Token is transferred: ${data.transactionHash}`);
      } catch (error) {
        alert("Error transferring token");
        console.error("Error transferring token:", error);
      }
    } else {
      console.log("Contract or owner not found");
      alert("Contract or owner not found");
    }
  };

  return (
    <MinterContext.Provider
      value={{
        connectWallet,
        mintToken,
        transfer,
        account,
        owner,
        contractName,
        contractSymbol,
      }}
    >
      {children}
    </MinterContext.Provider>
  );
};

export const useMinter = () => useContext(MinterContext);
