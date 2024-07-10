import { useEffect, useRef, useState } from "react";
import { useMinter } from "../utils/contexts/MinterContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import styles from "../styles/Form.module.scss";
import axios from "axios";

interface NFT {
  name: string;
  description: string;
  image: string;
  tokenId: number;
  createdAt: Date;
}

const MintPage = () => {
  const {
    connectWallet,
    mintToken,
    transfer,
    account,
    owner,
    contractName,
    contractSymbol,
  } = useMinter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [ownedNFTs, setOwnedNFTs] = useState<NFT[]>([]);
  const [isMinting, setIsMinting] = useState(false);

  const { data: nfts } = useQuery<NFT[]>({
    queryKey: ["nfts", account],
    queryFn: async () => {
      const response = await axios.get(`${process.env.REACT_APP_URL as string}/nfts/${account}`);
      return response.data;
    },
    enabled: !!account,
  });

  useEffect(() => {
    setOwnedNFTs(nfts || []);
  }, [nfts, account]);

  const mutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      if (image) {
        formData.append("file", image);
        formData.append("name", name || "");
        formData.append("description", description || "");
        formData.append("account", account || "");
        formData.append("owner", owner || "");
      }
      return await fetch(`${process.env.REACT_APP_URL as string}/mint`, {
        method: "POST",
        body: formData,
      }).then((res) => res.json());
    },
    onError: () => {
      setIsMinting(false);
    },
  });

  const handleImageChange = async (e: any) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleMintToken = async () => {
    if (account && name && description && image) {
      setIsMinting(true);
      const imageUri = await mutation.mutateAsync();
      console.log("Image URI:", imageUri.response);
      await mintToken(account, imageUri.response);
    } else {
      alert("Please fill in all fields");
    }
    setIsMinting(false);
    setImage(null);
    setName("");
    setDescription("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Mint NFT</h2>
      </div>

      <div className={styles.form}>
        <form action="submit">
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            name="description"
            id="description"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            ref={inputRef}
            type="file"
            name="image"
            id="image"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          {!image && (
            <button
              onClick={(e: any) => {
                e.preventDefault();
                inputRef.current?.click();
              }}
            >
              Upload Image
            </button>
          )}
          {image && (
            <div className={styles.uploadedImg}>
              <img src={URL.createObjectURL(image)} alt="Uploaded Image" />
              <p>{image.name}</p>
            </div>
          )}
        </form>
        <button
          onClick={account ? handleMintToken : connectWallet}
          disabled={isMinting ? true : false}
        >
          {isMinting ? "Minting..." : account ? "Mint" : "Connect Wallet 💭"}
        </button>
      </div>
    </div>
  );
};

export default MintPage;
