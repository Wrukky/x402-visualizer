import { useState, useEffect } from “react”;

var LINKS = [
{
cat: “MAIN”,
color: “#f59e0b”,
items: [
{
title: “OpenGradient”,
url: “https://opengradient.ai”,
tag: “WEBSITE”,
desc: “The official home of the OpenGradient decentralized AI inference network. Every model call runs inside a Trusted Execution Environment and settles on-chain. Start here.”
},
{
title: “Documentation”,
url: “https://docs.opengradient.ai”,
tag: “DOCS”,
desc: “Complete technical reference for everything OpenGradient. Architecture deep-dives, SDK guides, API specs, and network configuration. The developer bible.”
},
{
title: “GitHub”,
url: “https://github.com/OpenGradient”,
tag: “CODE”,
desc: “Open-source repositories powering the stack. Python SDK, smart contracts, examples, and the Claude Code plugin. Everything is open.”
},
{
title: “Discord”,
url: “https://discord.gg/SC45QNNMsB”,
tag: “COMMUNITY”,
desc: “The beating heart of the developer community. Get support, share projects, connect with the core team, and catch network announcements first.”
}
]
},
{
cat: “BUILD”,
color: “#34d399”,
items: [
{
title: “Python SDK”,
url: “https://docs.opengradient.ai/developers/sdk/”,
tag: “SDK”,
desc: “The primary developer toolkit. Verified LLM inference, model hub management, on-chain ML workflows, and LangChain agents - all with automatic x402 payment handling.”
},
{
title: “Secure LLM Inference”,
url: “https://docs.opengradient.ai/developers/sdk/llm.html”,
tag: “LLM”,
desc: “Call GPT-5, Claude, Gemini, and Grok through one unified API with cryptographic proof of execution. Supports streaming, tool calling, and multi-turn agents.”
},
{
title: “x402 Gateway”,
url: “https://docs.opengradient.ai/developers/x402/”,
tag: “PROTOCOL”,
desc: “Payment-gated HTTP standard for LLM inference. Use directly from any language - JavaScript, Go, Rust, curl. No SDK required. Payments via $OPG on Base Sepolia.”
},
{
title: “x402 API Reference”,
url: “https://docs.opengradient.ai/developers/x402/api-reference.html”,
tag: “API”,
desc: “Full REST API spec for the x402 Gateway. Endpoint schemas, request and response formats, authentication patterns, and payment flow details.”
},
{
title: “ML Inference Alpha”,
url: “https://docs.opengradient.ai/developers/sdk/ml_inference.html”,
tag: “ALPHA”,
desc: “Run ONNX models directly on-chain. A cutting-edge alpha for fully decentralized ML execution with on-chain settlement and cryptographic proof.”
},
{
title: “Model Management”,
url: “https://docs.opengradient.ai/developers/sdk/model_management.html”,
tag: “HUB”,
desc: “Upload, version, and manage ML models on the decentralized Model Hub via the Python SDK. Make models instantly available for inference on the network.”
},
{
title: “SDK Examples”,
url: “https://github.com/OpenGradient/OpenGradient-SDK/tree/main/examples”,
tag: “EXAMPLES”,
desc: “Working code samples for every SDK feature. Simple completions to multi-tool ReAct agents, ONNX inference, and LangChain integrations. Copy and run.”
},
{
title: “MemSync”,
url: “https://docs.opengradient.ai/developers/memsync/”,
tag: “MEMORY”,
desc: “Persistent memory layer for AI built on verifiable infrastructure. Store semantic facts, manage user profiles, and enrich context across sessions.”
},
{
title: “MemSync Guide”,
url: “https://memsync.mintlify.app/”,
tag: “GUIDE”,
desc: “Dedicated docs portal for MemSync with interactive guides, API walkthroughs, and integration patterns for AI apps with long-term memory.”
},
{
title: “MemSync API”,
url: “https://api.memchat.io/docs”,
tag: “API”,
desc: “Full REST API reference for the MemSync service. Fact extraction, semantic search, user profile management, and context enrichment endpoints.”
}
]
},
{
cat: “NETWORK”,
color: “#60a5fa”,
items: [
{
title: “Architecture Overview”,
url: “https://docs.opengradient.ai/learn/architecture/”,
tag: “ARCH”,
desc: “Deep-dive into how the decentralized network is structured. Full nodes, inference nodes, data nodes, and storage layers explained.”
},
{
title: “Verifiable LLM Execution”,
url: “https://docs.opengradient.ai/learn/onchain_inference/llm_execution.html”,
tag: “TEE”,
desc: “How Intel TDX Trusted Execution Environments provide cryptographic proof that your prompts were processed correctly and privately. No trust required.”
},
{
title: “Proof Settlement”,
url: “https://docs.opengradient.ai/learn/onchain_inference/da.html”,
tag: “PROOF”,
desc: “How inference proofs get finalized on-chain. The pipeline takes TEE attestations and writes them to the network - creating an immutable audit record.”
},
{
title: “Consensus”,
url: “https://docs.opengradient.ai/learn/network/consensus.html”,
tag: “CONSENSUS”,
desc: “How OpenGradient nodes agree on inference result validity. Byzantine fault tolerance for AI execution without compromising speed.”
},
{
title: “Testnet and RPC Config”,
url: “https://docs.opengradient.ai/learn/network/deployment.html”,
tag: “CONFIG”,
desc: “All network config: RPC endpoints, chain IDs, contract addresses for OpenGradient testnet and Base Sepolia. Copy directly into your wallet.”
}
]
},
{
cat: “PRODUCTS”,
color: “#f472b6”,
items: [
{
title: “Model Hub”,
url: “https://docs.opengradient.ai/models/model_hub/”,
tag: “HUB”,
desc: “A permissionless decentralized repository for AI models. Upload any architecture and make it instantly available for on-chain inference. 2000+ models live.”
},
{
title: “Twin.fun”,
url: “https://www.twin.fun/”,
tag: “LIVE”,
desc: “Trade Minds, Not Tokens. AI digital twins with tokenized key markets on a bonding curve. Hold keys to unlock gated chats and utilities with your favorite twin.”
},
{
title: “Twin.fun Docs”,
url: “https://docs.opengradient.ai/twins/”,
tag: “DOCS”,
desc: “Complete guide to building on Twin.fun. Creator guides, trader strategies, smart contracts, bonding curve math, and developer quickstarts.”
},
{
title: “x402.org”,
url: “https://www.x402.org/”,
tag: “STANDARD”,
desc: “The open standard website for x402 - the payment-gated HTTP protocol. Learn how this emerging standard extends HTTP 402 for machine-to-machine micropayments.”
}
]
},
{
cat: “TOOLS”,
color: “#a78bfa”,
items: [
{
title: “Block Explorer”,
url: “https://explorer.opengradient.ai”,
tag: “EXPLORER”,
desc: “Inspect every inference transaction on the network. Search by tx hash, view TEE attestation proofs, and verify your AI calls were executed as submitted.”
},
{
title: “Testnet Faucet”,
url: “https://faucet.opengradient.ai”,
tag: “FAUCET”,
desc: “Get free $OPG testnet tokens on Base Sepolia instantly. Connect your wallet, request tokens, and make your first verified inference call right away.”
},
{
title: “Python API Reference”,
url: “https://docs.opengradient.ai/api_reference/python_sdk/”,
tag: “API REF”,
desc: “Complete auto-generated API docs for the Python SDK. Every class, method, parameter, and return type with type signatures and cross-references.”
},
{
title: “Claude Code Plugin”,
url: “https://github.com/OpenGradient/claude-plugins”,
tag: “PLUGIN”,
desc: “Install this plugin to unlock the /opengradient-sdk skill in Claude Code - giving you expert-level SDK assistance directly in your terminal.”
},
{
title: “Glossary”,
url: “https://docs.opengradient.ai/help/glossary.html”,
tag: “GLOSSARY”,
desc: “Every OpenGradient term precisely defined. TEE, x402, settlement modes, bonding curves, digital twins. Bookmark this when reading the docs.”
}
]
}
];

var STATS = [
{ n: “2,000+”, label: “Models on Hub” },
{ n: “100+”, label: “Developers” },
{ n: “1M+”, label: “Inferences” },
{ n: “28”, label: “Total Links” }
];

function Card(props) {
var link = props.link;
var color = props.color;
var index = props.index;
var s = {
display: “block”,
textDecoration: “none”,
background: “#0a0a0a”,
border: “1px solid #222”,
padding: “18px 20px”,
cursor: “pointer”,
transition: “all 0.18s ease”,
animationDelay: (index * 0.04) + “s”,
animation: “cardIn 0.4s ease both”,
position: “relative”
};
var [hov, setHov] = useState(false);
if (hov) {
s.border = “1px solid “ + color;
s.background = “#111”;
s.transform = “translateY(-2px)”;
}
return (
<a
href={link.url}
target=”_blank”
rel=“noopener noreferrer”
style={s}
onMouseEnter={function() { setHov(true); }}
onMouseLeave={function() { setHov(false); }}
>
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “flex-start”, marginBottom: 10, gap: 10 }}>
<span style={{
fontFamily: “‘Bebas Neue’, cursive”,
fontSize: 17,
color: hov ? “#fff” : “#e5e5e5”,
letterSpacing: “0.05em”,
lineHeight: 1.1,
transition: “color 0.18s”
}}>
{link.title}
</span>
<span style={{
fontSize: 9,
fontFamily: “‘Courier New’, monospace”,
fontWeight: “bold”,
color: color,
background: color + “18”,
border: “1px solid “ + color + “40”,
padding: “2px 7px”,
borderRadius: 3,
whiteSpace: “nowrap”,
flexShrink: 0,
letterSpacing: “0.1em”
}}>
{link.tag}
</span>
</div>
<p style={{
margin: 0,
fontSize: 12,
color: hov ? “#888” : “#555”,
fontFamily: “‘Courier New’, monospace”,
lineHeight: 1.65,
letterSpacing: “0.01em”,
transition: “color 0.18s”
}}>
{link.desc}
</p>
{hov && (
<div style={{
position: “absolute”,
bottom: 12,
right: 16,
fontSize: 10,
color: color,
fontFamily: “‘Courier New’, monospace”,
fontWeight: “bold”
}}>
VISIT ->
</div>
)}
</a>
);
}

function Section(props) {
var cat = props.cat;
var [open, setOpen] = useState(true);
return (
<div style={{ marginBottom: 2 }}>
<button
onClick={function() { setOpen(!open); }}
style={{
width: “100%”,
background: “none”,
border: “none”,
borderTop: “2px solid “ + cat.color,
padding: “14px 0 12px”,
cursor: “pointer”,
display: “flex”,
alignItems: “center”,
justifyContent: “space-between”,
gap: 12,
textAlign: “left”
}}
>
<div style={{ display: “flex”, alignItems: “center”, gap: 14 }}>
<span style={{
fontFamily: “‘Bebas Neue’, cursive”,
fontSize: 28,
color: cat.color,
letterSpacing: “0.08em”,
lineHeight: 1
}}>
{cat.cat}
</span>
<span style={{
fontSize: 10,
fontFamily: “‘Courier New’, monospace”,
color: “#444”,
letterSpacing: “0.08em”
}}>
{cat.items.length} RESOURCES
</span>
</div>
<span style={{
fontSize: 18,
color: cat.color,
transition: “transform 0.25s”,
display: “inline-block”,
transform: open ? “rotate(180deg)” : “rotate(0deg)”,
fontFamily: “‘Courier New’, monospace”
}}>
v
</span>
</button>

```
  <div style={{
    display: "grid",
    gridTemplateRows: open ? "1fr" : "0fr",
    transition: "grid-template-rows 0.35s ease"
  }}>
    <div style={{ overflow: "hidden" }}>
      <div style={{
        paddingTop: 12,
        paddingBottom: 20,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: 8
      }}>
        {cat.items.map(function(item, i) {
          return <Card key={item.url} link={item} color={cat.color} index={i} />;
        })}
      </div>
    </div>
  </div>
</div>
```

);
}

export default function App() {
var [search, setSearch] = useState(””);
var [mounted, setMounted] = useState(false);
var [ticker, setTicker] = useState(0);

useEffect(function() {
setMounted(true);

```
var link = document.createElement("link");
link.rel = "stylesheet";
link.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Playfair+Display:wght@700;900&display=swap";
document.head.appendChild(link);

var style = document.createElement("style");
style.textContent = [
  "*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }",
  "body { background: #050505; color: #e5e5e5; }",
  "@keyframes cardIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }",
  "@keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }",
  "@keyframes tickerMove { from { transform: translateX(0); } to { transform: translateX(-50%); } }",
  "@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }",
  "::-webkit-scrollbar { width: 4px; }",
  "::-webkit-scrollbar-track { background: #0a0a0a; }",
  "::-webkit-scrollbar-thumb { background: #333; }",
  "input::placeholder { color: #333 !important; }"
].join(" ");
document.head.appendChild(style);

var t = setInterval(function() {
  setTicker(function(p) { return p + 1; });
}, 80);
return function() { clearInterval(t); };
```

}, []);

var filtered = LINKS.map(function(cat) {
return Object.assign({}, cat, {
items: cat.items.filter(function(item) {
if (!search) return true;
var q = search.toLowerCase();
return (
item.title.toLowerCase().indexOf(q) >= 0 ||
item.desc.toLowerCase().indexOf(q) >= 0 ||
item.tag.toLowerCase().indexOf(q) >= 0
);
})
});
}).filter(function(cat) { return cat.items.length > 0; });

var totalLinks = LINKS.reduce(function(s, c) { return s + c.items.length; }, 0);

var tickerItems = [
“OPENGRADIENT – DECENTRALIZED AI INFERENCE”,
“TEE VERIFIED EXECUTION – INTEL TDX”,
“BASE SEPOLIA – x402 PAYMENT PROTOCOL”,
“2000+ MODELS ON HUB”,
“OPEN SOURCE – GITHUB.COM/OPENGRADIENT”,
“TWIN.FUN – TRADE MINDS NOT TOKENS”,
“$OPG TOKEN – TESTNET FAUCET AVAILABLE”
];

if (!mounted) return null;

return (
<div style={{
minHeight: “100vh”,
background: “#050505”,
color: “#e5e5e5”
}}>

```
  {/* TOP BAR */}
  <div style={{
    borderBottom: "1px solid #1a1a1a",
    padding: "10px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    flexWrap: "wrap"
  }}>
    <div style={{
      fontSize: 10,
      fontFamily: "'Courier New', monospace",
      color: "#333",
      letterSpacing: "0.1em"
    }}>
      EST. 2024 -- DECENTRALIZED AI NETWORK
    </div>
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      {["opengradient.ai", "explorer.opengradient.ai", "faucet.opengradient.ai"].map(function(u) {
        return (
          <a
            key={u}
            href={"https://" + u}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 9,
              fontFamily: "'Courier New', monospace",
              color: "#444",
              textDecoration: "none",
              letterSpacing: "0.06em",
              transition: "color 0.15s"
            }}
            onMouseEnter={function(e) { e.target.style.color = "#f59e0b"; }}
            onMouseLeave={function(e) { e.target.style.color = "#444"; }}
          >
            {u}
          </a>
        );
      })}
    </div>
  </div>

  {/* TICKER */}
  <div style={{
    background: "#f59e0b",
    padding: "7px 0",
    overflow: "hidden",
    position: "relative"
  }}>
    <div style={{
      display: "flex",
      gap: 60,
      animation: "tickerMove 30s linear infinite",
      whiteSpace: "nowrap",
      width: "max-content"
    }}>
      {[...tickerItems, ...tickerItems].map(function(item, i) {
        return (
          <span key={i} style={{
            fontSize: 11,
            fontFamily: "'Bebas Neue', cursive",
            color: "#000",
            letterSpacing: "0.15em"
          }}>
            {item}
            <span style={{ marginLeft: 60, color: "#00000066" }}>///</span>
          </span>
        );
      })}
    </div>
  </div>

  <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 80px" }}>

    {/* MASTHEAD */}
    <div style={{
      padding: "48px 0 32px",
      borderBottom: "3px solid #e5e5e5",
      marginBottom: 32,
      animation: "fadeIn 0.6s ease both"
    }}>
      <div style={{
        fontSize: 10,
        fontFamily: "'Courier New', monospace",
        color: "#f59e0b",
        letterSpacing: "0.2em",
        marginBottom: 12,
        display: "flex",
        alignItems: "center",
        gap: 8
      }}>
        <span style={{ animation: "blink 1s infinite" }}>|</span>
        LIVE
        <span style={{ color: "#333", marginLeft: 4 }}>
          -- THE COMPLETE ECOSYSTEM DIRECTORY
        </span>
      </div>

      <h1 style={{
        fontFamily: "'Playfair Display', serif",
        fontWeight: 900,
        fontSize: "clamp(48px, 10vw, 110px)",
        letterSpacing: "-3px",
        lineHeight: 0.9,
        color: "#fff",
        marginBottom: 20
      }}>
        Open<br />
        <span style={{ color: "#f59e0b" }}>Gradient</span>
      </h1>

      <div style={{
        display: "flex",
        gap: 0,
        borderTop: "1px solid #1a1a1a",
        borderBottom: "1px solid #1a1a1a",
        padding: "12px 0",
        marginTop: 20,
        flexWrap: "wrap"
      }}>
        {STATS.map(function(stat, i) {
          return (
            <div key={i} style={{
              flex: 1,
              minWidth: 100,
              padding: "8px 20px 8px 0",
              borderRight: i < STATS.length - 1 ? "1px solid #1a1a1a" : "none",
              marginRight: i < STATS.length - 1 ? 20 : 0
            }}>
              <div style={{
                fontFamily: "'Bebas Neue', cursive",
                fontSize: 32,
                color: "#f59e0b",
                letterSpacing: "0.05em",
                lineHeight: 1
              }}>
                {stat.n}
              </div>
              <div style={{
                fontSize: 9,
                fontFamily: "'Courier New', monospace",
                color: "#444",
                letterSpacing: "0.1em",
                marginTop: 4
              }}>
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>

    {/* SEARCH + CONTROLS */}
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 28,
      flexWrap: "wrap"
    }}>
      <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
        <span style={{
          position: "absolute",
          left: 12,
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: 13,
          color: "#333",
          fontFamily: "'Courier New', monospace",
          pointerEvents: "none"
        }}>
          /
        </span>
        <input
          value={search}
          onChange={function(e) { setSearch(e.target.value); }}
          placeholder="search all " + totalLinks + " links..."
          style={{
            width: "100%",
            background: "#0a0a0a",
            border: "1px solid #222",
            color: "#e5e5e5",
            padding: "10px 14px 10px 28px",
            fontFamily: "'Courier New', monospace",
            fontSize: 12,
            outline: "none",
            letterSpacing: "0.02em",
            borderRadius: 0
          }}
          onFocus={function(e) { e.target.style.borderColor = "#f59e0b"; }}
          onBlur={function(e) { e.target.style.borderColor = "#222"; }}
        />
      </div>
      {search && (
        <button
          onClick={function() { setSearch(""); }}
          style={{
            background: "none",
            border: "1px solid #333",
            color: "#555",
            padding: "10px 14px",
            fontFamily: "'Courier New', monospace",
            fontSize: 11,
            cursor: "pointer",
            letterSpacing: "0.08em",
            transition: "all 0.15s"
          }}
          onMouseEnter={function(e) { e.target.style.color = "#f59e0b"; e.target.style.borderColor = "#f59e0b"; }}
          onMouseLeave={function(e) { e.target.style.color = "#555"; e.target.style.borderColor = "#333"; }}
        >
          CLEAR X
        </button>
      )}
      <div style={{
        fontSize: 10,
        fontFamily: "'Courier New', monospace",
        color: "#333",
        letterSpacing: "0.08em",
        whiteSpace: "nowrap"
      }}>
        {filtered.reduce(function(s, c) { return s + c.items.length; }, 0)} / {totalLinks} SHOWN
      </div>
    </div>

    {/* SECTIONS */}
    <div>
      {filtered.map(function(cat) {
        return <Section key={cat.cat} cat={cat} />;
      })}
    </div>

    {/* FOOTER */}
    <div style={{
      marginTop: 60,
      paddingTop: 20,
      borderTop: "2px solid #1a1a1a",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 12
    }}>
      <span style={{
        fontFamily: "'Bebas Neue', cursive",
        fontSize: 22,
        color: "#1a1a1a",
        letterSpacing: "0.1em"
      }}>
        OPENGRADIENT UNIVERSE
      </span>
      <div style={{
        display: "flex",
        gap: 16,
        flexWrap: "wrap"
      }}>
        {[
          { label: "WEBSITE", url: "https://opengradient.ai" },
          { label: "GITHUB", url: "https://github.com/OpenGradient" },
          { label: "DISCORD", url: "https://discord.gg/SC45QNNMsB" },
          { label: "EXPLORER", url: "https://explorer.opengradient.ai" }
        ].map(function(lnk) {
          return (
            <a
              key={lnk.url}
              href={lnk.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 9,
                fontFamily: "'Courier New', monospace",
                color: "#333",
                textDecoration: "none",
                letterSpacing: "0.1em",
                transition: "color 0.15s"
              }}
              onMouseEnter={function(e) { e.target.style.color = "#f59e0b"; }}
              onMouseLeave={function(e) { e.target.style.color = "#333"; }}
            >
              {lnk.label}
            </a>
          );
        })}
      </div>
    </div>

  </div>
</div>
```

);
}
