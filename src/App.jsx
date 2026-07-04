import React, { useState, useEffect, useMemo } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2, ArrowLeft, MapPin, Clock, IndianRupee, Users2 } from "lucide-react";

// ---------- Design tokens ----------
const COLORS = {
  bg: "#FBF5EE",
  card: "#FFFFFF",
  maroon: "#7A1F1F",
  maroonDark: "#5A1616",
  turmeric: "#C97F1F",
  turmericLight: "#F3E1C4",
  ink: "#2B2320",
  inkMuted: "#786B60",
  line: "#E4D9CB",
};

// ---------- Scoring content (mirrors the printed field guide) ----------
const PRODUCT_CATEGORIES = [
  {
    name: "First Puchka Impact",
    why: "Measures instant customer reaction — decides if a first-timer feels \u201Cthis is different.\u201D",
    items: [
      { id: "p1", title: "First Bite Impact", check: "Immediate flavour explosion \u2022 surprise factor \u2022 initial reaction",
        scale: [[0,"Disappointing"],[3,"Weak impression"],[5,"Normal puchka"],[8,"Immediately enjoyable"],[10,"Wow reaction, instantly memorable"]] },
    ],
  },
  {
    name: "Puchka Shell",
    why: "Shell creates texture. It should support filling and pani, not dominate them.",
    items: [
      { id: "p2", title: "Shell Crunch", check: "Clean cracking sound \u2022 crispiness after pani",
        scale: [[0,"Soft/stale, no crunch"],[3,"Weak crunch"],[5,"Normal street crunch"],[8,"Strong crispy bite"],[10,"Loud clean addictive shatter"]] },
      { id: "p3", title: "Shell Texture", check: "Thickness \u2022 airiness \u2022 mouthfeel",
        scale: [[0,"Dense or chewy"],[3,"Thick/heavy"],[5,"Average shell"],[8,"Thin and airy"],[10,"Perfect light shell"]] },
      { id: "p4", title: "Shell Freshness", check: "Oiliness \u2022 staleness \u2022 fresh feeling",
        scale: [[0,"Old/stale"],[3,"Slightly stale"],[5,"Acceptable"],[8,"Fresh"],[10,"Feels freshly prepared"]] },
    ],
  },
  {
    name: "Potato Filling",
    why: "Filling gives depth. Great pani cannot save weak filling.",
    items: [
      { id: "p5", title: "Filling Taste", check: "Spice-potato harmony",
        scale: [[0,"Bland"],[3,"Basic"],[5,"Decent"],[8,"Well seasoned"],[10,"Filling alone tastes amazing"]] },
      { id: "p6", title: "Potato Quality", check: "Freshness \u2022 texture \u2022 starch quality",
        scale: [[0,"Bad/stale/watery"],[3,"Poor texture"],[5,"Acceptable"],[8,"Fresh good potato"],[10,"Perfect texture + absorbs masala"]] },
      { id: "p7", title: "Spice Balance", check: "",
        scale: [[0,"Completely unbalanced"],[3,"One flavour dominates"],[5,"Basic balance"],[8,"Good layering"],[10,"Complex but perfectly balanced"]] },
      { id: "p8", title: "Tanginess", check: "",
        scale: [[0,"Missing"],[3,"Harsh sourness"],[5,"Normal tang"],[8,"Strong enjoyable tang"],[10,"Signature Kolkata craving tang"]] },
      { id: "p9", title: "Heat Level", check: "",
        scale: [[0,"No heat / painful heat"],[3,"Poor chilli balance"],[5,"Normal spicy"],[8,"Controlled kick"],[10,"Heat improves flavour"]] },
    ],
  },
  {
    name: "Puchka Pani",
    why: "Pani creates memory and aftertaste.",
    items: [
      { id: "p10", title: "Pani Quality", check: "Layered, not flat",
        scale: [[0,"Watery/boring"],[3,"Basic sour water"],[5,"Decent"],[8,"Good flavour depth"],[10,"Sour + spice + aroma layers"]] },
      { id: "p11", title: "Tamarind Clarity", check: "",
        scale: [[0,"Bad sourness"],[3,"Acidic"],[5,"Normal imli"],[8,"Clean tamarind taste"],[10,"Deep signature tang"]] },
      { id: "p12", title: "Aroma", check: "",
        scale: [[0,"Stale smell"],[3,"Weak"],[5,"Neutral"],[8,"Fresh herbs noticeable"],[10,"Aroma creates appetite"]] },
      { id: "p13", title: "Aftertaste", check: "",
        scale: [[0,"Bad lingering taste"],[3,"Harsh finish"],[5,"Neutral"],[8,"Pleasant finish"],[10,"Makes you want another bite"]] },
    ],
  },
  {
    name: "Complete Product",
    why: "Final product matters more than individual parts.",
    items: [
      { id: "p14", title: "Shell + Filling + Pani Balance", check: "",
        scale: [[0,"Components mismatch"],[3,"One dominates"],[5,"Works okay"],[8,"Strong combination"],[10,"Perfect harmony"]] },
      { id: "p15", title: "6th Puchka Test", check: "Checks whether excitement survives repetition",
        scale: [[0,"Cannot finish"],[3,"No interest after plate"],[5,"One plate enough"],[8,"Could eat more"],[10,"Want another plate immediately"]] },
      { id: "p16", title: "Craving / Repeat Value", check: "This is the business metric",
        scale: [[0,"Never return"],[3,"Only if nearby"],[5,"Occasionally eat"],[8,"Will come again"],[10,"Will travel for this vendor"]] },
    ],
  },
];

const EXPERIENCE_CATEGORIES = [
  {
    name: "Operations",
    why: "",
    items: [
      { id: "e1", title: "Serving Speed", check: "More customers served without quality loss",
        scale: [[0,"Very slow"],[3,"Unplanned"],[5,"Average"],[8,"Fast service"],[10,"Extremely fast + controlled"]] },
      { id: "e2", title: "Setup Efficiency", check: "Layout \u2022 reachability \u2022 movement",
        scale: [[0,"Messy"],[3,"Poor"],[5,"Works"],[8,"Organized"],[10,"Perfect operating system"]] },
    ],
  },
  {
    name: "Customer Experience",
    why: "",
    items: [
      { id: "e3", title: "Vendor Interaction", check: "",
        scale: [[0,"Rude"],[3,"Cold"],[5,"Normal"],[8,"Friendly"],[10,"Memorable personality"]] },
      { id: "e4", title: "Customer Handling Under Rush", check: "",
        scale: [[0,"Chaos"],[3,"Struggles"],[5,"Manages"],[8,"Smooth"],[10,"Rush feels effortless"]] },
      { id: "e5", title: "Queue Management", check: "",
        scale: [[0,"Confusion"],[3,"Poor"],[5,"Normal"],[8,"Organized"],[10,"High crowd handled smoothly"]] },
    ],
  },
  {
    name: "Hygiene & Presentation",
    why: "",
    items: [
      { id: "e6", title: "Hygiene Perception", check: "Gloves/hands \u2022 covered ingredients \u2022 clean setup",
        scale: [[0,"Avoid eating"],[3,"Issues visible"],[5,"Street acceptable"],[8,"Clean"],[10,"Premium confidence"]] },
      { id: "e7", title: "Ingredient Arrangement", check: "",
        scale: [[0,"Messy/stale looking"],[3,"Poor"],[5,"Normal"],[8,"Fresh looking"],[10,"Display increases appetite"]] },
    ],
  },
  {
    name: "Value",
    why: "",
    items: [
      { id: "e8", title: "Pricing", check: "",
        scale: [[0,"Overpriced"],[3,"Poor value"],[5,"Fair"],[8,"Good value"],[10,"Feels more than expected"]] },
      { id: "e9", title: "Portion Size", check: "",
        scale: [[0,"Unsatisfied"],[3,"Less quantity"],[5,"Expected"],[8,"Good satisfaction"],[10,"Generous + quality maintained"]] },
    ],
  },
];

const PRODUCT_ITEM_COUNT = PRODUCT_CATEGORIES.reduce((a, c) => a + c.items.length, 0); // 16
const EXPERIENCE_ITEM_COUNT = EXPERIENCE_CATEGORIES.reduce((a, c) => a + c.items.length, 0); // 9

const STORAGE_KEY = "puchka-vendors-v1";

function emptyVendor() {
  return {
    id: "v_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8),
    vendorName: "",
    location: "",
    date: "",
    time: "",
    price: "",
    puchkaCount: "",
    reviewer1: "",
    reviewer2: "",
    scores: {}, // itemId -> { r1, r2, notes }
    final: { best: "", weakest: "", copy: "", avoid: "", canWork: "", why: "", lesson: "" },
    createdAt: Date.now(),
  };
}

function scoreTotal(vendor, categories) {
  let sum = 0;
  let count = 0;
  categories.forEach((cat) =>
    cat.items.forEach((item) => {
      const s = vendor.scores[item.id];
      if (s && (s.r1 !== undefined || s.r2 !== undefined)) {
        const r1 = s.r1 ?? s.r2 ?? 0;
        const r2 = s.r2 ?? s.r1 ?? 0;
        sum += (r1 + r2) / 2;
        count += 1;
      }
    })
  );
  return { sum: Math.round(sum * 10) / 10, count };
}

function ScoreButtons({ value, onChange, label }) {
  const options = [0, 3, 5, 8, 10];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.inkMuted, width: 26 }}>{label}</span>
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              minWidth: 40,
              height: 36,
              borderRadius: 9,
              border: "1.5px solid " + (active ? COLORS.maroon : COLORS.line),
              background: active ? COLORS.maroon : "#fff",
              color: active ? "#fff" : COLORS.ink,
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              transition: "all .12s",
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function ItemCard({ item, data, onUpdate }) {
  const r1 = data?.r1;
  const r2 = data?.r2;
  const notes = data?.notes || "";
  return (
    <div style={{ border: "1px solid " + COLORS.line, borderRadius: 12, padding: 12, marginBottom: 10, background: "#fff" }}>
      <div style={{ fontWeight: 700, fontSize: 14.5, color: COLORS.ink, marginBottom: 2 }}>{item.title}</div>
      {item.check && (
        <div style={{ fontSize: 12, color: COLORS.inkMuted, marginBottom: 6 }}>{item.check}</div>
      )}
      <div style={{ fontSize: 11.5, color: COLORS.inkMuted, marginBottom: 8, lineHeight: 1.5 }}>
        {item.scale.map(([s, l], i) => (
          <span key={s}>
            <b style={{ color: COLORS.turmeric }}>{s}</b>={l}
            {i < item.scale.length - 1 ? "  \u00B7  " : ""}
          </span>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 8 }}>
        <ScoreButtons label="R1" value={r1} onChange={(v) => onUpdate(item.id, { r1: v, r2, notes })} />
        <ScoreButtons label="R2" value={r2} onChange={(v) => onUpdate(item.id, { r1, r2: v, notes })} />
      </div>
      <textarea
        placeholder="Why this score / what to copy or avoid..."
        value={notes}
        onChange={(e) => onUpdate(item.id, { r1, r2, notes: e.target.value })}
        style={{
          width: "100%",
          minHeight: 40,
          fontSize: 13,
          padding: 8,
          borderRadius: 8,
          border: "1px solid " + COLORS.line,
          resize: "vertical",
          fontFamily: "inherit",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

function CategoryBlock({ category, vendor, onUpdateItem }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ marginBottom: 14 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: COLORS.turmericLight,
          border: "none",
          borderRadius: 10,
          padding: "10px 12px",
          cursor: "pointer",
        }}
      >
        <div style={{ textAlign: "left" }}>
          <div style={{ fontWeight: 800, fontSize: 13.5, color: COLORS.maroonDark, textTransform: "uppercase", letterSpacing: 0.4 }}>
            {category.name}
          </div>
          {category.why && <div style={{ fontSize: 11, color: COLORS.inkMuted, fontStyle: "italic", marginTop: 2 }}>{category.why}</div>}
        </div>
        {open ? <ChevronUp size={18} color={COLORS.maroonDark} /> : <ChevronDown size={18} color={COLORS.maroonDark} />}
      </button>
      {open && (
        <div style={{ marginTop: 10 }}>
          {category.items.map((item) => (
            <ItemCard key={item.id} item={item} data={vendor.scores[item.id]} onUpdate={onUpdateItem} />
          ))}
        </div>
      )}
    </div>
  );
}

function TextField({ label, value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.inkMuted, marginBottom: 4 }}>{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || ""}
        style={{
          width: "100%",
          padding: "9px 10px",
          borderRadius: 8,
          border: "1px solid " + COLORS.line,
          fontSize: 14,
          boxSizing: "border-box",
          fontFamily: "inherit",
        }}
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.inkMuted, marginBottom: 4 }}>{label}</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || ""}
        style={{
          width: "100%",
          minHeight: 54,
          padding: "9px 10px",
          borderRadius: 8,
          border: "1px solid " + COLORS.line,
          fontSize: 14,
          boxSizing: "border-box",
          fontFamily: "inherit",
          resize: "vertical",
        }}
      />
    </div>
  );
}

export default function App() {
  const [vendors, setVendors] = useState([]);
  const [view, setView] = useState("list"); // 'list' | 'edit'
  const [activeId, setActiveId] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setVendors(JSON.parse(raw));
      }
    } catch (e) {
      // corrupted or missing data — start fresh
    } finally {
      setLoaded(true);
    }
  }, []);

  const persist = (next) => {
    setVendors(next);
    setSaveState("saving");
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 1200);
    } catch (e) {
      setSaveState("idle");
    }
  };

  const activeVendor = useMemo(() => vendors.find((v) => v.id === activeId), [vendors, activeId]);

  const openNewVendor = () => {
    const v = emptyVendor();
    const next = [v, ...vendors];
    persist(next);
    setActiveId(v.id);
    setView("edit");
  };

  const openVendor = (id) => {
    setActiveId(id);
    setView("edit");
  };

  const updateVendorField = (field, value) => {
    const next = vendors.map((v) => (v.id === activeId ? { ...v, [field]: value } : v));
    persist(next);
  };

  const updateItemScore = (itemId, val) => {
    const next = vendors.map((v) =>
      v.id === activeId ? { ...v, scores: { ...v.scores, [itemId]: val } } : v
    );
    persist(next);
  };

  const updateFinal = (field, value) => {
    const next = vendors.map((v) =>
      v.id === activeId ? { ...v, final: { ...v.final, [field]: value } } : v
    );
    persist(next);
  };

  const deleteVendor = (id) => {
    const next = vendors.filter((v) => v.id !== id);
    persist(next);
  };

  if (!loaded) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: COLORS.inkMuted, fontFamily: "system-ui" }}>
        Loading your saved vendors...
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", background: COLORS.bg, minHeight: "100vh" }}>
      {view === "list" ? (
        <ListView vendors={vendors} onOpen={openVendor} onNew={openNewVendor} onDelete={deleteVendor} />
      ) : (
        <EditView
          vendor={activeVendor}
          onBack={() => setView("list")}
          onField={updateVendorField}
          onItem={updateItemScore}
          onFinal={updateFinal}
          saveState={saveState}
        />
      )}
    </div>
  );
}

function ListView({ vendors, onOpen, onNew, onDelete }) {
  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px 40px" }}>
      <div style={{ marginBottom: 4 }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: COLORS.maroon, letterSpacing: -0.3 }}>
          Puchka Field Score Tracker
        </div>
        <div style={{ fontSize: 12.5, color: COLORS.inkMuted, marginTop: 2 }}>
          Benchmark &rarr; Measure &rarr; Learn &rarr; Improve &rarr; Build
        </div>
      </div>

      <button
        onClick={onNew}
        style={{
          width: "100%",
          marginTop: 16,
          marginBottom: 18,
          background: COLORS.maroon,
          color: "#fff",
          border: "none",
          borderRadius: 12,
          padding: "13px 16px",
          fontSize: 15,
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          cursor: "pointer",
        }}
      >
        <Plus size={18} /> Score a New Vendor
      </button>

      {vendors.length === 0 && (
        <div style={{ textAlign: "center", color: COLORS.inkMuted, fontSize: 13.5, marginTop: 40, lineHeight: 1.6 }}>
          No vendors scored yet.<br />Tap &ldquo;Score a New Vendor&rdquo; at your first stall.
        </div>
      )}

      {vendors.map((v) => {
        const prod = scoreTotal(v, PRODUCT_CATEGORIES);
        const exp = scoreTotal(v, EXPERIENCE_CATEGORIES);
        return (
          <div
            key={v.id}
            style={{
              background: "#fff",
              border: "1px solid " + COLORS.line,
              borderRadius: 12,
              padding: 14,
              marginBottom: 10,
              cursor: "pointer",
            }}
            onClick={() => onOpen(v.id)}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15.5, color: COLORS.ink }}>
                  {v.vendorName || "Unnamed vendor"}
                </div>
                <div style={{ fontSize: 12, color: COLORS.inkMuted, marginTop: 2, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {v.location && <span><MapPin size={11} style={{ verticalAlign: -1 }} /> {v.location}</span>}
                  {v.date && <span><Clock size={11} style={{ verticalAlign: -1 }} /> {v.date}</span>}
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); if (confirm('Delete "' + (v.vendorName || "this vendor") + '"?')) onDelete(v.id); }}
                style={{ border: "none", background: "none", color: "#B33", cursor: "pointer", padding: 4 }}
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <div style={{ background: COLORS.turmericLight, borderRadius: 8, padding: "6px 10px", fontSize: 12.5, fontWeight: 700, color: COLORS.maroonDark }}>
                Product: {prod.sum}/{PRODUCT_ITEM_COUNT * 10} ({prod.count}/{PRODUCT_ITEM_COUNT})
              </div>
              <div style={{ background: "#EFEFEF", borderRadius: 8, padding: "6px 10px", fontSize: 12.5, fontWeight: 700, color: COLORS.ink }}>
                Experience: {exp.sum}/{EXPERIENCE_ITEM_COUNT * 10} ({exp.count}/{EXPERIENCE_ITEM_COUNT})
              </div>
            </div>
          </div>
        );
      })}

      {vendors.length > 1 && (
        <div style={{ marginTop: 22 }}>
          <div style={{ fontSize: 12.5, fontWeight: 800, color: COLORS.inkMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.4 }}>
            Comparison
          </div>
          <div style={{ background: "#fff", border: "1px solid " + COLORS.line, borderRadius: 12, overflow: "hidden" }}>
            {vendors
              .map((v) => ({ v, prod: scoreTotal(v, PRODUCT_CATEGORIES).sum }))
              .sort((a, b) => b.prod - a.prod)
              .map(({ v, prod }, i) => (
                <div
                  key={v.id}
                  onClick={() => onOpen(v.id)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    borderTo
