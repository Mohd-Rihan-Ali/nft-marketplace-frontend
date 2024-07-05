import { useMinter } from "../utils/contexts/MinterContext";
import { useMarketplace } from "../utils/contexts/MarketplaceContext";
import { useState } from "react";

const ConnectWallet = () => {
  const { connectWallet, account } = useMinter();
  const { connectWallet: marketplaceWallet } = useMarketplace();
  const [isConnected, setIsConnected] = useState(false);

  const handleConnectWallet = () => {
    connectWallet();
    marketplaceWallet();
    setIsConnected(true);
  };

  return (
    <div>
      <button onClick={handleConnectWallet}>Connect Wallet</button>
    </div>
  );
};

export default ConnectWallet;
