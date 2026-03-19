import { useState, useEffect, useRef } from “react”;

// — FLOW STEPS —————————————————————
const STEPS = [
{
id: 1,
phase: “SETUP”,
phaseColor: “#38bdf8”,
label: “TEE Node Registration”,
sublabel: “OpenGradient Network”,
icon: “*”,
network: “OG Network”,
networkColor: “#38bdf8”,
from: “TEE Node”,
to: “OG Blockchain”,
description: “Before serving any requests, TEE nodes register on-chain via the TEE Registry smart contract. The blockchain verifies the AWS Nitro attestation, checks PCR values against approved code hashes, and binds the TLS certificate and signing key to the enclave  -  eliminating any single point of trust.”,
data: {
method: “registerTEEWithAttestation()”,
attestation: “AWS Nitro attestation doc”,
pcr0: “0xa3f2…8b1c”,
tlsCert: “0x9d4e…2f7a”,
signingKey: “0x1b8c…4d9f”,
},
color: “#38bdf8”,
glow: “rgba(56,189,248,0.3)”,
},
{
id: 2,
phase: “SETUP”,
phaseColor: “#38bdf8”,
label: “Permit2 Approval”,
sublabel: “Base Sepolia”,
icon: “(+)”,
network: “Base Sepolia”,
networkColor: “#f59e0b”,
from: “Your Wallet”,
to: “Permit2 Contract”,
description: “A one-time on-chain step on Base Sepolia. Your wallet approves a $OPG token allowance for Permit2 spending. The SDK calls ensure_opg_approval() which checks the current allowance  -  only submitting an ERC-20 approve transaction if it’s below the required amount. Gasless for repeat calls.”,
data: {
contract: “Permit2”,
token: “$OPG (0x240b…987F)”,
chain: “Base Sepolia (84532)”,
amount: “5.0 OPG”,
tx: “0x4f2a…9c1e”,
},
color: “#f59e0b”,
glow: “rgba(245,158,11,0.3)”,
},
{
id: 3,
phase: “REQUEST”,
phaseColor: “#a78bfa”,
label: “Initial HTTP Request”,
sublabel: “llm.opengradient.ai”,
icon: “->”,
network: “HTTP”,
networkColor: “#a78bfa”,
from: “Your App”,
to: “OG Gateway”,
description: “Your application sends a standard POST request to the OpenGradient LLM endpoint. The request looks identical to OpenAI’s API  -  same model, messages, and parameters. No SDK required; any HTTP client in any language works here.”,
data: {
method: “POST /v1/chat/completions”,
model: “openai/gpt-4.1-2025-04-14”,
messages: ‘[{“role”:“user”,“content”:”…”}]’,
max_tokens: “200”,
settlement: “X-SETTLEMENT-TYPE: batch”,
},
color: “#a78bfa”,
glow: “rgba(167,139,250,0.3)”,
},
{
id: 4,
phase: “REQUEST”,
phaseColor: “#a78bfa”,
label: “402 Payment Required”,
sublabel: “Payment Challenge”,
icon: “!”,
network: “HTTP 402”,
networkColor: “#f472b6”,
from: “OG Gateway”,
to: “Your App”,
description: “The server responds with HTTP 402  -  the web’s payment required status code. This is the x402 standard in action. The response headers contain payment requirements: the amount of $OPG needed, the chain ID (Base Sepolia), a payment ID, and an expiry timestamp.”,
data: {
status: “402 Payment Required”,
amount: “0.001 OPG”,
currency: “$OPG”,
chain_id: “84532 (Base Sepolia)”,
payment_id: “0x1234…abcd”,
expires_at: “2024-01-15T10:30:00Z”,
},
color: “#f472b6”,
glow: “rgba(244,114,182,0.3)”,
},
{
id: 5,
phase: “PAYMENT”,
phaseColor: “#34d399”,
label: “Payment Signing”,
sublabel: “Client-side”,
icon: “*”,
network: “Local”,
networkColor: “#34d399”,
from: “Your Wallet”,
to: “Signed Payload”,
description: “Your wallet creates a payment payload using the details from the 402 response and cryptographically signs it using your private key. This signature proves you authorized this exact payment  -  without revealing your private key. The SDK handles this automatically.”,
data: {
payment_id: “0x1234…abcd”,
amount: “0.001”,
currency: “OPG”,
chain_id: “84532”,
nonce: “0x7f3a…2c8d”,
signature: “0xabcd…ef12”,
},
color: “#34d399”,
glow: “rgba(52,211,153,0.3)”,
},
{
id: 6,
phase: “PAYMENT”,
phaseColor: “#34d399”,
label: “Authenticated Request”,
sublabel: “X-PAYMENT Header”,
icon: “[lock]”,
network: “HTTP”,
networkColor: “#a78bfa”,
from: “Your App”,
to: “OG Gateway”,
description: “The original request is resubmitted with the signed payment attached in the X-PAYMENT header. The gateway now has everything it needs: your prompt, your signed payment authorization, and your wallet address. This is the core of the x402 protocol.”,
data: {
header: “X-PAYMENT”,
payload: “{payment_id, amount, …}”,
signature: “0xabcd…ef12”,
address: “0x742d…bEb”,
body: “Same as step 3”,
},
color: “#a78bfa”,
glow: “rgba(167,139,250,0.3)”,
},
{
id: 7,
phase: “VERIFICATION”,
phaseColor: “#fb923c”,
label: “Payment Verification”,
sublabel: “Facilitator . Base Sepolia”,
icon: “o”,
network: “Base Sepolia”,
networkColor: “#f59e0b”,
from: “OG Gateway”,
to: “Facilitator Contract”,
description: “The gateway forwards the signed payment to the Facilitator contract on Base Sepolia (0x339c…294f). The contract verifies the cryptographic signature, confirms the $OPG allowance via Permit2, and prepares settlement. Only after this verification does inference begin.”,
data: {
facilitator: “0x339c…294f”,
chain: “Base Sepolia”,
action: “Verify signature + Permit2”,
permit2: “0x000…Permit2”,
status: “v VERIFIED”,
},
color: “#f59e0b”,
glow: “rgba(245,158,11,0.3)”,
},
{
id: 8,
phase: “INFERENCE”,
phaseColor: “#00e5ff”,
label: “TEE Inference Execution”,
sublabel: “OG Network . Intel TDX”,
icon: “O”,
network: “OG Network”,
networkColor: “#38bdf8”,
from: “TEE Node”,
to: “LLM Provider API”,
description: “The verified request enters the Trusted Execution Environment. The TEE node routes your prompt to the third-party LLM provider (OpenAI, Anthropic, Google, xAI) through hardware-attested code. Intel TDX guarantees the routing code hasn’t been tampered with  -  your prompt stays private.”,
data: {
tee: “Intel TDX Enclave”,
model: “openai/gpt-4.1-2025-04-14”,
provider: “OpenAI API”,
attestation: “Hardware-attested”,
privacy: “End-to-end encrypted”,
},
color: “#00e5ff”,
glow: “rgba(0,229,255,0.3)”,
},
{
id: 9,
phase: “SETTLEMENT”,
phaseColor: “#c084fc”,
label: “Payment Settlement”,
sublabel: “Base Sepolia”,
icon: “O”,
network: “Base Sepolia”,
networkColor: “#f59e0b”,
from: “Facilitator”,
to: “Base Sepolia”,
description: “After inference executes, the $OPG token transfer is finalized on Base Sepolia. The Facilitator submits the payment transaction, transferring OPG from your wallet to the network. This creates an on-chain payment receipt that links to your inference session.”,
data: {
chain: “Base Sepolia (84532)”,
token: “$OPG”,
contract: “0x240b…987F”,
tx_hash: “0x5678…cdef”,
status: “v SETTLED”,
},
color: “#c084fc”,
glow: “rgba(192,132,252,0.3)”,
},
{
id: 10,
phase: “SETTLEMENT”,
phaseColor: “#c084fc”,
label: “Proof Settlement”,
sublabel: “OG Blockchain . Immutable”,
icon: “v”,
network: “OG Network”,
networkColor: “#38bdf8”,
from: “TEE Node”,
to: “OG Blockchain”,
description: “The TEE attestation proof is posted to the OpenGradient blockchain. Validators verify the TEE signature against the on-chain registry, confirm the inference was executed in an approved enclave, and write an immutable record. Your inference is now cryptographically proven  -  forever auditable on the block explorer.”,
data: {
mode: “SETTLE_BATCH”,
proof: “TEE attestation + hashes”,
og_tx: “0x9abc…7654”,
explorer: “explorer.opengradient.ai”,
verified_by: “OG Validators v”,
},
color: “#34d399”,
glow: “rgba(52,211,153,0.3)”,
},
];

const PHASES = [
{ id: “SETUP”, label: “Setup”, color: “#38bdf8”, steps: [1, 2] },
{ id: “REQUEST”, label: “Request”, color: “#a78bfa”, steps: [3, 4] },
{ id: “PAYMENT”, label: “Payment”, color: “#34d399”, steps: [5, 6] },
{ id: “VERIFICATION”, label: “Verify”, color: “#f59e0b”, steps: [7] },
{ id: “INFERENCE”, label: “Inference”, color: “#00e5ff”, steps: [8] },
{ id: “SETTLEMENT”, label: “Settlement”, color: “#c084fc”, steps: [9, 10] },
];

// — ANIMATED BEAM ————————————————————
function Beam({ active, color }) {
return (
<div style={{
height: 2, width: “100%”, position: “relative”, overflow: “hidden”,
background: “rgba(255,255,255,0.04)”, borderRadius: 2,
}}>
{active && (
<div style={{
position: “absolute”, top: 0, left: “-100%”, height: “100%”, width: “60%”,
background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
animation: “beam 1.2s ease-in-out infinite”,
borderRadius: 2,
}} />
)}
</div>
);
}

// — DATA ROW —————————————————————–
function DataRow({ k, v, color }) {
return (
<div style={{
display: “flex”, gap: 12, alignItems: “flex-start”,
padding: “5px 0”,
borderBottom: “1px solid rgba(255,255,255,0.04)”,
}}>
<span style={{
fontSize: 10, color: “#3a5570”, fontFamily: “‘DM Mono’, monospace”,
letterSpacing: “0.06em”, minWidth: 100, flexShrink: 0, paddingTop: 1,
}}>{k}</span>
<span style={{
fontSize: 11, color: color || “#8faac8”,
fontFamily: “‘DM Mono’, monospace”, wordBreak: “break-all”, lineHeight: 1.5,
}}>{v}</span>
</div>
);
}

// — STEP NODE ––––––––––––––––––––––––––––––––
function StepNode({ step, isActive, isCompleted, onClick }) {
const [hovered, setHovered] = useState(false);
const active = isActive || hovered;

return (
<div
onClick={onClick}
onMouseEnter={() => setHovered(true)}
onMouseLeave={() => setHovered(false)}
style={{
display: “flex”, flexDirection: “column”, alignItems: “center”,
gap: 8, cursor: “pointer”, flex: 1, minWidth: 0,
}}
>
{/* Circle */}
<div style={{
width: 44, height: 44, borderRadius: “50%”,
border: `2px solid ${isActive ? step.color : isCompleted ? step.color + "60" : "rgba(255,255,255,0.1)"}`,
background: isActive
? `${step.color}20`
: isCompleted ? `${step.color}10` : “rgba(255,255,255,0.02)”,
display: “flex”, alignItems: “center”, justifyContent: “center”,
transition: “all 0.3s cubic-bezier(0.4,0,0.2,1)”,
boxShadow: isActive ? `0 0 20px ${step.glow}` : “none”,
position: “relative”, flexShrink: 0,
}}>
{isCompleted && !isActive ? (
<span style={{ fontSize: 14, color: step.color + “80” }}>v</span>
) : (
<span style={{
fontSize: 16, color: isActive ? step.color : “#3a5570”,
transition: “color 0.3s”,
}}>{step.icon}</span>
)}
{isActive && (
<div style={{
position: “absolute”, inset: -4, borderRadius: “50%”,
border: `1px solid ${step.color}40`,
animation: “ping 2s ease-in-out infinite”,
}} />
)}
<div style={{
position: “absolute”, top: -6, right: -6,
width: 16, height: 16, borderRadius: “50%”,
background: isActive ? step.color : isCompleted ? step.color + “60” : “#1a2a3a”,
border: “2px solid #060b14”,
display: “flex”, alignItems: “center”, justifyContent: “center”,
fontSize: 8, fontWeight: 800, color: isActive ? “#000” : isCompleted ? “#000” : “#3a5570”,
fontFamily: “‘DM Mono’, monospace”,
transition: “all 0.3s”,
}}>
{step.id}
</div>
</div>

```
  {/* Label */}
  <div style={{ textAlign: "center", width: "100%" }}>
    <div style={{
      fontSize: 9.5, fontWeight: 700,
      color: isActive ? "#fff" : isCompleted ? "#4a6080" : "#2a3f55",
      fontFamily: "'DM Mono', monospace", letterSpacing: "0.04em",
      lineHeight: 1.3, transition: "color 0.3s",
      overflow: "hidden", textOverflow: "ellipsis",
      display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
    }}>
      {step.label}
    </div>
  </div>
</div>
```

);
}

// — NETWORK BADGE ————————————————————
function NetworkBadge({ label, color }) {
return (
<span style={{
fontSize: 9, fontWeight: 700, letterSpacing: “0.1em”,
color, background: `${color}15`,
border: `1px solid ${color}35`,
borderRadius: 20, padding: “2px 8px”,
fontFamily: “‘DM Mono’, monospace”,
}}>
{label}
</span>
);
}

// — MAIN APP —————————————————————–
export default function App() {
const [activeStep, setActiveStep] = useState(1);
const [playing, setPlaying] = useState(false);
const [completedSteps, setCompletedSteps] = useState(new Set());
const [mounted, setMounted] = useState(false);
const intervalRef = useRef(null);
const step = STEPS[activeStep - 1];

useEffect(() => {
setMounted(true);

```
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@400;500&display=swap";
document.head.appendChild(link);

const style = document.createElement("style");
style.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #060b14; }
  @keyframes beam { 0% { left: -60%; } 100% { left: 110%; } }
  @keyframes ping { 0%,100% { opacity:0.6; transform:scale(1); } 50% { opacity:0; transform:scale(1.5); } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
  @keyframes spin { to { transform:rotate(360deg); } }
  @keyframes floatUp { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-6px); } }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(0,229,255,0.15); border-radius: 2px; }
`;
document.head.appendChild(style);
```

}, []);

// Auto-play
useEffect(() => {
if (playing) {
intervalRef.current = setInterval(() => {
setActiveStep((prev) => {
const next = prev >= STEPS.length ? 1 : prev + 1;
if (next === 1) setCompletedSteps(new Set());
else setCompletedSteps((c) => new Set([…c, prev]));
return next;
});
}, 2800);
} else {
clearInterval(intervalRef.current);
}
return () => clearInterval(intervalRef.current);
}, [playing]);

const goToStep = (n) => {
setPlaying(false);
setActiveStep(n);
setCompletedSteps(new Set(Array.from({ length: n - 1 }, (_, i) => i + 1)));
};

const togglePlay = () => {
if (!playing) {
setCompletedSteps(new Set(Array.from({ length: activeStep - 1 }, (_, i) => i + 1)));
}
setPlaying((p) => !p);
};

if (!mounted) return null;

const progress = ((activeStep - 1) / (STEPS.length - 1)) * 100;

return (
<div style={{
minHeight: “100vh”, background: “#060b14”, color: “#e2eaf4”,
fontFamily: “‘DM Mono’, monospace”,
}}>
{/* Background grid */}
<div style={{
position: “fixed”, inset: 0, pointerEvents: “none”, zIndex: 0,
backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Ccircle cx='20' cy='20' r='0.5' fill='rgba(0,229,255,0.15)'/%3E%3C/svg%3E")`,
backgroundSize: “40px 40px”,
}} />
{/* Glow orbs */}
<div style={{
position: “fixed”, top: -300, right: -200, width: 700, height: 700,
background: `radial-gradient(circle, ${step.glow.replace("0.3", "0.06")} 0%, transparent 70%)`,
borderRadius: “50%”, pointerEvents: “none”, zIndex: 0,
transition: “background 0.6s ease”,
}} />
<div style={{
position: “fixed”, bottom: -200, left: -100, width: 500, height: 500,
background: “radial-gradient(circle, rgba(167,139,250,0.04) 0%, transparent 70%)”,
borderRadius: “50%”, pointerEvents: “none”, zIndex: 0,
}} />

```
  <div style={{ position: "relative", zIndex: 1, maxWidth: 960, margin: "0 auto", padding: "32px 20px 60px" }}>

    {/* -- HEADER -- */}
    <div style={{ textAlign: "center", marginBottom: 40, animation: "fadeUp 0.6s ease both" }}>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: "rgba(0,229,255,0.07)", border: "1px solid rgba(0,229,255,0.18)",
        borderRadius: 20, padding: "5px 16px", marginBottom: 18,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", animation: "pulse 2s infinite" }} />
        <span style={{ fontSize: 10, color: "#00e5ff", letterSpacing: "0.14em", fontWeight: 700 }}>
          INTERACTIVE FLOW VISUALIZER
        </span>
      </div>

      <h1 style={{
        fontFamily: "'Syne', sans-serif", fontWeight: 800,
        fontSize: "clamp(28px, 5vw, 52px)", letterSpacing: "-2px", lineHeight: 1.05,
        color: "#fff", marginBottom: 10,
      }}>
        x402 Payment Flow
        <span style={{
          display: "block", fontSize: "0.55em", letterSpacing: "-0.5px",
          background: "linear-gradient(90deg, #00e5ff, #a78bfa, #34d399)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          Prompt -> TEE -> Base Sepolia -> On-Chain Proof
        </span>
      </h1>

      <p style={{
        fontSize: 12, color: "#3a5570", maxWidth: 520, margin: "0 auto",
        lineHeight: 1.7, letterSpacing: "0.02em",
      }}>
        A step-by-step animation of how OpenGradient processes every LLM inference  - 
        from HTTP request to cryptographic settlement.
      </p>
    </div>

    {/* -- PHASE BAR -- */}
    <div style={{
      display: "flex", gap: 4, marginBottom: 28,
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 12, padding: 6, flexWrap: "wrap",
    }}>
      {PHASES.map((phase) => {
        const isActive = phase.id === step.phase;
        const isDone = phase.steps.every((s) => completedSteps.has(s));
        return (
          <div
            key={phase.id}
            onClick={() => goToStep(phase.steps[0])}
            style={{
              flex: 1, minWidth: 60, padding: "8px 6px", borderRadius: 8,
              background: isActive ? `${phase.color}15` : "transparent",
              border: `1px solid ${isActive ? phase.color + "40" : "transparent"}`,
              cursor: "pointer", textAlign: "center", transition: "all 0.25s",
            }}
          >
            <div style={{
              fontSize: 9, fontWeight: 700, letterSpacing: "0.08em",
              color: isActive ? phase.color : isDone ? phase.color + "50" : "#2a3f55",
              transition: "color 0.25s",
            }}>
              {phase.label.toUpperCase()}
            </div>
            <div style={{
              fontSize: 8, color: isActive ? phase.color + "80" : "#1e3040",
              marginTop: 2, letterSpacing: "0.06em",
            }}>
              STEPS {phase.steps.join("-")}
            </div>
          </div>
        );
      })}
    </div>

    {/* -- STEP PIPELINE -- */}
    <div style={{
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 16, padding: "20px 16px", marginBottom: 24,
    }}>
      {/* Progress bar */}
      <div style={{
        height: 2, background: "rgba(255,255,255,0.05)", borderRadius: 2, marginBottom: 20,
        position: "relative",
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, height: "100%",
          width: `${progress}%`,
          background: `linear-gradient(90deg, #38bdf8, ${step.color})`,
          borderRadius: 2, transition: "width 0.5s ease",
          boxShadow: `0 0 8px ${step.glow}`,
        }} />
      </div>

      {/* Steps row */}
      <div style={{ display: "flex", gap: 4, alignItems: "flex-start" }}>
        {STEPS.map((s, i) => (
          <div key={s.id} style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
            <StepNode
              step={s}
              isActive={activeStep === s.id}
              isCompleted={completedSteps.has(s.id)}
              onClick={() => goToStep(s.id)}
            />
            {i < STEPS.length - 1 && (
              <div style={{ width: 16, flexShrink: 0, padding: "0 2px", marginTop: -20 }}>
                <Beam active={activeStep === s.id} color={s.color} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>

    {/* -- MAIN CONTENT -- */}
    <div style={{
      display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16,
      animation: "fadeUp 0.4s ease both",
      animationDelay: "0.05s",
    }}
      key={activeStep}
    >
      {/* LEFT  -  Step detail */}
      <div style={{
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${step.color}30`,
        borderRadius: 16, padding: 24,
        boxShadow: `0 0 40px ${step.glow.replace("0.3","0.08")}`,
        display: "flex", flexDirection: "column", gap: 16,
      }}>
        {/* Step header */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: `${step.color}15`,
              border: `1px solid ${step.color}40`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, color: step.color, flexShrink: 0,
              animation: "floatUp 3s ease-in-out infinite",
            }}>
              {step.icon}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{
                  fontSize: 9, fontWeight: 800, letterSpacing: "0.14em",
                  color: step.color, background: `${step.color}15`,
                  border: `1px solid ${step.color}35`,
                  borderRadius: 4, padding: "2px 7px",
                }}>
                  STEP {step.id} / {STEPS.length}
                </span>
                <NetworkBadge label={step.network} color={step.networkColor} />
              </div>
              <h2 style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 800,
                fontSize: 18, letterSpacing: "-0.5px", color: "#fff", lineHeight: 1.1,
              }}>
                {step.label}
              </h2>
              <div style={{ fontSize: 10, color: "#3a5570", marginTop: 2, letterSpacing: "0.05em" }}>
                {step.sublabel}
              </div>
            </div>
          </div>
        </div>

        {/* Flow arrow */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 14px",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: 10,
        }}>
          <span style={{
            fontSize: 11, fontWeight: 700, color: step.color,
            background: `${step.color}15`, border: `1px solid ${step.color}30`,
            borderRadius: 6, padding: "4px 10px", whiteSpace: "nowrap",
          }}>
            {step.from}
          </span>
          <div style={{ flex: 1, position: "relative" }}>
            <div style={{ height: 1, background: `linear-gradient(90deg, ${step.color}60, ${step.color}20)` }} />
            <div style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", color: step.color, fontSize: 10 }}>></div>
          </div>
          <span style={{
            fontSize: 11, fontWeight: 700, color: "#8faac8",
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 6, padding: "4px 10px", whiteSpace: "nowrap",
          }}>
            {step.to}
          </span>
        </div>

        {/* Description */}
        <p style={{
          fontSize: 12.5, lineHeight: 1.75, color: "#6a8aaa",
          letterSpacing: "0.01em", flex: 1,
        }}>
          {step.description}
        </p>

        {/* Navigation */}
        <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
          <button
            onClick={() => goToStep(Math.max(1, activeStep - 1))}
            disabled={activeStep === 1}
            style={{
              flex: 1, padding: "10px", borderRadius: 10,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: activeStep === 1 ? "#1e3040" : "#4a6080",
              cursor: activeStep === 1 ? "not-allowed" : "pointer",
              fontSize: 12, fontFamily: "'DM Mono', monospace",
              transition: "all 0.2s",
            }}
          >
            <- PREV
          </button>
          <button
            onClick={togglePlay}
            style={{
              flex: 2, padding: "10px", borderRadius: 10,
              background: playing ? `${step.color}20` : "rgba(255,255,255,0.03)",
              border: `1px solid ${playing ? step.color + "50" : "rgba(255,255,255,0.08)"}`,
              color: playing ? step.color : "#4a6080",
              cursor: "pointer", fontSize: 12,
              fontFamily: "'DM Mono', monospace",
              transition: "all 0.2s", fontWeight: 700, letterSpacing: "0.08em",
              boxShadow: playing ? `0 0 16px ${step.glow.replace("0.3","0.15")}` : "none",
            }}
          >
            {playing ? "|| PAUSE" : "> AUTO-PLAY"}
          </button>
          <button
            onClick={() => goToStep(Math.min(STEPS.length, activeStep + 1))}
            disabled={activeStep === STEPS.length}
            style={{
              flex: 1, padding: "10px", borderRadius: 10,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: activeStep === STEPS.length ? "#1e3040" : "#4a6080",
              cursor: activeStep === STEPS.length ? "not-allowed" : "pointer",
              fontSize: 12, fontFamily: "'DM Mono', monospace",
              transition: "all 0.2s",
            }}
          >
            NEXT ->
          </button>
        </div>
      </div>

      {/* RIGHT  -  Data payload */}
      <div style={{
        background: "rgba(255,255,255,0.015)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16, padding: 24,
        display: "flex", flexDirection: "column", gap: 0,
      }}>
        {/* Terminal header */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8, marginBottom: 16,
          paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{ display: "flex", gap: 5 }}>
            {["#f87171","#fbbf24","#34d399"].map((c,i) => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.7 }} />
            ))}
          </div>
          <span style={{
            fontSize: 9, color: "#2a3f55", letterSpacing: "0.1em", fontWeight: 700, marginLeft: 4,
          }}>
            PAYLOAD  -  STEP {step.id}
          </span>
          <div style={{
            marginLeft: "auto", width: 8, height: 8, borderRadius: "50%",
            background: step.color, animation: "pulse 1.5s infinite",
            boxShadow: `0 0 6px ${step.color}`,
          }} />
        </div>

        {/* Data rows */}
        <div style={{ flex: 1 }}>
          {Object.entries(step.data).map(([k, v]) => (
            <DataRow key={k} k={k} v={String(v)} color={
              v.includes("v") ? "#34d399" :
              v.startsWith("0x") ? step.color :
              v.includes("Sepolia") ? "#f59e0b" :
              v.includes("TEE") || v.includes("Intel") ? "#00e5ff" :
              "#8faac8"
            } />
          ))}
        </div>

        {/* Settlement mode selector */}
        <div style={{
          marginTop: 20, padding: "14px", borderRadius: 10,
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}>
          <div style={{ fontSize: 9, color: "#2a3f55", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 10 }}>
            SETTLEMENT MODES
          </div>
          {[
            { id: "PRIVATE", label: "Private", desc: "No on-chain data", color: "#f472b6" },
            { id: "BATCH", label: "Batch Hashed", desc: "Aggregated hashes (default)", color: "#a78bfa" },
            { id: "INDIVIDUAL", label: "Individual Full", desc: "Full data + audit trail", color: "#34d399" },
          ].map((mode) => (
            <div key={mode.id} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "7px 10px", borderRadius: 8, marginBottom: 4,
              background: mode.id === "BATCH" ? `${mode.color}08` : "transparent",
              border: `1px solid ${mode.id === "BATCH" ? mode.color + "30" : "transparent"}`,
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: "50%",
                background: mode.id === "BATCH" ? mode.color : "#2a3f55",
                flexShrink: 0,
              }} />
              <span style={{
                fontSize: 10, fontWeight: 700, color: mode.id === "BATCH" ? mode.color : "#3a5570",
                minWidth: 80,
              }}>
                {mode.label}
              </span>
              <span style={{ fontSize: 9, color: "#2a3f55" }}>{mode.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* -- NETWORK DIAGRAM -- */}
    <div style={{
      background: "rgba(255,255,255,0.015)",
      border: "1px solid rgba(255,255,255,0.05)",
      borderRadius: 16, padding: "20px 24px", marginBottom: 16,
    }}>
      <div style={{
        fontSize: 9, color: "#2a3f55", letterSpacing: "0.1em",
        fontWeight: 700, marginBottom: 16,
      }}>
        NETWORK OVERVIEW
      </div>
      <div style={{ display: "flex", gap: 0, alignItems: "center" }}>
        {[
          { label: "Your App", icon: "[]", color: "#8faac8", sub: "Any language" },
          { label: "->", color: "#2a3f55", connector: true },
          { label: "OG Gateway", icon: "O", color: "#00e5ff", sub: "llm.opengradient.ai" },
          { label: "->", color: "#2a3f55", connector: true },
          { label: "TEE Node", icon: "*", color: "#38bdf8", sub: "Intel TDX" },
          { label: "->", color: "#2a3f55", connector: true },
          { label: "LLM API", icon: "*", color: "#a78bfa", sub: "GPT/Claude/Gemini" },
          { label: "<->", color: "#2a3f55", connector: true, vertical: true },
          { label: "Base Sepolia", icon: "O", color: "#f59e0b", sub: "$OPG Payment" },
          { label: "<->", color: "#2a3f55", connector: true, vertical: true },
          { label: "OG Chain", icon: "o", color: "#34d399", sub: "Proof Settlement" },
        ].map((n, i) => n.connector ? (
          <div key={i} style={{
            fontSize: n.vertical ? 16 : 12, color: "#1e3040",
            padding: "0 6px", flexShrink: 0, marginTop: n.vertical ? -2 : 0,
          }}>
            {n.label}
          </div>
        ) : (
          <div key={i} style={{
            flex: 1, textAlign: "center", padding: "10px 6px",
            background: `${n.color}08`,
            border: `1px solid ${n.color}20`,
            borderRadius: 10,
            transition: "all 0.3s",
          }}>
            <div style={{ fontSize: 16, color: n.color, marginBottom: 4 }}>{n.icon}</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: n.color, letterSpacing: "0.06em" }}>{n.label}</div>
            <div style={{ fontSize: 8, color: "#2a3f55", marginTop: 2 }}>{n.sub}</div>
          </div>
        ))}
      </div>
    </div>

    {/* -- QUICK LINKS -- */}
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {[
        { label: "x402 Docs", url: "https://docs.opengradient.ai/developers/x402/", color: "#a78bfa" },
        { label: "LLM Execution", url: "https://docs.opengradient.ai/learn/onchain_inference/llm_execution.html", color: "#00e5ff" },
        { label: "Block Explorer", url: "https://explorer.opengradient.ai", color: "#f59e0b" },
        { label: "Faucet", url: "https://faucet.opengradient.ai", color: "#34d399" },
        { label: "Python SDK", url: "https://docs.opengradient.ai/developers/sdk/", color: "#f472b6" },
      ].map((link) => (
        <a
          key={link.url}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
            color: link.color, background: `${link.color}10`,
            border: `1px solid ${link.color}30`,
            borderRadius: 8, padding: "7px 14px",
            textDecoration: "none", transition: "all 0.2s",
            fontFamily: "'DM Mono', monospace",
          }}
          onMouseEnter={(e) => { e.target.style.background = `${link.color}20`; e.target.style.borderColor = `${link.color}60`; }}
          onMouseLeave={(e) => { e.target.style.background = `${link.color}10`; e.target.style.borderColor = `${link.color}30`; }}
        >
          -> {link.label}
        </a>
      ))}
    </div>

  </div>
</div>
```

);
}
