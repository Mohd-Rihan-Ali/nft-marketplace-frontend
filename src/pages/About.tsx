import styles from "../styles/About.module.scss";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className={styles.about}>
      <div className={styles.hero}>
        <h1>Welcome to Minter</h1>
        <p>Your ultimate destination for creating, buying, and selling NFTs.</p>
      </div>
      <div className={styles.content}>
        <section className={styles.section}>
          <h2>What are NFTs?</h2>
          <p>
            NFTs, or Non-Fungible Tokens, are unique digital assets that
            represent ownership of a specific item or piece of content, verified
            through blockchain technology. Unlike cryptocurrencies, which are
            interchangeable, each NFT is distinct and holds its own value.
          </p>
        </section>
        <section className={styles.section}>
          <h2>About Our Marketplace ✨</h2>
          <p>
            Minter is a cutting-edge NFT marketplace that allows you to explore,
            buy, and sell unique digital assets. Our platform ensures the
            authenticity and provenance of every item, providing a secure and
            transparent environment for both creators and collectors.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Steps to Mint Your NFT</h2>
          <ol>
            <li>
              <strong>Connect to a Wallet:</strong> To get started, connect your
              wallet, such as{" "}
              <a
                href="https://metamask.io/download.html"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                MetaMask
              </a>
              , to our platform.
            </li>
            <li>
              <strong>Get Some Faucets:</strong> Ensure you have some
              cryptocurrency to cover the minting fees. You can use services
              like Google Faucet to get free test tokens.
            </li>
            <li>
              <strong>Mint Your NFT:</strong> Follow the guided process on our
              platform to upload your digital asset, provide details, and mint
              your unique NFT.
            </li>
          </ol>
        </section>
        <section className={styles.section}>
          <h2>Now, Mint Your Own NFTs!</h2>
          <p>
            At Minter, you can easily mint your own NFTs and showcase your
            digital creations to the world. Our user-friendly minting process
            allows artists, musicians, and creators of all kinds to tokenize
            their work and gain exposure to a global audience.
          </p>
          <Link to="/mint" className={styles.ctaButton}>
            Start Minting ✨
          </Link>
        </section>
        <section className={styles.section}>
          <h2>Why Choose Minter?</h2>
          <ul>
            <li>Secure and transparent transactions</li>
            <li>User-friendly interface</li>
            <li>Support for various digital assets</li>
            <li>Vibrant community of creators and collectors</li>
            <li>Continuous innovation and updates</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default About;
