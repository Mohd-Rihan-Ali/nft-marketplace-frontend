import React from "react";
import styles from "../styles/TokenHistory.module.scss";

interface TokenHistoryProps {
  history: {
    events: string[];
    prices: string[];
    from: string[];
    to: string[];
    date: string[];
  };
}

const abbreviateAddress = (address: string) => {
  return address ? `${address.slice(0, 3)}...${address.slice(-3)}` : "";
};

const formatPrice = (price: number) => {
  const formattedPrice = Number(price) / 10 ** 18;
  return formattedPrice;
};

const TokenHistory: React.FC<TokenHistoryProps> = ({ history }) => {
  return (
      <div className={styles.tokenHistory}>
        <h2>Token History</h2>
        {history && history.events.length > 0 ? (
          <table className={styles.historyTable}>
            <thead>
              <tr>
                <th>Event</th>
                <th>Price</th>
                <th>From</th>
                <th>To</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {history.events.map((event, index) => (
                <tr key={index}>
                  <td>{event}</td>
                  <td>{formatPrice(Number(history.prices[index]))} ETH</td>
                  <td>{abbreviateAddress(history.from[index])}</td>
                  <td>{abbreviateAddress(history.to[index])}</td>
                  <td>{new Date(history.date[index]).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No history available for this token.</p>
        )}
      </div>
  );
};

export default TokenHistory;
