import { useState, useEffect } from “react”;

var MODELS = [
{
id: “openai/gpt-4.1-2025-04-14”,
name: “GPT-4.1”,
provider: “OpenAI”,
color: “#10b981”,
inputCost: 0.002,
outputCost: 0.008,
speed: “Fast”,
best: “General purpose, coding, analysis”
},
{
id: “openai/gpt-5”,
name: “GPT-5”,
provider: “OpenAI”,
color: “#10b981”,
inputCost: 0.015,
outputCost: 0.06,
speed: “Medium”,
best: “Complex reasoning, research”
},
{
id: “openai/o4-mini”,
name: “o4-mini”,
provider: “OpenAI”,
color: “#10b981”,
inputCost: 0.0011,
outputCost: 0.0044,
speed: “Fast”,
best: “Budget reasoning tasks”
},
{
id: “anthropic/claude-sonnet-4-6”,
name: “Claude Sonnet 4.6”,
provider: “Anthropic”,
color: “#f59e0b”,
inputCost: 0.003,
outputCost: 0.015,
speed: “Fast”,
best: “Writing, nuanced tasks, agents”
},
{
id: “anthropic/claude-opus-4-6”,
name: “Claude Opus 4.6”,
provider: “Anthropic”,
color: “#f59e0b”,
inputCost: 0.015,
outputCost: 0.075,
speed: “Slow”,
best: “Most complex tasks, research”
},
{
id: “anthropic/claude-haiku-4-5”,
name: “Claude Haiku 4.5”,
provider: “Anthropic”,
color: “#f59e0b”,
inputCost: 0.00025,
outputCost: 0.00125,
speed: “Very Fast”,
best: “High volume, simple tasks”
},
{
id: “google/gemini-2.5-pro”,
name: “Gemini 2.5 Pro”,
provider: “Google”,
color: “#60a5fa”,
inputCost: 0.00125,
outputCost: 0.005,
speed: “Medium”,
best: “Multimodal, long context”
},
{
id: “google/gemini-2.5-flash”,
name: “Gemini 2.5 Flash”,
provider: “Google”,
color: “#60a5fa”,
inputCost: 0.000075,
outputCost: 0.0003,
speed: “Very Fast”,
best: “Speed-critical applications”
},
{
id: “x-ai/grok-4”,
name: “Grok 4”,
provider: “xAI”,
color: “#a78bfa”,
inputCost: 0.003,
outputCost: 0.015,
speed: “Fast”,
best: “Real-time data, X integration”
},
{
id: “x-ai/grok-4-fast”,
name: “Grok 4 Fast”,
provider: “xAI”,
color: “#a78bfa”,
inputCost: 0.005,
outputCost: 0.025,
speed: “Very Fast”,
best: “Low latency production use”
}
];

var SETTLEMENT_MODES = [
{
id: “batch”,
name: “BATCH_HASHED”,
desc: “Aggregated hashes, most cost efficient”,
gasMult: 1.0,
color: “#10b981”,
recommended: true
},
{
id: “individual”,
name: “INDIVIDUAL_FULL”,
desc: “Full data on-chain, full auditability”,
gasMult: 2.2,
color: “#f59e0b”,
recommended: false
},
{
id: “private”,
name: “PRIVATE”,
desc: “No on-chain data, maximum privacy”,
gasMult: 0.3,
color: “#a78bfa”,
recommended: false
}
];

var USE_CASES = [
{ id: “chatbot”, name: “Chatbot”, callsPerDay: 500, avgInput: 200, avgOutput: 300 },
{ id: “agent”, name: “AI Agent”, callsPerDay: 100, avgInput: 800, avgOutput: 600 },
{ id: “batch”, name: “Batch Processing”, callsPerDay: 5000, avgInput: 150, avgOutput: 100 },
{ id: “custom”, name: “Custom”, callsPerDay: 0, avgInput: 0, avgOutput: 0 }
];

var OPG_PRICE_USD = 0.12;
var BASE_GAS_OPG = 0.001;

function calcCost(model, calls, inputTokens, outputTokens, settlementMode) {
var mode = SETTLEMENT_MODES.find(function(m) { return m.id === settlementMode; });
var inputCostUsd = (inputTokens / 1000) * model.inputCost * calls;
var outputCostUsd = (outputTokens / 1000) * model.outputCost * calls;
var inferenceUsd = inputCostUsd + outputCostUsd;
var gasOPG = BASE_GAS_OPG * mode.gasMult * calls;
var gasUsd = gasOPG * OPG_PRICE_USD;
var totalUsd = inferenceUsd + gasUsd;
var totalOPG = totalUsd / OPG_PRICE_USD;
return {
inferenceUsd: inferenceUsd,
gasUsd: gasUsd,
gasOPG: gasOPG,
totalUsd: totalUsd,
totalOPG: totalOPG,
inputCostUsd: inputCostUsd,
outputCostUsd: outputCostUsd
};
}

function fmt(n, decimals) {
if (decimals === undefined) decimals = 4;
return n.toFixed(decimals);
}

function fmtUsd(n) {
if (n < 0.01) return “$” + n.toFixed(6);
if (n < 1) return “$” + n.toFixed(4);
if (n < 1000) return “$” + n.toFixed(2);
return “$” + n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, “,”);
}

function fmtOPG(n) {
if (n < 0.001) return n.toFixed(6) + “ OPG”;
if (n < 1) return n.toFixed(4) + “ OPG”;
return n.toFixed(2) + “ OPG”;
}

function Slider(props) {
var label = props.label;
var value = props.value;
var min = props.min;
var max = props.max;
var step = props.step || 1;
var onChange = props.onChange;
var format = props.format || function(v) { return v; };
var color = props.color || “#10b981”;

return (
<div style={{ marginBottom: 20 }}>
<div style={{ display: “flex”, justifyContent: “space-between”, marginBottom: 8 }}>
<span style={{ fontSize: 11, color: “#888”, fontFamily: “monospace”, letterSpacing: “0.05em” }}>
{label}
</span>
<span style={{ fontSize: 13, color: color, fontFamily: “monospace”, fontWeight: “bold” }}>
{format(value)}
</span>
</div>
<input
type=“range”
min={min}
max={max}
step={step}
value={value}
onChange={function(e) { onChange(Number(e.target.value)); }}
style={{
width: “100%”,
accentColor: color,
cursor: “pointer”,
height: 4
}}
/>
<div style={{ display: “flex”, justifyContent: “space-between”, marginTop: 4 }}>
<span style={{ fontSize: 9, color: “#444”, fontFamily: “monospace” }}>{format(min)}</span>
<span style={{ fontSize: 9, color: “#444”, fontFamily: “monospace” }}>{format(max)}</span>
</div>
</div>
);
}

function ResultBar(props) {
var label = props.label;
var value = props.value;
var total = props.total;
var color = props.color;
var formatted = props.formatted;
var pct = total > 0 ? (value / total) * 100 : 0;

return (
<div style={{ marginBottom: 14 }}>
<div style={{ display: “flex”, justifyContent: “space-between”, marginBottom: 6 }}>
<span style={{ fontSize: 11, color: “#666”, fontFamily: “monospace” }}>{label}</span>
<span style={{ fontSize: 12, color: color, fontFamily: “monospace”, fontWeight: “bold” }}>{formatted}</span>
</div>
<div style={{ height: 6, background: “#1a1a1a”, borderRadius: 3, overflow: “hidden” }}>
<div style={{
height: “100%”,
width: pct + “%”,
background: color,
borderRadius: 3,
transition: “width 0.4s ease”
}} />
</div>
</div>
);
}

function ModelCard(props) {
var model = props.model;
var selected = props.selected;
var onClick = props.onClick;

return (
<div
onClick={onClick}
style={{
padding: “12px 14px”,
border: “1px solid “ + (selected ? model.color : “#1e1e1e”),
background: selected ? model.color + “12” : “#0d0d0d”,
cursor: “pointer”,
borderRadius: 8,
transition: “all 0.15s ease”,
position: “relative”
}}
>
{selected && (
<div style={{
position: “absolute”,
top: 8,
right: 8,
width: 8,
height: 8,
borderRadius: “50%”,
background: model.color,
boxShadow: “0 0 6px “ + model.color
}} />
)}
<div style={{
fontSize: 9,
color: model.color,
fontFamily: “monospace”,
letterSpacing: “0.1em”,
marginBottom: 4,
fontWeight: “bold”
}}>
{model.provider}
</div>
<div style={{
fontSize: 13,
color: selected ? “#fff” : “#ccc”,
fontFamily: “monospace”,
fontWeight: “bold”,
marginBottom: 6,
transition: “color 0.15s”
}}>
{model.name}
</div>
<div style={{ display: “flex”, gap: 6, flexWrap: “wrap” }}>
<span style={{
fontSize: 9,
color: “#555”,
fontFamily: “monospace”,
background: “#1a1a1a”,
padding: “2px 6px”,
borderRadius: 3
}}>
in: ${model.inputCost}/1K
</span>
<span style={{
fontSize: 9,
color: “#555”,
fontFamily: “monospace”,
background: “#1a1a1a”,
padding: “2px 6px”,
borderRadius: 3
}}>
out: ${model.outputCost}/1K
</span>
<span style={{
fontSize: 9,
color: model.color,
fontFamily: “monospace”,
background: model.color + “15”,
padding: “2px 6px”,
borderRadius: 3
}}>
{model.speed}
</span>
</div>
</div>
);
}

export default function App() {
var [mounted, setMounted] = useState(false);
var [selectedModel, setSelectedModel] = useState(MODELS[0]);
var [settlementMode, setSettlementMode] = useState(“batch”);
var [callsPerDay, setCallsPerDay] = useState(500);
var [avgInput, setAvgInput] = useState(200);
var [avgOutput, setAvgOutput] = useState(300);
var [period, setPeriod] = useState(“month”);
var [useCase, setUseCase] = useState(“chatbot”);
var [providerFilter, setProviderFilter] = useState(“All”);

useEffect(function() {
setMounted(true);
var style = document.createElement(“style”);
style.textContent = [
“*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }”,
“body { background: #080808; color: #e5e5e5; font-family: monospace; }”,
“@keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }”,
“@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }”,
“@keyframes glow { 0%,100% { box-shadow: 0 0 20px rgba(16,185,129,0.2); } 50% { box-shadow: 0 0 40px rgba(16,185,129,0.4); } }”,
“::-webkit-scrollbar { width: 4px; }”,
“::-webkit-scrollbar-track { background: #0a0a0a; }”,
“::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }”,
“input[type=range] { -webkit-appearance: none; appearance: none; background: #1a1a1a; border-radius: 4px; outline: none; }”,
“input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; cursor: pointer; }”,
“input::placeholder { color: #333 !important; }”
].join(” “);
document.head.appendChild(style);
}, []);

useEffect(function() {
var uc = USE_CASES.find(function(u) { return u.id === useCase; });
if (uc && useCase !== “custom”) {
setCallsPerDay(uc.callsPerDay);
setAvgInput(uc.avgInput);
setAvgOutput(uc.avgOutput);
}
}, [useCase]);

if (!mounted) return null;

var multiplier = period === “day” ? 1 : period === “week” ? 7 : period === “month” ? 30 : 365;
var totalCalls = callsPerDay * multiplier;
var result = calcCost(selectedModel, totalCalls, avgInput, avgOutput, settlementMode);
var mode = SETTLEMENT_MODES.find(function(m) { return m.id === settlementMode; });

var providers = [“All”, “OpenAI”, “Anthropic”, “Google”, “xAI”];
var filteredModels = MODELS.filter(function(m) {
return providerFilter === “All” || m.provider === providerFilter;
});

var compareResults = MODELS.slice(0, 4).map(function(m) {
return { model: m, result: calcCost(m, totalCalls, avgInput, avgOutput, settlementMode) };
}).sort(function(a, b) { return a.result.totalUsd - b.result.totalUsd; });

return (
<div style={{ minHeight: “100vh”, background: “#080808” }}>

```
  {/* HEADER */}
  <div style={{
    borderBottom: "1px solid #111",
    padding: "16px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{
        width: 36,
        height: 36,
        background: "linear-gradient(135deg, #10b981, #059669)",
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        fontWeight: "bold",
        color: "#000",
        animation: "glow 3s ease-in-out infinite"
      }}>
        $
      </div>
      <div>
        <div style={{ fontSize: 16, fontWeight: "bold", color: "#fff", letterSpacing: "-0.3px" }}>
          OPG Cost Calculator
        </div>
        <div style={{ fontSize: 10, color: "#444", letterSpacing: "0.06em" }}>
          OpenGradient x402 Inference Estimator
        </div>
      </div>
    </div>
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {[
        { label: "DOCS", url: "https://docs.opengradient.ai/developers/x402/" },
        { label: "FAUCET", url: "https://faucet.opengradient.ai" },
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
              color: "#444",
              textDecoration: "none",
              border: "1px solid #1e1e1e",
              padding: "5px 10px",
              borderRadius: 4,
              letterSpacing: "0.08em",
              transition: "all 0.15s"
            }}
            onMouseEnter={function(e) {
              e.target.style.color = "#10b981";
              e.target.style.borderColor = "#10b981";
            }}
            onMouseLeave={function(e) {
              e.target.style.color = "#444";
              e.target.style.borderColor = "#1e1e1e";
            }}
          >
            {lnk.label}
          </a>
        );
      })}
    </div>
  </div>

  <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px 60px" }}>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

      {/* LEFT COLUMN - INPUTS */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

        {/* USE CASE PRESETS */}
        <div style={{
          background: "#0d0d0d",
          border: "1px solid #1a1a1a",
          borderRadius: 12,
          padding: 20,
          animation: "fadeUp 0.4s ease both"
        }}>
          <div style={{ fontSize: 10, color: "#555", letterSpacing: "0.12em", marginBottom: 14, fontWeight: "bold" }}>
            USE CASE PRESET
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {USE_CASES.map(function(uc) {
              var active = useCase === uc.id;
              return (
                <button
                  key={uc.id}
                  onClick={function() { setUseCase(uc.id); }}
                  style={{
                    padding: "9px 12px",
                    border: "1px solid " + (active ? "#10b981" : "#1e1e1e"),
                    background: active ? "#10b98115" : "transparent",
                    color: active ? "#10b981" : "#555",
                    cursor: "pointer",
                    borderRadius: 6,
                    fontSize: 11,
                    fontFamily: "monospace",
                    letterSpacing: "0.04em",
                    transition: "all 0.15s",
                    textAlign: "left"
                  }}
                >
                  {uc.name}
                  {uc.callsPerDay > 0 && (
                    <span style={{ display: "block", fontSize: 9, color: "#333", marginTop: 2 }}>
                      {uc.callsPerDay}/day
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* VOLUME SLIDERS */}
        <div style={{
          background: "#0d0d0d",
          border: "1px solid #1a1a1a",
          borderRadius: 12,
          padding: 20,
          animation: "fadeUp 0.4s ease both",
          animationDelay: "0.05s"
        }}>
          <div style={{ fontSize: 10, color: "#555", letterSpacing: "0.12em", marginBottom: 18, fontWeight: "bold" }}>
            VOLUME CONFIGURATION
          </div>
          <Slider
            label="CALLS PER DAY"
            value={callsPerDay}
            min={1}
            max={10000}
            step={10}
            onChange={function(v) { setCallsPerDay(v); setUseCase("custom"); }}
            format={function(v) { return v.toLocaleString() + " calls"; }}
            color="#10b981"
          />
          <Slider
            label="AVG INPUT TOKENS"
            value={avgInput}
            min={50}
            max={4000}
            step={50}
            onChange={function(v) { setAvgInput(v); setUseCase("custom"); }}
            format={function(v) { return v.toLocaleString() + " tokens"; }}
            color="#60a5fa"
          />
          <Slider
            label="AVG OUTPUT TOKENS"
            value={avgOutput}
            min={50}
            max={2000}
            step={50}
            onChange={function(v) { setAvgOutput(v); setUseCase("custom"); }}
            format={function(v) { return v.toLocaleString() + " tokens"; }}
            color="#f59e0b"
          />

          {/* Period toggle */}
          <div style={{ marginTop: 4 }}>
            <div style={{ fontSize: 10, color: "#555", letterSpacing: "0.1em", marginBottom: 10, fontWeight: "bold" }}>
              BILLING PERIOD
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {["day", "week", "month", "year"].map(function(p) {
                var active = period === p;
                return (
                  <button
                    key={p}
                    onClick={function() { setPeriod(p); }}
                    style={{
                      flex: 1,
                      padding: "8px 4px",
                      border: "1px solid " + (active ? "#10b981" : "#1e1e1e"),
                      background: active ? "#10b98120" : "transparent",
                      color: active ? "#10b981" : "#444",
                      cursor: "pointer",
                      borderRadius: 5,
                      fontSize: 10,
                      fontFamily: "monospace",
                      letterSpacing: "0.06em",
                      transition: "all 0.15s",
                      textTransform: "uppercase"
                    }}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* SETTLEMENT MODE */}
        <div style={{
          background: "#0d0d0d",
          border: "1px solid #1a1a1a",
          borderRadius: 12,
          padding: 20,
          animation: "fadeUp 0.4s ease both",
          animationDelay: "0.1s"
        }}>
          <div style={{ fontSize: 10, color: "#555", letterSpacing: "0.12em", marginBottom: 14, fontWeight: "bold" }}>
            SETTLEMENT MODE
          </div>
          {SETTLEMENT_MODES.map(function(sm) {
            var active = settlementMode === sm.id;
            return (
              <div
                key={sm.id}
                onClick={function() { setSettlementMode(sm.id); }}
                style={{
                  padding: "12px 14px",
                  border: "1px solid " + (active ? sm.color : "#1a1a1a"),
                  background: active ? sm.color + "10" : "transparent",
                  borderRadius: 8,
                  cursor: "pointer",
                  marginBottom: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                  transition: "all 0.15s"
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 11, color: active ? sm.color : "#666", fontFamily: "monospace", fontWeight: "bold" }}>
                      {sm.name}
                    </span>
                    {sm.recommended && (
                      <span style={{ fontSize: 8, color: "#10b981", background: "#10b98115", border: "1px solid #10b98130", padding: "1px 5px", borderRadius: 3, letterSpacing: "0.08em" }}>
                        DEFAULT
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 10, color: "#444", fontFamily: "monospace" }}>{sm.desc}</div>
                </div>
                <div style={{ fontSize: 10, color: sm.color, fontFamily: "monospace", whiteSpace: "nowrap" }}>
                  {sm.gasMult}x gas
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* RIGHT COLUMN - MODEL + RESULTS */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

        {/* RESULTS CARD */}
        <div style={{
          background: "#0d0d0d",
          border: "1px solid " + selectedModel.color + "40",
          borderRadius: 12,
          padding: 24,
          animation: "fadeUp 0.4s ease both",
          animationDelay: "0.02s",
          boxShadow: "0 0 30px " + selectedModel.color + "08"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 10, color: "#555", letterSpacing: "0.12em", marginBottom: 6, fontWeight: "bold" }}>
                ESTIMATED COST / {period.toUpperCase()}
              </div>
              <div style={{ fontSize: 42, fontWeight: "bold", color: "#fff", letterSpacing: "-1px", lineHeight: 1 }}>
                {fmtUsd(result.totalUsd)}
              </div>
              <div style={{ fontSize: 13, color: "#444", marginTop: 6, fontFamily: "monospace" }}>
                {fmtOPG(result.totalOPG)}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, color: selectedModel.color, fontFamily: "monospace", letterSpacing: "0.08em", marginBottom: 4 }}>
                {selectedModel.provider}
              </div>
              <div style={{ fontSize: 14, color: "#fff", fontFamily: "monospace", fontWeight: "bold" }}>
                {selectedModel.name}
              </div>
              <div style={{ fontSize: 10, color: "#444", fontFamily: "monospace", marginTop: 4 }}>
                {totalCalls.toLocaleString()} total calls
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 16 }}>
            <ResultBar
              label="Input tokens cost"
              value={result.inputCostUsd}
              total={result.totalUsd}
              color="#60a5fa"
              formatted={fmtUsd(result.inputCostUsd)}
            />
            <ResultBar
              label="Output tokens cost"
              value={result.outputCostUsd}
              total={result.totalUsd}
              color="#f59e0b"
              formatted={fmtUsd(result.outputCostUsd)}
            />
            <ResultBar
              label={"On-chain gas (" + mode.name + ")"}
              value={result.gasUsd}
              total={result.totalUsd}
              color={mode.color}
              formatted={fmtUsd(result.gasUsd) + " / " + fmtOPG(result.gasOPG)}
            />
          </div>

          {/* Per-call breakdown */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 8,
            marginTop: 16,
            paddingTop: 16,
            borderTop: "1px solid #1a1a1a"
          }}>
            {[
              { label: "Per call", value: fmtUsd(result.totalUsd / totalCalls) },
              { label: "Per 1K calls", value: fmtUsd((result.totalUsd / totalCalls) * 1000) },
              { label: "OPG needed", value: fmtOPG(result.totalOPG) }
            ].map(function(item) {
              return (
                <div key={item.label} style={{
                  background: "#111",
                  border: "1px solid #1a1a1a",
                  borderRadius: 8,
                  padding: "10px 12px",
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: 12, color: "#fff", fontFamily: "monospace", fontWeight: "bold" }}>
                    {item.value}
                  </div>
                  <div style={{ fontSize: 9, color: "#444", fontFamily: "monospace", marginTop: 4, letterSpacing: "0.06em" }}>
                    {item.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* OPG price note */}
          <div style={{
            marginTop: 12,
            padding: "8px 12px",
            background: "#111",
            borderRadius: 6,
            fontSize: 10,
            color: "#333",
            fontFamily: "monospace",
            letterSpacing: "0.04em"
          }}>
            Estimates based on $OPG = ${OPG_PRICE_USD} USD (testnet). Actual costs may vary.
            <a
              href="https://faucet.opengradient.ai"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#10b981", textDecoration: "none", marginLeft: 6 }}
            >
              Get free OPG ->
            </a>
          </div>
        </div>

        {/* MODEL PICKER */}
        <div style={{
          background: "#0d0d0d",
          border: "1px solid #1a1a1a",
          borderRadius: 12,
          padding: 20,
          animation: "fadeUp 0.4s ease both",
          animationDelay: "0.08s"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 10, color: "#555", letterSpacing: "0.12em", fontWeight: "bold" }}>
              SELECT MODEL
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {providers.map(function(p) {
                var active = providerFilter === p;
                return (
                  <button
                    key={p}
                    onClick={function() { setProviderFilter(p); }}
                    style={{
                      fontSize: 9,
                      padding: "3px 8px",
                      border: "1px solid " + (active ? "#10b981" : "#1e1e1e"),
                      background: active ? "#10b98115" : "transparent",
                      color: active ? "#10b981" : "#444",
                      cursor: "pointer",
                      borderRadius: 4,
                      fontFamily: "monospace",
                      letterSpacing: "0.06em",
                      transition: "all 0.15s"
                    }}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 6,
            maxHeight: 280,
            overflowY: "auto"
          }}>
            {filteredModels.map(function(model) {
              return (
                <ModelCard
                  key={model.id}
                  model={model}
                  selected={selectedModel.id === model.id}
                  onClick={function() { setSelectedModel(model); }}
                />
              );
            })}
          </div>
        </div>

        {/* QUICK COMPARE */}
        <div style={{
          background: "#0d0d0d",
          border: "1px solid #1a1a1a",
          borderRadius: 12,
          padding: 20,
          animation: "fadeUp 0.4s ease both",
          animationDelay: "0.12s"
        }}>
          <div style={{ fontSize: 10, color: "#555", letterSpacing: "0.12em", marginBottom: 14, fontWeight: "bold" }}>
            TOP 4 CHEAPEST FOR YOUR CONFIG
          </div>
          {compareResults.map(function(item, i) {
            var isSelected = item.model.id === selectedModel.id;
            return (
              <div
                key={item.model.id}
                onClick={function() { setSelectedModel(item.model); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  marginBottom: 4,
                  borderRadius: 8,
                  cursor: "pointer",
                  background: isSelected ? item.model.color + "10" : "transparent",
                  border: "1px solid " + (isSelected ? item.model.color + "40" : "transparent"),
                  transition: "all 0.15s"
                }}
              >
                <span style={{
                  fontSize: 11,
                  color: i === 0 ? "#10b981" : "#333",
                  fontFamily: "monospace",
                  fontWeight: "bold",
                  minWidth: 20
                }}>
                  #{i + 1}
                </span>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 12, color: isSelected ? "#fff" : "#aaa", fontFamily: "monospace" }}>
                    {item.model.name}
                  </span>
                  <span style={{ fontSize: 9, color: "#333", fontFamily: "monospace", marginLeft: 8 }}>
                    {item.model.provider}
                  </span>
                </div>
                <span style={{
                  fontSize: 13,
                  color: item.model.color,
                  fontFamily: "monospace",
                  fontWeight: "bold"
                }}>
                  {fmtUsd(item.result.totalUsd)}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </div>

    {/* FOOTER */}
    <div style={{
      marginTop: 32,
      paddingTop: 20,
      borderTop: "1px solid #111",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 12
    }}>
      <span style={{ fontSize: 10, color: "#222", fontFamily: "monospace", letterSpacing: "0.1em" }}>
        OPENGRADIENT x402 COST CALCULATOR
      </span>
      <div style={{ display: "flex", gap: 16 }}>
        {[
          { t: "x402 Docs", u: "https://docs.opengradient.ai/developers/x402/" },
          { t: "Python SDK", u: "https://docs.opengradient.ai/developers/sdk/" },
          { t: "opengradient.ai", u: "https://opengradient.ai" }
        ].map(function(lnk) {
          return (
            <a
              key={lnk.u}
              href={lnk.u}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 9,
                color: "#333",
                textDecoration: "none",
                fontFamily: "monospace",
                letterSpacing: "0.08em",
                transition: "color 0.15s"
              }}
              onMouseEnter={function(e) { e.target.style.color = "#10b981"; }}
              onMouseLeave={function(e) { e.target.style.color = "#333"; }}
            >
              {lnk.t}
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
