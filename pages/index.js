import { useEffect, useState } from "react";
import "../styles/globals.css";

export default function Home() {
  const [tokens, setTokens] = useState(1000000);
  const [model, setModel] = useState("gpt-4o-mini");
  const [settlement, setSettlement] = useState("offchain");

  const [ethPrice, setEthPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  // 🔥 Realistic pricing (per 1M tokens)
  const MODEL_PRICING = {
    "gpt-4o-mini": { input: 0.15, output: 0.6 },
    "gpt-4o": { input: 2.5, output: 10 },
    "cheap-model": { input: 0.02, output: 0.05 }
  };

  // 🔗 Fetch ETH price (replace with real OpenGradient endpoint)
  useEffect(() => {
    async function fetchPrice() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );
        const data = await res.json();
        setEthPrice(data.ethereum.usd);
      } catch {
        setEthPrice(3000); // fallback
      }
      setLoading(false);
    }

    fetchPrice();
  }, []);

  const modelData = MODEL_PRICING[model];

  const inferenceCost =
    (tokens / 1_000_000) * (modelData.input + modelData.output);

  const gasUsedETH = 0.0002; // estimated
  const chainFee =
    settlement === "onchain" ? gasUsedETH * ethPrice : 0;

  const total = inferenceCost + chainFee;

  const opgPercent = total ? (inferenceCost / total) * 100 : 0;
  const gasPercent = total ? (chainFee / total) * 100 : 0;

  return (
    <div className="container">
      <h2>⚡ x402 Cost Calculator</h2>

      <div className="card">
        <label>Inference Volume (tokens)</label>
        <input
          type="number"
          value={tokens}
          onChange={(e) => setTokens(Number(e.target.value))}
        />

        <label>Model</label>
        <select value={model} onChange={(e) => setModel(e.target.value)}>
          {Object.keys(MODEL_PRICING).map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>

        <label>Settlement Mode</label>
        <select
          value={settlement}
          onChange={(e) => setSettlement(e.target.value)}
        >
          <option value="offchain">Off-chain</option>
          <option value="onchain">On-chain</option>
        </select>
      </div>

      <div className="card">
        {loading ? (
          <p>Loading prices...</p>
        ) : (
          <>
            <p>🧠 Model Cost: ${inferenceCost.toFixed(4)}</p>
            <p>⛓️ Gas Fee: ${chainFee.toFixed(4)}</p>
            <p>💰 ETH Price: ${ethPrice}</p>
            <h3>Total: ${total.toFixed(4)}</h3>
          </>
        )}
      </div>

      <div className="card">
        <p>Cost Breakdown</p>

        <div style={{ display: "flex", borderRadius: 10, overflow: "hidden" }}>
          <div
            className="bar"
            style={{
              width: `${opgPercent}%`,
              background: "#4CAF50"
            }}
          />
          <div
            className="bar"
            style={{
              width: `${gasPercent}%`,
              background: "#FF5722"
            }}
          />
        </div>

        <p style={{ fontSize: 12, marginTop: 8 }}>
          Green = Model • Orange = Gas
        </p>
      </div>
    </div>
  );
}
