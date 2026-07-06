import { useState, useRef, useEffect, useCallback } from "react";
import { api } from "./api.js";
import { Pencil, ArrowUpRight, ArrowDownLeft, Plus, Minus, Calendar, Phone, Mail, X, Link2, Check, ExternalLink, Video, Trash2 } from "lucide-react";

/* ---------- theme tokens (orange) ---------- */
const C = {
  bg: "#08080a",
  text: "#f4f4f5",
  muted: "#7c7c85",
  faint: "#55555c",
  card: "linear-gradient(160deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 100%)",
  cardBorder: "rgba(255,255,255,0.12)",
  orange: "#ff8a3d",
  orangeBright: "#ffb27a",
  orangeDeep: "#ff6a1f",
  orangeSoft: "rgba(255,138,61,0.12)",
  orangeSoftBorder: "rgba(255,138,61,0.22)",
  red: "#f0674a",
  redSoft: "rgba(240,103,74,0.12)",
  blue: "#5b9bff",
  blueSoft: "rgba(91,155,255,0.14)",
};

const FONT =
  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif";

/* frosted-glass surface reused across every card */
const GLASS = {
  background: C.card,
  border: `1px solid ${C.cardBorder}`,
  backdropFilter: "blur(22px) saturate(150%)",
  WebkitBackdropFilter: "blur(22px) saturate(150%)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.14), inset 0 0 24px rgba(255,138,61,0.05), 0 12px 34px rgba(0,0,0,0.45)",
};

/* ---------- real client data ---------- */
const CLIENTS = [
  { name: "Pascal",          color: "#ff8a3d", mrr: 2500, start: "1 Nov 2025",  status: "good",    adStatus: "Live",     onboarding: "Onboard Complete", priority: "Medium", phone: "0405195248",      email: "pascal.wpservices@gmail.com",     notes: "Nothing to do for now, just need to hit 15 bookings this week", adSpend: 0, leads: 0 },
  { name: "Jinesh",          color: "#a78bfa", mrr: 0,    start: "1 Nov 2025",  status: "neutral", adStatus: "Not Live", onboarding: "Pending",          priority: "Medium", phone: "",                email: "",                                notes: "Assign content posting this week for Owen",                      adSpend: 0, leads: 0 },
  { name: "Imran",           color: "#34d399", mrr: 1200, start: "1 Dec 2025",  status: "good",    adStatus: "Live",     onboarding: "Onboard Complete", priority: "Medium", phone: "0405567178",      email: "imran@khanlegal.com.au",           notes: "10 bookings OR make sure all recent leads are closed",           adSpend: 0, leads: 0 },
  { name: "Kaniq",           color: "#f0674a", mrr: 1200, start: "1 Feb 2026",  status: "at risk", adStatus: "Not Live", onboarding: "Onboard Complete", priority: "Medium", phone: "0451858710",      email: "kaniq.singh@gmail.com",            notes: "",                                                               adSpend: 0, leads: 0 },
  { name: "Vin",             color: "#fb923c", mrr: 0,    start: "2 Mar 2026",  status: "at risk", adStatus: "Not Live", onboarding: "Onboard Complete", priority: "Medium", phone: "0416832295",      email: "vin.neh.lal@gmail.com",            notes: "Follow up",                                                      adSpend: 0, leads: 0 },
  { name: "Chris",           color: "#60a5fa", mrr: 0,    start: "24 Mar 2026", status: "neutral", adStatus: "Not Live", onboarding: "Onboard Complete", priority: "Medium", phone: "0427543942",      email: "chris@adx.com.au",                 notes: "",                                                               adSpend: 0, leads: 0 },
  { name: "Louisa",          color: "#e879f9", mrr: 0,    start: "22 Apr 2026", status: "at risk", adStatus: "Not Live", onboarding: "Onboard Complete", priority: "Medium", phone: "0414083522",      email: "louisa@zippyfinancial.com.au",     notes: "",                                                               adSpend: 0, leads: 0 },
  { name: "Luke",            color: "#4ade80", mrr: 0,    start: "30 May 2026", status: "good",    adStatus: "Live",     onboarding: "Onboard Complete", priority: "Medium", phone: "0411718555",      email: "luke@goalinvest.com.au",           notes: "Look at current ad account and lead list. Once done figure out how lead quality is going, have a chat with Luke see how is feeling - nurture this relationship.", adSpend: 0, leads: 0 },
  { name: "Ali",             color: "#fbbf24", mrr: 1200, start: "9 Jun 2026",  status: "neutral", adStatus: "Not Live", onboarding: "Pending",          priority: "Low",    phone: "0428259463",      email: "eliteglossdetailers@hotmail.com",  notes: "",                                                               adSpend: 0, leads: 0 },
  { name: "Dylan",           color: "#5b9bff", mrr: 1500, start: "11 Jun 2026", status: "neutral", adStatus: "Live",     onboarding: "Onboard Complete", priority: "Medium", phone: "0400132725",      email: "sandfordelectrical@outlook.com",   notes: "Solar guy. The main goal next week is to book 2 calls per day minimum.", adSpend: 0, leads: 0 },
  { name: "Suleiman",        color: "#ff6a1f", mrr: 1000, start: "15 Jun 2026", status: "neutral", adStatus: "Live",     onboarding: "Pending",          priority: "High",   phone: "+61 432 115 549", email: "suleiman302@gmail.com",            notes: "Start calling campaign tomorrow",                                adSpend: 0, leads: 0 },
  { name: "Christian",       color: "#38bdf8", mrr: 1500, start: "17 Jun 2026", status: "good",    adStatus: "Not Live", onboarding: "Pending",          priority: "Medium", phone: "+61 414 373 016", email: "christian@fundd.com.au",           notes: "Need to assess the ads - what is going on with them and how to adjust", adSpend: 0, leads: 0 },
  { name: "Adrian",          color: "#f43f5e", mrr: 1170, start: "23 Jun 2026", status: "at risk", adStatus: "Not Live", onboarding: "Pending",          priority: "Medium", phone: "+61 431 414 650", email: "adrian@mojefinancial.com.au",      notes: "Need to get his ads live",                                       adSpend: 0, leads: 0 },
  { name: "Elias",           color: "#a3e635", mrr: 1250, start: "23 Jun 2026", status: "good",    adStatus: "Not Live", onboarding: "Pending",          priority: "Medium", phone: "+61 478 402 965", email: "elias@settla.com.au",              notes: "Book 2-3 calls per week with this",                              adSpend: 0, leads: 0 },
  { name: "Michael Mfonyam", color: "#c084fc", mrr: 1000, start: "30 Jun 2026", status: "good",    adStatus: "Not Live", onboarding: "Pending",          priority: "Medium", phone: "+17042412097",    email: "mike_aze@yahoo.ca",                notes: "Get his campaign live",                                          adSpend: 0, leads: 0 },
  { name: "Mohammed Ahmed",  color: "#fb7185", mrr: 1500, start: "2 Jul 2026",  status: "good",    adStatus: "Not Live", onboarding: "Pending",          priority: "Medium", phone: "",                email: "",                                 notes: "Organise video shoot, go through onboarding",                   adSpend: 0, leads: 0 },
  { name: "Brendon Hollins", color: "#fdba74", mrr: 1700, start: "3 Jul 2026",  status: "good",    adStatus: "Not Live", onboarding: "Pending",          priority: "Medium", phone: "0401177729",      email: "brendon@cable-co.com.au",          notes: "Get campaign live",                                              adSpend: 0, leads: 0 },
];

const SEED_TASKS = [];

const PRIORITY = {
  High: { label: "High", color: C.red },
  Medium: { label: "Medium", color: C.orange },
  Low: { label: "Low", color: "#7f8aa3" },
};
const PRI_ORDER = ["High", "Medium", "Low"];
const uid = () => "t" + Math.random().toString(36).slice(2, 9);

const STATUS = {
  good: { label: "Good", color: C.orange },
  neutral: { label: "Neutral", color: "#9aa0a8" },
  "at risk": { label: "At risk", color: C.red },
};

const money = (n) => "$" + n.toLocaleString();

const ACTIVITY = [
  { dir: "up", title: "New client signed", meta: "Zippy Financial · Onboarding · Today, 9:12am", value: "+1", pos: true },
  { dir: "down", title: "Campaign launched", meta: "Sandford Electrical · Campaign · Today, 8:04am", value: "3 ads", pos: false },
  { dir: "up", title: "Call booked", meta: "Fundd · Sales · Yesterday", value: "+1 call", pos: true },
  { dir: "up", title: "Lead milestone", meta: "Goal Finance · Leads · 2 Jul", value: "50 leads", pos: true },
  { dir: "down", title: "Onboarding started", meta: "Bright Prestige · Setup · 1 Jul", value: "Setup", pos: false },
];

/* ---------- small pieces ---------- */
function Pill({ children, tone = "orange" }) {
  const map = {
    orange: { bg: C.orangeSoft, bd: C.orangeSoftBorder, fg: C.orangeBright },
    red: { bg: C.redSoft, bd: "rgba(240,103,74,0.22)", fg: "#f5a08e" },
  }[tone];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: map.bg, border: `1px solid ${map.bd}`, color: map.fg,
      borderRadius: 999, padding: "6px 12px", fontSize: 13, fontWeight: 600,
    }}>{children}</span>
  );
}

function StatBox({ dir, label, value }) {
  const cfg = {
    up: { tint: C.orangeSoft, fg: C.orange, Icon: ArrowUpRight },
    down: { tint: C.redSoft, fg: C.red, Icon: ArrowDownLeft },
    neutral: { tint: "rgba(255,255,255,0.06)", fg: "#9aa0a8", Icon: Minus },
  }[dir];
  const { tint, fg, Icon } = cfg;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12, ...GLASS,
      borderRadius: 16, padding: "14px 18px", minWidth: 132,
    }}>
      <span style={{
        width: 34, height: 34, borderRadius: 9, background: tint,
        display: "grid", placeItems: "center",
      }}>
        <Icon size={17} color={fg} strokeWidth={2.4} />
      </span>
      <div style={{ lineHeight: 1.2 }}>
        <div style={{ fontSize: 11, letterSpacing: 1, color: C.muted, fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 18, color: C.text, fontWeight: 700 }}>{value}</div>
      </div>
    </div>
  );
}

function StatusChip({ status, color }) {
  const col = color || STATUS[status]?.color || "#9aa0a8";
  const label = VIBE_LABELS[status] || status;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500,
      color: col, background: col + "1f", border: `1px solid ${col}33`,
      borderRadius: 999, padding: "4px 10px",
    }}>
      <span style={{ width: 7, height: 7, borderRadius: 99, background: col }} />
      {label}
    </span>
  );
}

function ClientIcon({ color, name, size = 44 }) {
  return (
    <span style={{
      width: size, height: size, borderRadius: 12, flexShrink: 0,
      background: `linear-gradient(150deg, ${color}, ${color}bb)`,
      boxShadow: `0 6px 18px ${color}33`,
      display: "grid", placeItems: "center",
      color: "#0a0a0a", fontWeight: 800, fontSize: size * 0.42,
    }}>{name[0]}</span>
  );
}

function MetaRow({ icon: Icon, children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
      <Icon size={13} color={C.faint} style={{ flexShrink: 0 }} />
      <span style={{ fontSize: 12.5, color: C.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{children}</span>
    </div>
  );
}

/* editable set of task pills, reused in cards, table cells and the Tasks tab */
function TaskPills({ tasks, onAdd, onRemove }) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const commit = () => {
    const t = draft.trim();
    if (t && onAdd) onAdd(t);
    setDraft("");
    setAdding(false);
  };
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
      {tasks.map((t) => (
        <span key={t.id} style={{
          display: "inline-flex", alignItems: "center", gap: 6, maxWidth: 260,
          background: C.orangeSoft, border: `1px solid ${C.orangeSoftBorder}`,
          color: C.orangeBright, borderRadius: 999, padding: "5px 10px",
          fontSize: 12.5, fontWeight: 500,
        }}>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.text}</span>
          {onRemove && (
            <button onClick={() => onRemove(t.id)} aria-label="Remove task" style={{
              border: "none", background: "transparent", cursor: "pointer", padding: 0,
              display: "grid", placeItems: "center", color: C.orangeBright, opacity: 0.65,
            }}><X size={12} /></button>
          )}
        </span>
      ))}
      {onAdd && (adding ? (
        <input
          autoFocus value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") { setAdding(false); setDraft(""); }
          }}
          placeholder="New task…"
          style={{
            background: "rgba(255,255,255,0.06)", border: `1px solid ${C.orangeSoftBorder}`,
            color: C.text, borderRadius: 999, padding: "5px 12px", fontSize: 12.5,
            outline: "none", width: 150, fontFamily: FONT,
          }}
        />
      ) : (
        <button onClick={() => setAdding(true)} style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          background: "transparent", border: "1px dashed rgba(255,255,255,0.22)",
          color: C.muted, borderRadius: 999, padding: "5px 10px", fontSize: 12.5, cursor: "pointer",
        }}><Plus size={12} /> Add</button>
      ))}
    </div>
  );
}

function ClientCard({ c, tasks = [], onAdd, onRemove }) {
  return (
    <div style={{
      ...GLASS, borderRadius: 20, padding: 20, minWidth: 300, flex: "1 1 300px",
      display: "flex", flexDirection: "column",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <ClientIcon color={c.color} name={c.name} size={40} />
          <div style={{ lineHeight: 1.3 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{c.name}</div>
            <div style={{ fontSize: 12.5, color: C.orange, fontWeight: 500 }}>{c.contact}</div>
            <div style={{ fontSize: 12, color: C.muted }}>{c.niche}</div>
          </div>
        </div>
        <StatusChip status={c.status} />
      </div>

      {/* MRR + Start */}
      <div style={{ marginTop: 20, display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ ...GLASS, borderRadius: 12, padding: "10px 14px", flex: "1 1 100px" }}>
          <div style={{ fontSize: 10, letterSpacing: 1, color: C.faint, fontWeight: 600, marginBottom: 4 }}>MRR</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.text, letterSpacing: -0.5 }}>{money(c.mrr)}</div>
        </div>
        <div style={{ ...GLASS, borderRadius: 12, padding: "10px 14px", flex: "1 1 100px" }}>
          <div style={{ fontSize: 10, letterSpacing: 1, color: C.faint, fontWeight: 600, marginBottom: 4 }}>START DATE</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{c.start}</div>
        </div>
      </div>

      {/* tasks */}
      <div style={{ marginTop: 18 }}>
        <div style={{ fontSize: 11, letterSpacing: 1, color: C.faint, fontWeight: 600, marginBottom: 9 }}>
          TASKS · {tasks.length}
        </div>
        <TaskPills tasks={tasks} onAdd={onAdd} onRemove={onRemove} />
      </div>

      {/* footer meta */}
      <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", gap: 8 }}>
        <MetaRow icon={Phone}>{c.phone}</MetaRow>
        <MetaRow icon={Mail}>{c.email}</MetaRow>
      </div>
    </div>
  );
}

/* ---------- shell ---------- */
function Header({ saveStatus }) {
  const dot = saveStatus === "saving" ? C.orange : saveStatus === "saved" ? "#34d399" : saveStatus === "error" ? C.red : "transparent";
  const label = saveStatus === "saving" ? "Saving…" : saveStatus === "saved" ? "Saved" : saveStatus === "error" ? "Save failed" : "";
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{
          width: 30, height: 30, borderRadius: 9,
          background: `linear-gradient(150deg, ${C.orange}, ${C.orangeDeep})`,
          boxShadow: `0 4px 14px ${C.orange}55`,
        }} />
        <div style={{ lineHeight: 1.2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 19, fontWeight: 600, color: C.text }}>Roster</span>
            {label && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: dot, fontWeight: 500 }}>
                <span style={{ width: 6, height: 6, borderRadius: 99, background: dot }} />
                {label}
              </span>
            )}
          </div>
          <div style={{ fontSize: 10, color: C.text, fontWeight: 500, letterSpacing: 0.5 }}>v1.50</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          background: "rgba(255,255,255,0.05)", border: `1px solid ${C.cardBorder}`,
          color: C.text, borderRadius: 999, padding: "8px 16px", fontSize: 14, cursor: "pointer",
        }}>
          <Pencil size={14} /> Edit
        </button>
        <span style={{
          width: 34, height: 34, borderRadius: 999, background: "rgba(255,255,255,0.08)",
          border: `1px solid ${C.cardBorder}`, display: "grid", placeItems: "center",
          color: C.text, fontSize: 14, fontWeight: 600,
        }}>H</span>
      </div>
    </div>
  );
}

function Tabs({ tab, setTab }) {
  const items = ["Overview", "Clients", "Tasks", "Settings"];
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 34 }}>
      <div style={{
        display: "inline-flex", gap: 4, padding: 5,
        background: "rgba(255,255,255,0.04)", border: `1px solid ${C.cardBorder}`,
        borderRadius: 999,
      }}>
        {items.map((it) => {
          const active = it === tab;
          return (
            <button key={it} onClick={() => setTab(it)} style={{
              border: "none", cursor: "pointer", borderRadius: 999,
              padding: "9px 22px", fontSize: 14.5, fontWeight: 500,
              color: active ? C.text : C.muted,
              background: active ? "rgba(255,255,255,0.08)" : "transparent",
              boxShadow: active ? "inset 0 0 0 1px rgba(255,255,255,0.06)" : "none",
              transition: "all .15s",
            }}>{it}</button>
          );
        })}
      </div>
    </div>
  );
}

function SectionHead({ title, right }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
      <span style={{ fontSize: 18, fontWeight: 600, color: C.text }}>{title}</span>
      <span style={{ fontSize: 14, color: C.muted }}>{right}</span>
    </div>
  );
}

/* ---------- pages ---------- */
function Overview({ setTab, clients, tasks }) {
  const featured = clients.slice(0, 2);
  return (
    <>
      {/* hero */}
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <div style={{ fontSize: 12, letterSpacing: 3, color: C.faint, fontWeight: 600 }}>
          ACTIVE CLIENTS · SCALBL
        </div>
        <div style={{ marginTop: 18 }}>
          <Pill><span style={{ color: C.orange }}>▲</span> 5 · In pipeline</Pill>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 22, marginTop: 14, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span style={{ fontSize: 108, fontWeight: 800, color: C.text, letterSpacing: -3, lineHeight: 1 }}>27</span>
            <span style={{ fontSize: 40, fontWeight: 700, color: C.faint, marginLeft: 12 }}>clients</span>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, ...GLASS, borderRadius: 999, padding: "10px 16px" }}>
            <span style={{ color: C.orange, fontWeight: 700, fontSize: 15 }}>▲ 2</span>
            <span style={{ color: C.muted, fontSize: 14 }}>· new this month</span>
          </div>
        </div>
        {/* stat boxes */}
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 32 }}>
          <StatBox dir="up" label="GOOD" value="24" />
          <StatBox dir="down" label="AT RISK" value="3" />
        </div>
        {/* dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 34 }}>
          <span style={{ width: 7, height: 7, borderRadius: 99, background: C.text }} />
          <span style={{ width: 7, height: 7, borderRadius: 99, background: "rgba(255,255,255,0.22)" }} />
        </div>
      </div>

      {/* clients preview */}
      <div style={{ marginTop: 64 }}>
        <SectionHead title="Clients" right={
          <span onClick={() => setTab("Clients")} style={{ cursor: "pointer" }}>View all</span>
        } />
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {featured.map((c) => <ClientCard key={c.name} c={c} tasks={tasks.filter((t) => t.client === c.name)} />)}
        </div>
      </div>

      {/* activity */}
      <div style={{ marginTop: 56 }}>
        <SectionHead title="Activity" right="View all" />
        <div style={{ ...GLASS, borderRadius: 20, overflow: "hidden" }}>
          {ACTIVITY.map((a, i) => {
            const up = a.dir === "up";
            const Icon = up ? ArrowUpRight : ArrowDownLeft;
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px 20px",
                borderTop: i === 0 ? "none" : `1px solid rgba(255,255,255,0.05)`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ width: 38, height: 38, borderRadius: 10, background: up ? C.orangeSoft : "rgba(255,255,255,0.05)", display: "grid", placeItems: "center" }}>
                    <Icon size={17} color={up ? C.orange : C.muted} strokeWidth={2.2} />
                  </span>
                  <div style={{ lineHeight: 1.35 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{a.title}</div>
                    <div style={{ fontSize: 12.5, color: C.muted }}>{a.meta}</div>
                  </div>
                </div>
                <span style={{ fontSize: 15, fontWeight: 600, color: a.pos ? C.orange : C.muted }}>{a.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function ViewToggle({ view, setView }) {
  return (
    <div style={{ display: "inline-flex", gap: 3, padding: 3, ...GLASS, borderRadius: 999 }}>
      {["Cards", "Table"].map((v) => {
        const active = v.toLowerCase() === view;
        return (
          <button key={v} onClick={() => setView(v.toLowerCase())} style={{
            border: "none", cursor: "pointer", borderRadius: 999, padding: "6px 16px",
            fontSize: 13, fontWeight: 500,
            color: active ? "#0a0a0a" : C.muted,
            background: active ? `linear-gradient(150deg, ${C.orangeBright}, ${C.orange})` : "transparent",
          }}>{v}</button>
        );
      })}
    </div>
  );
}

const MONTH = { Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11 };
function parseDMY(str) {
  const [d, m, y] = str.trim().split(" ");
  return new Date(+y, MONTH[m], +d);
}
function daysOld(start) {
  try {
    const ms = Date.now() - parseDMY(start).getTime();
    return Math.max(0, Math.floor(ms / 86400000));
  } catch { return null; }
}
function daysColor(d) {
  if (d === null) return C.muted;
  if (d < 60)  return "#34d399"; // fresh — green
  if (d < 120) return C.orange;  // mid — orange
  if (d < 180) return "#ffb27a"; // aging — light orange
  return C.red;                   // long-term risk — red
}

const cellInput = (extra = {}) => ({
  background: "transparent", border: "none", outline: "none",
  color: C.text, fontFamily: FONT, width: "100%", ...extra,
});

const AD_STATUS_ORDER = ["Live", "Not Live"];
const ONBOARDING_ORDER = ["Onboard Complete", "Pending"];
const CLIENT_PRIORITY_ORDER = ["High", "Medium", "Low"];
const CALL_TYPE_ORDER = ["Callout", "Booking", "Transfer", "Callback"];

const DEFAULT_COLORS = {
  vibe:       { "good": "#ff8a3d", "neutral": "#9aa0a8", "at risk": "#f0674a" },
  adStatus:   { "Live": "#34d399", "Not Live": "#9aa0a8" },
  onboarding: { "Onboard Complete": "#5b9bff", "Pending": "#9aa0a8" },
  priority:   { "High": "#f0674a", "Medium": "#ff8a3d", "Low": "#7f8aa3" },
  callType:   { "Callout": "#fbbf24", "Booking": "#34d399", "Transfer": "#5b9bff", "Callback": "#c084fc" },
};

const VIBE_OPTIONS = ["good", "neutral", "at risk"];
const VIBE_LABELS  = { good: "Good", neutral: "Neutral", "at risk": "At risk" };

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}

function chipStyle(color) {
  return { bg: `rgba(${hexToRgb(color)},0.14)`, bd: `rgba(${hexToRgb(color)},0.3)`, fg: color };
}

function BlurInput({ value, onCommit, type = "text", placeholder, style }) {
  const [local, setLocal] = useState(value);
  useEffect(() => { setLocal(value); }, [value]);
  return (
    <input
      type={type}
      value={local}
      placeholder={placeholder}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={() => { if (String(local) !== String(value)) onCommit(local); }}
      onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }}
      style={style}
    />
  );
}

function SelectPicker({ field, value, options, colors, onChangeValue, onChangeColor, labelMap }) {
  const [open, setOpen] = useState(false);
  const [editingColor, setEditingColor] = useState(null);
  const ref = useRef(null);
  const colorInputRef = useRef(null);

  useEffect(() => {
    if (!open) { setEditingColor(null); return; }
    const close = (e) => { if (!ref.current?.contains(e.target)) { setOpen(false); } };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const color = colors[value] || "#9aa0a8";
  const s = chipStyle(color);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-flex" }}>
      <button onClick={() => setOpen((o) => !o)} style={{
        display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer",
        background: s.bg, border: `1px solid ${s.bd}`, color: s.fg,
        borderRadius: 999, padding: "4px 10px", fontSize: 12, fontWeight: 600,
        whiteSpace: "nowrap", fontFamily: FONT,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: 99, background: s.fg, flexShrink: 0 }} />
        {labelMap ? labelMap[value] || value : value}
      </button>

      {open && (
        <div onClick={(e) => e.stopPropagation()} style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 999,
          background: "#1c1c1f", border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 12, padding: 6, display: "flex", flexDirection: "column", gap: 2,
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)", minWidth: 190,
        }}>
          {options.map((opt) => {
            const optColor = colors[opt] || "#9aa0a8";
            const isSelected = opt === value;
            const editing = editingColor === opt;
            return (
              <div key={opt}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "7px 8px", borderRadius: 8,
                  background: isSelected ? `rgba(${hexToRgb(optColor)},0.14)` : "transparent",
                  border: isSelected ? `1px solid rgba(${hexToRgb(optColor)},0.28)` : "1px solid transparent",
                }}>
                  {/* select option */}
                  <span style={{ width: 8, height: 8, borderRadius: 99, background: optColor, flexShrink: 0 }} />
                  <button onClick={() => { onChangeValue(opt); setOpen(false); }} style={{
                    flex: 1, background: "none", border: "none", textAlign: "left", cursor: "pointer",
                    color: optColor, fontSize: 13, fontWeight: 500, fontFamily: FONT, padding: 0,
                  }}>
                    {labelMap ? labelMap[opt] || opt : opt}
                  </button>
                  {/* color edit button */}
                  <button
                    onClick={() => setEditingColor(editing ? null : opt)}
                    title="Edit colour"
                    style={{
                      display: "flex", alignItems: "center", gap: 5, padding: "3px 7px",
                      background: editing ? `rgba(${hexToRgb(optColor)},0.2)` : "rgba(255,255,255,0.07)",
                      border: `1px solid ${editing ? optColor + "55" : "rgba(255,255,255,0.1)"}`,
                      borderRadius: 6, cursor: "pointer", fontFamily: FONT, fontSize: 11,
                      color: editing ? optColor : "#9aa0a8", flexShrink: 0,
                    }}
                  >
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: optColor, display: "inline-block" }} />
                    Edit
                  </button>
                </div>

                {/* inline color editor */}
                {editing && (
                  <div style={{
                    margin: "4px 6px 6px", padding: "10px 12px",
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 9, display: "flex", flexDirection: "column", gap: 8,
                  }}>
                    <div style={{ fontSize: 10, color: "#9aa0a8", fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase" }}>Colour for "{opt}"</div>
                    <input
                      type="color"
                      defaultValue={optColor}
                      onChange={(e) => onChangeColor(field, opt, e.target.value)}
                      style={{ width: "100%", height: 32, borderRadius: 6, border: "none", cursor: "pointer", padding: 0, background: "none" }}
                    />
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 11, color: "#9aa0a8", flexShrink: 0 }}>Hex</span>
                      <input
                        type="text"
                        defaultValue={optColor}
                        maxLength={7}
                        placeholder="#ffffff"
                        onChange={(e) => { if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) onChangeColor(field, opt, e.target.value); }}
                        style={{
                          flex: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                          color: "#fff", borderRadius: 6, padding: "4px 8px", fontSize: 12, fontFamily: "monospace", outline: "none",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const COL_DEFS = [
  { key: "name",       label: "Name",        width: "170px" },
  { key: "notes",      label: "Notes",       width: "280px" },
  { key: "daysOld",    label: "Days Old",    width: "80px"  },
  { key: "vibe",       label: "Client Vibe", width: "120px" },
  { key: "adStatus",   label: "Ad Status",   width: "110px" },
  { key: "onboarding", label: "Onboarding",  width: "170px" },
  { key: "priority",   label: "Priority",    width: "100px" },
  { key: "mrr",        label: "MRR",         width: "90px"  },
  { key: "adSpend",    label: "Ad Spend",    width: "100px" },
  { key: "leads",      label: "Leads",       width: "80px"  },
  { key: "cpl",        label: "CPL",         width: "90px"  },
  { key: "startDate",  label: "Start Date",  width: "120px" },
  { key: "script",     label: "Script",      width: "160px" },
  { key: "callType",   label: "Call Type",   width: "120px" },
  { key: "phone",      label: "Phone",       width: "150px" },
  { key: "email",      label: "Email",       width: "200px" },
  { key: "tasks",      label: "Tasks",       width: "1fr"   },
];

function SortIcon({ dir }) {
  if (!dir) return <span style={{ opacity: 0.25, fontSize: 10, marginLeft: 3 }}>↕</span>;
  return <span style={{ fontSize: 10, marginLeft: 3, color: C.orange }}>{dir === "asc" ? "↑" : "↓"}</span>;
}

function clientSortVal(key, c) {
  switch (key) {
    case "name":       return c.name?.toLowerCase() ?? "";
    case "mrr":        return c.mrr ?? 0;
    case "adSpend":    return c.adSpend ?? 0;
    case "leads":      return c.leads ?? 0;
    case "cpl":        return (c.leads > 0 ? (c.adSpend / c.leads) : 0);
    case "daysOld":    return daysOld(c.start) ?? 0;
    case "vibe":       return ["good","neutral","at risk"].indexOf(c.status);
    case "adStatus":   return c.adStatus ?? "";
    case "onboarding": return c.onboarding ?? "";
    case "priority":   return ["High","Medium","Low"].indexOf(c.priority);
    case "startDate":  return c.start ?? "";
    case "script":     return c.script ?? "";
    case "callType":   return CALL_TYPE_ORDER.indexOf(c.callType ?? "Callout");
    case "phone":      return c.phone ?? "";
    case "email":      return c.email ?? "";
    default:           return "";
  }
}

function ClientTable({ clients, tasks, addTask, removeTask, updateClient, enumColors = DEFAULT_COLORS, updateEnumColor }) {
  const [colOrder, setColOrder] = useState(COL_DEFS.map((c) => c.key));
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [dropIdx, setDropIdx] = useState(null);   // null = not dragging; number = insert-before index
  const draggingKey = useRef(null);
  const didDrag = useRef(false);
  const headerRef = useRef(null);

  const cols = colOrder.map((k) => COL_DEFS.find((d) => d.key === k));
  const grid = cols.map((c) => c.width).join(" ");

  const handleHeaderClick = (key) => {
    if (didDrag.current) return;
    if (key === "tasks" || key === "notes") return;
    if (sortKey === key) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const sortedClients = sortKey
    ? [...clients].sort((a, b) => {
        const av = clientSortVal(sortKey, a);
        const bv = clientSortVal(sortKey, b);
        const cmp = typeof av === "number" ? av - bv : String(av).localeCompare(String(bv));
        return sortDir === "asc" ? cmp : -cmp;
      })
    : clients;

  // Mouse-based drag — avoids all HTML5 drag-and-drop quirks
  const startDrag = useCallback((e, key) => {
    e.preventDefault();
    draggingKey.current = key;
    didDrag.current = false;
    setDropIdx(colOrder.indexOf(key));

    const getDropIdx = (clientX) => {
      if (!headerRef.current) return null;
      const cells = [...headerRef.current.children];
      for (let i = 0; i < cells.length; i++) {
        const r = cells[i].getBoundingClientRect();
        if (clientX < r.left + r.width / 2) return i;
      }
      return cells.length;
    };

    const onMove = (mv) => {
      const idx = getDropIdx(mv.clientX);
      if (idx !== null) { didDrag.current = true; setDropIdx(idx); }
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      const fromIdx = colOrder.indexOf(draggingKey.current);
      const rawTo = getDropIdx(window._lastMouseX ?? 0) ?? fromIdx;
      const toIdx = rawTo > fromIdx ? rawTo - 1 : rawTo;
      if (fromIdx !== toIdx) {
        setColOrder((prev) => {
          const next = [...prev];
          next.splice(fromIdx, 1);
          next.splice(toIdx, 0, draggingKey.current);
          return next;
        });
      }
      draggingKey.current = null;
      setDropIdx(null);
      setTimeout(() => { didDrag.current = false; }, 50);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [colOrder]);

  // track last mouse X for onUp
  useEffect(() => {
    const track = (e) => { window._lastMouseX = e.clientX; };
    window.addEventListener("mousemove", track);
    return () => window.removeEventListener("mousemove", track);
  }, []);

  const renderCell = (colKey, c, cTasks) => {
    switch (colKey) {
      case "name": return (
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <ClientIcon color={c.color} name={c.name} size={30} />
          <BlurInput value={c.name} onCommit={(v) => updateClient(c.name, { name: v })}
            style={{ ...cellInput(), fontSize: 14, fontWeight: 600, minWidth: 0 }} />
        </div>
      );
      case "notes": return (
        <BlurInput value={c.notes || ""} onCommit={(v) => updateClient(c.name, { notes: v })}
          placeholder="Add note…" style={{ ...cellInput({ fontSize: 12.5, color: C.muted }) }} />
      );
      case "daysOld": {
        const d = daysOld(c.start); const col = daysColor(d);
        return <div style={{ fontSize: 14, fontWeight: 700, color: col }}>{d ?? "—"}<span style={{ fontSize: 10, opacity: 0.7, marginLeft: 2 }}>d</span></div>;
      }
      case "vibe": return <SelectPicker field="vibe" value={c.status || "neutral"} options={VIBE_OPTIONS} colors={enumColors.vibe} onChangeValue={(v) => updateClient(c.name, { status: v })} onChangeColor={updateEnumColor} labelMap={VIBE_LABELS} />;
      case "adStatus": return <SelectPicker field="adStatus" value={c.adStatus || "Not Live"} options={AD_STATUS_ORDER} colors={enumColors.adStatus} onChangeValue={(v) => updateClient(c.name, { adStatus: v })} onChangeColor={updateEnumColor} />;
      case "onboarding": return <SelectPicker field="onboarding" value={c.onboarding || "Pending"} options={ONBOARDING_ORDER} colors={enumColors.onboarding} onChangeValue={(v) => updateClient(c.name, { onboarding: v })} onChangeColor={updateEnumColor} />;
      case "priority": return <SelectPicker field="priority" value={c.priority || "Medium"} options={CLIENT_PRIORITY_ORDER} colors={enumColors.priority} onChangeValue={(v) => updateClient(c.name, { priority: v })} onChangeColor={updateEnumColor} />;
      case "mrr": return <BlurInput type="number" value={c.mrr ?? 0} onCommit={(v) => updateClient(c.name, { mrr: Number(v) })} style={{ ...cellInput({ fontSize: 14, fontWeight: 700 }) }} />;
      case "adSpend": return <BlurInput type="number" value={c.adSpend ?? 0} onCommit={(v) => updateClient(c.name, { adSpend: Number(v) })} style={{ ...cellInput({ fontSize: 13, fontWeight: 600 }) }} />;
      case "leads": return <BlurInput type="number" value={c.leads ?? 0} onCommit={(v) => updateClient(c.name, { leads: Number(v) })} style={{ ...cellInput({ fontSize: 13, fontWeight: 600 }) }} />;
      case "cpl": {
        const cpl = (c.leads || 0) > 0 ? ((c.adSpend || 0) / c.leads).toFixed(2) : null;
        return <div style={{ fontSize: 13, fontWeight: 700, color: cpl ? C.orangeBright : C.faint }}>{cpl ? `$${cpl}` : "—"}</div>;
      }
      case "startDate": return <BlurInput value={c.start || ""} onCommit={(v) => updateClient(c.name, { start: v })} style={{ ...cellInput({ fontSize: 13 }) }} />;
      case "script": return (
        <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
          <BlurInput value={c.script || ""} onCommit={(v) => updateClient(c.name, { script: v })}
            placeholder="https://…" style={{ ...cellInput({ fontSize: 12.5, color: C.muted }) }} />
          {c.script && (
            <a href={c.script} target="_blank" rel="noreferrer" style={{ color: C.orange, flexShrink: 0, display: "grid", placeItems: "center" }}>
              <ExternalLink size={13} />
            </a>
          )}
        </div>
      );
      case "callType": return <SelectPicker field="callType" value={c.callType || "Callout"} options={CALL_TYPE_ORDER} colors={enumColors.callType} onChangeValue={(v) => updateClient(c.name, { callType: v })} onChangeColor={updateEnumColor} />;
      case "phone": return <BlurInput value={c.phone || ""} onCommit={(v) => updateClient(c.name, { phone: v })} style={{ ...cellInput({ fontSize: 13, color: C.muted }) }} />;
      case "email": return <BlurInput value={c.email || ""} onCommit={(v) => updateClient(c.name, { email: v })} style={{ ...cellInput({ fontSize: 13, color: C.muted }) }} />;
      case "tasks": return <TaskPills tasks={cTasks} onAdd={(t) => addTask(c.name, t)} onRemove={(id) => removeTask(id)} />;
      default: return null;
    }
  };

  return (
    <div style={{ ...GLASS, borderRadius: 20, overflow: "hidden" }}>
      <div className="glass-scroll" style={{ overflowX: "auto" }}>
        <div style={{ minWidth: 2200 }}>
          {/* header — drag to reorder, click to sort */}
          <div
            ref={headerRef}
            style={{ position: "relative", display: "grid", gridTemplateColumns: grid, gap: 12, padding: "12px 32px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
          >
            {cols.map((col, i) => (
              <div
                key={col.key}
                onMouseDown={(e) => startDrag(e, col.key)}
                onClick={() => handleHeaderClick(col.key)}
                style={{
                  position: "relative",
                  fontSize: 11, letterSpacing: 1, fontWeight: 600,
                  color: sortKey === col.key ? C.orange : C.muted,
                  textTransform: "uppercase", cursor: "grab", userSelect: "none",
                  borderBottom: sortKey === col.key ? `2px solid ${C.orange}55` : "2px solid transparent",
                  paddingBottom: 2, transition: "color .15s, border-color .15s",
                  display: "flex", alignItems: "center",
                  opacity: draggingKey.current === col.key ? 0.4 : 1,
                }}
              >
                {/* drop indicator line — appears before this column */}
                {dropIdx === i && draggingKey.current !== col.key && (
                  <div style={{
                    position: "absolute", left: -8, top: -4, bottom: -4, width: 2,
                    background: C.orange, borderRadius: 2,
                    boxShadow: `0 0 6px ${C.orange}`,
                    pointerEvents: "none",
                  }} />
                )}
                {col.label}
                {col.key !== "tasks" && col.key !== "notes" && (
                  <SortIcon dir={sortKey === col.key ? sortDir : null} />
                )}
              </div>
            ))}
            {/* drop indicator at the very end */}
            {dropIdx === cols.length && (
              <div style={{
                position: "absolute", right: 24, top: 4, bottom: 4, width: 2,
                background: C.orange, borderRadius: 2,
                boxShadow: `0 0 6px ${C.orange}`,
                pointerEvents: "none",
              }} />
            )}
          </div>
          {/* rows */}
          {sortedClients.map((c, i) => {
            const cTasks = tasks.filter((t) => t.client === c.name);
            return (
              <div key={c.name} style={{
                display: "grid", gridTemplateColumns: grid, alignItems: "center", gap: 12,
                padding: "12px 32px", borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.05)",
              }}>
                {cols.map((col) => (
                  <div key={col.key}>{renderCell(col.key, c, cTasks)}</div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ClientsPage({ clients, tasks, addTask, removeTask, updateClient, enumColors, updateEnumColor }) {
  const [view, setView] = useState("table");
  const counts = clients.reduce((m, c) => ({ ...m, [c.status]: (m[c.status] || 0) + 1 }), {});
  return (
    <>
      {/* hero */}
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <div style={{ fontSize: 12, letterSpacing: 3, color: C.faint, fontWeight: 600 }}>ALL CLIENTS · SCALBL</div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", marginTop: 14 }}>
          <span style={{ fontSize: 88, fontWeight: 800, color: C.text, letterSpacing: -2, lineHeight: 1 }}>{clients.length}</span>
          <span style={{ fontSize: 34, fontWeight: 700, color: C.faint, marginLeft: 12 }}>total</span>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 30, flexWrap: "wrap" }}>
          <StatBox dir="up" label="GOOD" value={counts["good"] || 0} />
          <StatBox dir="neutral" label="NEUTRAL" value={counts["neutral"] || 0} />
          <StatBox dir="down" label="AT RISK" value={counts["at risk"] || 0} />
        </div>
      </div>

      {/* grid */}
      <div style={{ marginTop: 60 }}>
        <SectionHead
          title="Clients"
          right={
            <span style={{ display: "inline-flex", alignItems: "center", gap: 16 }}>
              <ViewToggle view={view} setView={setView} />
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7, color: C.orangeBright, cursor: "pointer" }}>
                <Plus size={15} /> Add client
              </span>
            </span>
          }
        />
        {view === "cards" ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            {clients.map((c) => (
              <ClientCard
                key={c.name} c={c}
                tasks={tasks.filter((t) => t.client === c.name)}
                onAdd={(t) => addTask(c.name, t)}
                onRemove={(id) => removeTask(id)}
              />
            ))}
          </div>
        ) : (
          <ClientTable clients={clients} tasks={tasks} addTask={addTask} removeTask={removeTask} updateClient={updateClient} enumColors={enumColors} updateEnumColor={updateEnumColor} />
        )}
      </div>
    </>
  );
}

/* ---------- task table cells ---------- */
function PriorityChip({ value, onChange }) {
  const p = PRIORITY[value] || PRIORITY.Medium;
  return (
    <button
      onClick={() => onChange(PRI_ORDER[(PRI_ORDER.indexOf(value) + 1) % PRI_ORDER.length])}
      title="Click to cycle priority"
      style={{
        display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer",
        background: p.color + "1f", border: `1px solid ${p.color}33`, color: p.color,
        borderRadius: 999, padding: "4px 11px", fontSize: 12.5, fontWeight: 600,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: 99, background: p.color }} />
      {p.label}
    </button>
  );
}

function DueCell({ value, onChange }) {
  return (
    <input
      type="date" value={value || ""} onChange={(e) => onChange(e.target.value)}
      style={{
        background: "rgba(255,255,255,0.05)", border: `1px solid ${C.cardBorder}`,
        color: value ? C.text : C.muted, borderRadius: 8, padding: "6px 8px",
        fontSize: 12.5, fontFamily: FONT, colorScheme: "dark", outline: "none",
        width: "100%", maxWidth: 148,
      }}
    />
  );
}

function LoomCell({ value, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
      <Video size={14} color={value ? C.orange : C.faint} style={{ flexShrink: 0 }} />
      <input
        value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="Loom URL"
        style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", color: C.text, fontSize: 12.5, outline: "none", fontFamily: FONT }}
      />
      {value ? (
        <a href={value} target="_blank" rel="noreferrer" style={{ display: "grid", placeItems: "center", color: C.muted, flexShrink: 0 }}>
          <ExternalLink size={13} />
        </a>
      ) : null}
    </div>
  );
}

function DepsCell({ deps, onOpen }) {
  const n = deps.length;
  return (
    <button onClick={onOpen} style={{
      display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer",
      background: n ? C.orangeSoft : "transparent",
      border: n ? `1px solid ${C.orangeSoftBorder}` : "1px dashed rgba(255,255,255,0.22)",
      color: n ? C.orangeBright : C.muted,
      borderRadius: 999, padding: "5px 11px", fontSize: 12.5, fontWeight: 500,
    }}>
      <Link2 size={12} /> {n ? `${n} linked` : "Link"}
    </button>
  );
}

function DepsModal({ task, allTasks, onToggle, onClose }) {
  const others = allTasks.filter((t) => t.id !== task.id);
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
      backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)",
      display: "grid", placeItems: "center", zIndex: 50, padding: 20,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        ...GLASS, borderRadius: 20, width: "100%", maxWidth: 460, maxHeight: "80vh",
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        <div style={{ padding: "18px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 11, letterSpacing: 1, color: C.faint, fontWeight: 600 }}>DEPENDS ON</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginTop: 4 }}>{task.text || "Untitled task"}</div>
        </div>
        <div style={{ overflowY: "auto", padding: 8 }}>
          {others.length === 0 && (
            <div style={{ padding: 20, color: C.muted, fontSize: 13 }}>No other tasks to link yet.</div>
          )}
          {others.map((o) => {
            const on = task.deps.includes(o.id);
            return (
              <button key={o.id} onClick={() => onToggle(o.id)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12, textAlign: "left",
                background: on ? C.orangeSoft : "transparent", border: "none", cursor: "pointer",
                borderRadius: 12, padding: "11px 12px",
              }}>
                <span style={{
                  width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                  border: `1px solid ${on ? C.orange : "rgba(255,255,255,0.25)"}`,
                  background: on ? C.orange : "transparent", display: "grid", placeItems: "center",
                }}>
                  {on && <Check size={13} color="#0a0a0a" strokeWidth={3} />}
                </span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 13.5, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{o.text || "Untitled task"}</span>
                  <span style={{ display: "block", fontSize: 11.5, color: C.muted }}>{o.client}</span>
                </span>
              </button>
            );
          })}
        </div>
        <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            background: `linear-gradient(150deg, ${C.orangeBright}, ${C.orange})`, color: "#0a0a0a",
            border: "none", borderRadius: 999, padding: "9px 20px", fontSize: 13.5, fontWeight: 600, cursor: "pointer",
          }}>Done</button>
        </div>
      </div>
    </div>
  );
}

const selectStyle = {
  background: "rgba(255,255,255,0.06)", border: `1px solid ${C.cardBorder}`, color: C.text,
  borderRadius: 10, padding: "9px 12px", fontSize: 13.5, fontFamily: FONT, outline: "none",
  colorScheme: "dark", cursor: "pointer",
};

const TASK_COLS = [
  { key: "text",     label: "Task" },
  { key: "client",   label: "Client" },
  { key: "priority", label: "Priority" },
  { key: "due",      label: "Due date" },
  { key: "deps",     label: "Dependencies" },
  { key: "loom",     label: "Loom" },
  { key: "_del",     label: "" },
];
const TASK_GRID = "2.1fr 1.3fr 1fr 1.4fr 1.5fr 1.5fr 0.4fr";

function taskSortVal(key, t) {
  switch (key) {
    case "text":     return t.text?.toLowerCase() ?? "";
    case "client":   return t.client?.toLowerCase() ?? "";
    case "priority": return ["High","Medium","Low"].indexOf(t.priority ?? "Medium");
    case "due":      return t.due ? new Date(t.due).getTime() : Infinity;
    default:         return "";
  }
}

function TasksPage({ clients, tasks, addTask, removeTask, updateTask }) {
  const [depsFor, setDepsFor] = useState(null);
  const [newClient, setNewClient] = useState(clients[0]?.name || "");
  const [newText, setNewText] = useState("");
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const byName = Object.fromEntries(clients.map((c) => [c.name, c]));
  const activeTask = tasks.find((t) => t.id === depsFor) || null;

  const handleHeaderClick = (key) => {
    if (key === "deps" || key === "loom" || key === "_del") return;
    if (sortKey === key) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const sortedTasks = sortKey
    ? [...tasks].sort((a, b) => {
        const av = taskSortVal(sortKey, a);
        const bv = taskSortVal(sortKey, b);
        const cmp = typeof av === "number" ? av - bv : String(av).localeCompare(String(bv));
        return sortDir === "asc" ? cmp : -cmp;
      })
    : tasks;

  const cols = TASK_COLS;
  const grid = TASK_GRID;

  const commitNew = () => {
    const t = newText.trim();
    if (t && newClient) { addTask(newClient, t); setNewText(""); }
  };

  return (
    <>
      {/* hero */}
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <div style={{ fontSize: 12, letterSpacing: 3, color: C.faint, fontWeight: 600 }}>OPEN TASKS · SCALBL</div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", marginTop: 14 }}>
          <span style={{ fontSize: 88, fontWeight: 800, color: C.text, letterSpacing: -2, lineHeight: 1 }}>{tasks.length}</span>
          <span style={{ fontSize: 34, fontWeight: 700, color: C.faint, marginLeft: 12 }}>tasks</span>
        </div>
        <div style={{ marginTop: 12, fontSize: 13.5, color: C.muted }}>Across {new Set(tasks.map((t) => t.client)).size} clients</div>
      </div>

      {/* table */}
      <div style={{ marginTop: 56 }}>
        <SectionHead title="All tasks" right={`${tasks.length} open`} />
        <div style={{ ...GLASS, borderRadius: 20, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <div style={{ minWidth: 1260 }}>
              <div style={{ display: "grid", gridTemplateColumns: grid, padding: "14px 22px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                {cols.map((col) => (
                  <span
                    key={col.key}
                    onClick={() => handleHeaderClick(col.key)}
                    style={{
                      fontSize: 11, letterSpacing: 1, fontWeight: 600, textTransform: "uppercase",
                      color: sortKey === col.key ? C.orange : C.muted,
                      cursor: col.key !== "deps" && col.key !== "loom" && col.key !== "_del" ? "pointer" : "default",
                      userSelect: "none", display: "inline-flex", alignItems: "center",
                      borderBottom: sortKey === col.key ? `2px solid ${C.orange}55` : "2px solid transparent",
                      paddingBottom: 2,
                    }}
                  >
                    {col.label}
                    {col.key !== "deps" && col.key !== "loom" && col.key !== "_del" && (
                      <SortIcon dir={sortKey === col.key ? sortDir : null} />
                    )}
                  </span>
                ))}
              </div>
              {sortedTasks.map((t, i) => {
                const c = byName[t.client];
                return (
                  <div key={t.id} style={{
                    display: "grid", gridTemplateColumns: grid, alignItems: "center", gap: 10,
                    padding: "12px 22px", borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.05)",
                  }}>
                    {/* task = primary column */}
                    <input
                      value={t.text} onChange={(e) => updateTask(t.id, { text: e.target.value })}
                      placeholder="Task name…"
                      style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 14.5, fontWeight: 600, fontFamily: FONT }}
                    />
                    {/* client */}
                    <div style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0, position: "relative" }}>
                      <ClientIcon color={c?.color || "#9aa0a8"} name={t.client} size={26} />
                      <select
                        value={t.client}
                        onChange={(e) => updateTask(t.id, { client: e.target.value })}
                        style={{
                          position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%",
                        }}
                      >
                        {clients.map((cl) => <option key={cl.name} value={cl.name}>{cl.name}</option>)}
                      </select>
                      <span style={{ fontSize: 13, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.client}</span>
                    </div>
                    {/* priority */}
                    <div><PriorityChip value={t.priority} onChange={(p) => updateTask(t.id, { priority: p })} /></div>
                    {/* due */}
                    <DueCell value={t.due} onChange={(v) => updateTask(t.id, { due: v })} />
                    {/* dependencies */}
                    <div><DepsCell deps={t.deps} onOpen={() => setDepsFor(t.id)} /></div>
                    {/* loom */}
                    <LoomCell value={t.loom} onChange={(v) => updateTask(t.id, { loom: v })} />
                    {/* delete */}
                    <button onClick={() => removeTask(t.id)} aria-label="Delete task" style={{
                      border: "none", background: "transparent", cursor: "pointer", color: C.faint,
                      display: "grid", placeItems: "center", justifySelf: "end",
                    }}><Trash2 size={15} /></button>
                  </div>
                );
              })}
            </div>
          </div>
          {/* add task bar */}
          <div style={{ display: "flex", gap: 12, alignItems: "center", padding: "14px 22px", borderTop: "1px solid rgba(255,255,255,0.08)", flexWrap: "wrap" }}>
            <select value={newClient} onChange={(e) => setNewClient(e.target.value)} style={selectStyle}>
              {clients.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
            <input
              value={newText} onChange={(e) => setNewText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && commitNew()}
              placeholder="Add a task…"
              style={{ flex: 1, minWidth: 180, background: "rgba(255,255,255,0.06)", border: `1px solid ${C.cardBorder}`, color: C.text, borderRadius: 10, padding: "9px 14px", fontSize: 13.5, outline: "none", fontFamily: FONT }}
            />
            <button onClick={commitNew} style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: `linear-gradient(150deg, ${C.orangeBright}, ${C.orange})`, color: "#0a0a0a",
              border: "none", borderRadius: 10, padding: "9px 18px", fontSize: 13.5, fontWeight: 600, cursor: "pointer",
            }}><Plus size={15} /> Add task</button>
          </div>
        </div>
      </div>

      {activeTask && (
        <DepsModal
          task={activeTask} allTasks={tasks}
          onToggle={(depId) => {
            const has = activeTask.deps.includes(depId);
            updateTask(activeTask.id, { deps: has ? activeTask.deps.filter((d) => d !== depId) : [...activeTask.deps, depId] });
          }}
          onClose={() => setDepsFor(null)}
        />
      )}
    </>
  );
}


/* ---------- auth screen ---------- */
function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputStyle = {
    width: "100%", background: "rgba(255,255,255,0.06)", border: `1px solid ${C.cardBorder}`,
    color: C.text, borderRadius: 12, padding: "12px 16px", fontSize: 14.5,
    outline: "none", fontFamily: FONT, boxSizing: "border-box",
  };

  const submit = async () => {
    setError(""); setLoading(true);
    try {
      const fn = mode === "signup"
        ? api.signup({ name: name.trim(), username: username.trim(), password })
        : api.login({ username: username.trim(), password });
      const user = await fn;
      api.saveToken(user.token);
      onLogin(user);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", width: "100%", fontFamily: FONT, color: C.text,
      display: "grid", placeItems: "center",
      background: `radial-gradient(1200px 640px at 8% -8%, rgba(255,138,61,0.42), transparent 56%),
                   radial-gradient(760px 520px at 30% 4%, rgba(255,90,20,0.22), transparent 50%),
                   ${C.bg}`,
    }}>
      <div style={{ width: "100%", maxWidth: 400, padding: "0 24px" }}>
        {/* logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", marginBottom: 40 }}>
          <span style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(150deg, ${C.orange}, ${C.orangeDeep})`, boxShadow: `0 4px 18px ${C.orange}55` }} />
          <span style={{ fontSize: 22, fontWeight: 700, color: C.text }}>Roster</span>
        </div>

        <div style={{ ...GLASS, borderRadius: 24, padding: 32 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 6 }}>
            {mode === "login" ? "Welcome back" : "Create account"}
          </div>
          <div style={{ fontSize: 13.5, color: C.muted, marginBottom: 28 }}>
            {mode === "login" ? "Sign in to access your roster." : "Set up your account to get started."}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {mode === "signup" && (
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" style={inputStyle} />
            )}
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username"
              onKeyDown={(e) => e.key === "Enter" && submit()} style={inputStyle} />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
              onKeyDown={(e) => e.key === "Enter" && submit()} style={inputStyle} />
          </div>

          {error && <div style={{ marginTop: 14, fontSize: 13, color: C.red }}>{error}</div>}

          <button onClick={submit} style={{
            marginTop: 22, width: "100%", padding: "13px 0", fontSize: 15, fontWeight: 700,
            background: `linear-gradient(150deg, ${C.orangeBright}, ${C.orange})`, color: "#0a0a0a",
            border: "none", borderRadius: 12, cursor: "pointer",
          }}>
            {loading ? "…" : mode === "login" ? "Sign in" : "Create account"}
          </button>

          <div style={{ marginTop: 20, textAlign: "center", fontSize: 13.5, color: C.muted }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <span onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
              style={{ color: C.orange, cursor: "pointer", fontWeight: 600 }}>
              {mode === "login" ? "Sign up" : "Sign in"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- settings ---------- */
const ACTION_LABEL = {
  signed_up:      { label: "Signed up",    color: "#34d399" },
  logged_in:      { label: "Logged in",    color: "#5b9bff" },
  client_added:   { label: "Client added", color: "#34d399" },
  client_removed: { label: "Client removed", color: C.red   },
  client_change:  { label: "Client edit",  color: C.orange  },
  task_added:     { label: "Task added",   color: "#a78bfa" },
  task_removed:   { label: "Task removed", color: "#f0674a" },
  task_change:    { label: "Task edit",    color: "#c084fc" },
};

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60); if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function SettingsPage({ user }) {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [debugData, setDebugData] = useState(null);
  const [loadingDebug, setLoadingDebug] = useState(false);
  const [curPw, setCurPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confPw, setConfPw] = useState("");
  const [pwMsg, setPwMsg] = useState(null); // { ok, text }
  const [pwLoading, setPwLoading] = useState(false);

  const fetchLogs = useCallback(() => {
    setLoadingLogs(true);
    api.getLogs()
      .then(setLogs)
      .catch(() => setLogs([]))
      .finally(() => setLoadingLogs(false));
  }, []);

  useEffect(() => {
    api.getUsers()
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoadingUsers(false));
    fetchLogs();
  }, [fetchLogs]);

  const changePassword = async () => {
    if (!curPw || !newPw || !confPw) { setPwMsg({ ok: false, text: "All fields required." }); return; }
    if (newPw !== confPw) { setPwMsg({ ok: false, text: "New passwords don't match." }); return; }
    if (newPw.length < 6) { setPwMsg({ ok: false, text: "New password must be at least 6 characters." }); return; }
    setPwLoading(true); setPwMsg(null);
    try {
      await api.changePassword({ currentPassword: curPw, newPassword: newPw });
      setPwMsg({ ok: true, text: "Password changed successfully." });
      setCurPw(""); setNewPw(""); setConfPw("");
    } catch (e) {
      setPwMsg({ ok: false, text: e.message });
    } finally { setPwLoading(false); }
  };

  const fieldStyle = {
    width: "100%", background: "rgba(255,255,255,0.06)", border: `1px solid ${C.cardBorder}`,
    color: C.text, borderRadius: 10, padding: "10px 14px", fontSize: 14,
    outline: "none", fontFamily: FONT, boxSizing: "border-box",
  };

  return (
    <div style={{ marginTop: 48, display: "grid", gap: 28, maxWidth: 780 }}>
      {/* team members */}
      <div style={{ ...GLASS, borderRadius: 20, padding: 28 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 20 }}>Team Members</div>
        {loadingUsers
          ? <div style={{ color: C.muted, fontSize: 13 }}>Loading…</div>
          : users.length === 0
            ? <div style={{ color: C.muted, fontSize: 13 }}>No users found.</div>
            : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {users.map((u) => (
                  <div key={u.username} style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "10px 14px", borderRadius: 12,
                    background: "rgba(255,255,255,0.04)", border: `1px solid rgba(255,255,255,0.07)`,
                  }}>
                    <span style={{
                      width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                      background: `linear-gradient(150deg, ${C.orange}, ${C.orangeDeep})`,
                      display: "grid", placeItems: "center",
                      fontSize: 14, fontWeight: 800, color: "#0a0a0a",
                    }}>{u.name[0]}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{u.name}</div>
                      <div style={{ fontSize: 12, color: C.muted }}>@{u.username}</div>
                    </div>
                    {u.username === user.username && (
                      <span style={{ marginLeft: "auto", fontSize: 11, color: C.orange, fontWeight: 600, letterSpacing: 1 }}>YOU</span>
                    )}
                  </div>
                ))}
              </div>
            )
        }
      </div>

      {/* change password */}
      <div style={{ ...GLASS, borderRadius: 20, padding: 28 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 20 }}>Change Password</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 380 }}>
          <input type="password" placeholder="Current password" value={curPw} onChange={(e) => setCurPw(e.target.value)} style={fieldStyle} />
          <input type="password" placeholder="New password" value={newPw} onChange={(e) => setNewPw(e.target.value)} style={fieldStyle} />
          <input type="password" placeholder="Confirm new password" value={confPw} onChange={(e) => setConfPw(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && changePassword()} style={fieldStyle} />
          {pwMsg && (
            <div style={{ fontSize: 13, color: pwMsg.ok ? "#34d399" : C.red, fontWeight: 500 }}>{pwMsg.text}</div>
          )}
          <button onClick={changePassword} disabled={pwLoading} style={{
            background: `linear-gradient(150deg, ${C.orangeBright}, ${C.orange})`,
            color: "#0a0a0a", border: "none", borderRadius: 10,
            padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer",
            opacity: pwLoading ? 0.6 : 1, alignSelf: "flex-start",
          }}>{pwLoading ? "Saving…" : "Update Password"}</button>
        </div>
      </div>

      {/* debug */}
      <div style={{ ...GLASS, borderRadius: 20, padding: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>Blob Debug</div>
          <button onClick={() => { setLoadingDebug(true); api.getDebug().then(setDebugData).catch((e) => setDebugData({ error: e.message })).finally(() => setLoadingDebug(false)); }}
            style={{ background: "rgba(255,255,255,0.07)", border: `1px solid ${C.cardBorder}`, color: C.muted, borderRadius: 8, padding: "4px 10px", fontSize: 12, cursor: "pointer", fontFamily: FONT }}>
            {loadingDebug ? "Checking…" : "Check Blob"}
          </button>
        </div>
        {debugData && (
          <pre style={{ fontSize: 11, color: C.muted, fontFamily: "monospace", whiteSpace: "pre-wrap", wordBreak: "break-all", margin: 0 }}>
            {JSON.stringify(debugData, null, 2)}
          </pre>
        )}
      </div>

      {/* activity log */}
      <div style={{ ...GLASS, borderRadius: 20, padding: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>Activity Log</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12, color: C.muted }}>{logs.length} events</span>
            <button onClick={fetchLogs} style={{ background: "rgba(255,255,255,0.07)", border: `1px solid ${C.cardBorder}`, color: C.muted, borderRadius: 8, padding: "4px 10px", fontSize: 12, cursor: "pointer", fontFamily: FONT }}>
              Refresh
            </button>
          </div>
        </div>
        {loadingLogs
          ? <div style={{ color: C.muted, fontSize: 13 }}>Loading…</div>
          : logs.length === 0
            ? <div style={{ color: C.muted, fontSize: 13 }}>No activity yet.</div>
            : (
              <div style={{ display: "flex", flexDirection: "column", maxHeight: 480, overflowY: "auto" }} className="glass-scroll">
                {logs.map((log, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16,
                    padding: "8px 2px",
                    borderBottom: i < logs.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  }}>
                    <span style={{ fontSize: 13, color: C.text, lineHeight: 1.5 }}>
                      <span style={{ color: C.orange, fontWeight: 600 }}>@{log.user}</span>
                      {" — "}
                      {log.detail}
                    </span>
                    <span style={{ fontSize: 11, color: C.faint, whiteSpace: "nowrap", flexShrink: 0 }}>{timeAgo(log.ts)}</span>
                  </div>
                ))}
              </div>
            )
        }
      </div>
    </div>
  );
}

/* ---------- root ---------- */
export default function Roster() {
  const [user, setUser] = useState(() => api.hasToken() ? { name: "", username: "" } : null);
  const [tab, setTab] = useState("Overview");
  const [clients, setClients] = useState(CLIENTS);
  const [tasks, setTasks]     = useState(SEED_TASKS);
  const [ready, setReady]     = useState(false);
  const [enumColors, setEnumColors] = useState(() => ({ ...DEFAULT_COLORS }));
  const [saveStatus, setSaveStatus] = useState(null); // null | "saving" | "saved" | "error"
  const saveStatusTimer = useRef(null);

  /* load shared data once logged in */
  useEffect(() => {
    if (!user) return;
    Promise.all([api.getClients(), api.getTasks(), api.getSettings()])
      .then(([c, t, s]) => {
        if (c.length) {
          setClients(c);
        } else {
          // Blob is empty — seed with default clients so PATCH can find them
          api.putClients({ clients: CLIENTS, changes: [] }).catch(() => {});
        }
        if (t.length) setTasks(t);
        if (s?.enumColors) setEnumColors((prev) => ({ ...prev, ...s.enumColors }));
        setReady(true);
      })
      .catch(() => setReady(true));
  }, [user?.username]);

  /* poll for remote changes every 20 seconds — skip if we have a pending local save */
  useEffect(() => {
    if (!user) return;
    const id = setInterval(() => {
      if (clientSaveTimer.current || taskSaveTimer.current) return;
      api.getClients().then((c) => { if (c.length) setClients(c); }).catch(() => {});
      api.getTasks().then((t) => { if (t.length) setTasks(t); }).catch(() => {});
    }, 20000);
    return () => clearInterval(id);
  }, [user?.username]);

  const clientsRef = useRef(clients);
  const tasksRef   = useRef(tasks);
  useEffect(() => { clientsRef.current = clients; }, [clients]);
  useEffect(() => { tasksRef.current   = tasks;   }, [tasks]);

  const clientSaveTimer      = useRef(null);
  const taskSaveTimer        = useRef(null);
  const pendingClientChanges = useRef([]);
  const pendingClientPatches = useRef({});
  const pendingTaskChanges   = useRef([]);

  const showSaveStatus = useCallback((status) => {
    setSaveStatus(status);
    if (saveStatusTimer.current) clearTimeout(saveStatusTimer.current);
    if (status === "saved" || status === "error") {
      saveStatusTimer.current = setTimeout(() => setSaveStatus(null), 3000);
    }
  }, []);

  const flushClients = useCallback(() => {
    clientSaveTimer.current = null;
    const patches = pendingClientPatches.current;
    const changes = pendingClientChanges.current;
    pendingClientPatches.current = {};
    pendingClientChanges.current = [];
    const names = Object.keys(patches);
    if (!names.length) return;
    showSaveStatus("saving");
    Promise.all(names.map((name, idx) =>
      api.patchClient({ name, patch: patches[name], changes: idx === 0 ? changes : [] })
    ))
      .then(() => showSaveStatus("saved"))
      .catch((e) => { console.error("patchClient failed:", e?.message); showSaveStatus("error"); });
  }, [showSaveStatus]);

  const flushTasks = useCallback(() => {
    taskSaveTimer.current = null;
    const changes = pendingTaskChanges.current;
    pendingTaskChanges.current = [];
    api.putTasks({ tasks: tasksRef.current, changes });
  }, []);

  // Flush any unsaved changes before the tab/window closes
  useEffect(() => {
    const onUnload = () => { if (clientSaveTimer.current) { clearTimeout(clientSaveTimer.current); flushClients(); } };
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, [flushClients]);

  const scheduleTaskSave = useCallback((changeEntry) => {
    if (changeEntry) pendingTaskChanges.current = [...pendingTaskChanges.current, changeEntry];
    if (taskSaveTimer.current) clearTimeout(taskSaveTimer.current);
    taskSaveTimer.current = setTimeout(flushTasks, 800);
  }, [flushTasks]);

  const setAndSaveTasks = (fn, changeEntry) => setTasks((prev) => { const next = typeof fn === "function" ? fn(prev) : fn; scheduleTaskSave(changeEntry || null); return next; });

  const CLIENT_FIELD_LABEL = { name: "Name", mrr: "MRR", adSpend: "Ad Spend", leads: "Leads", status: "Client Vibe", adStatus: "Ad Status", onboarding: "Onboarding", priority: "Priority", callType: "Call Type", start: "Start Date", phone: "Phone", email: "Email", script: "Script", notes: "Notes" };

  // No side effects inside setState — use clientsRef for old values
  const updateClient = (name, patch) => {
    const old = clientsRef.current.find((c) => c.name === name);
    setClients((prev) => prev.map((c) => (c.name === name ? { ...c, ...patch } : c)));
    const changes = Object.entries(patch)
      .filter(([f, v]) => String(old?.[f] ?? "") !== String(v ?? "") && CLIENT_FIELD_LABEL[f])
      .map(([f, v]) => ({ action: "client_change", detail: `Changed ${name}: ${CLIENT_FIELD_LABEL[f]} from "${String(old?.[f] ?? "") || "—"}" to "${String(v ?? "") || "—"}"` }));
    pendingClientPatches.current = { ...pendingClientPatches.current, [name]: { ...(pendingClientPatches.current[name] || {}), ...patch } };
    if (changes.length) pendingClientChanges.current = [...pendingClientChanges.current, ...changes];
    if (clientSaveTimer.current) clearTimeout(clientSaveTimer.current);
    clientSaveTimer.current = setTimeout(flushClients, 500);
  };
  const addTask = (client, text) => {
    const newTask = { id: uid(), client, text, priority: "Medium", due: "", deps: [], loom: "" };
    setAndSaveTasks((ts) => [...ts, newTask], { action: "task_added", detail: `Added task for ${client}: "${text}"` });
  };
  const removeTask = (id) => {
    setTasks((prev) => {
      const t = prev.find((t) => t.id === id);
      const next = prev.filter((t) => t.id !== id).map((t) => ({ ...t, deps: t.deps.filter((d) => d !== id) }));
      scheduleTaskSave(t ? { action: "task_removed", detail: `Removed task for ${t.client}: "${t.text}"` } : null);
      return next;
    });
  };
  const updateTask = (id, patch) => setAndSaveTasks((ts) => ts.map((t) => (t.id === id ? { ...t, ...patch } : t)));

  const updateEnumColor = useCallback((field, option, hex) => {
    setEnumColors((prev) => {
      const next = { ...prev, [field]: { ...prev[field], [option]: hex } };
      api.getSettings().then((s) => api.putSettings({ ...s, enumColors: next })).catch(() => {});
      return next;
    });
  }, []);

  const logout = async () => { await api.logout().catch(() => {}); api.clearToken(); setUser(null); setReady(false); };

  if (!user) return <AuthScreen onLogin={(u) => setUser(u)} />;
  if (!ready) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "grid", placeItems: "center", fontFamily: FONT }}>
      <div style={{ color: C.muted, fontSize: 15 }}>Loading…</div>
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh", width: "100%", fontFamily: FONT, color: C.text,
      position: "relative", overflow: "hidden",
      background: `radial-gradient(1200px 640px at 8% -8%, rgba(255,138,61,0.42), transparent 56%),
                   radial-gradient(760px 520px at 30% 4%, rgba(255,90,20,0.22), transparent 50%),
                   radial-gradient(1000px 620px at 108% 112%, rgba(255,120,30,0.22), transparent 55%),
                   ${C.bg}`,
    }}>
      <div style={{ maxWidth: "98vw", margin: "0 auto", padding: "40px 28px 100px" }}>
        <Header user={user} onLogout={logout} saveStatus={saveStatus} />
        <Tabs tab={tab} setTab={setTab} />
        {tab === "Overview" && <Overview setTab={setTab} clients={clients} tasks={tasks} />}
        {tab === "Clients" && <ClientsPage clients={clients} tasks={tasks} addTask={addTask} removeTask={removeTask} updateClient={updateClient} enumColors={enumColors} updateEnumColor={updateEnumColor} />}
        {tab === "Tasks" && <TasksPage clients={clients} tasks={tasks} addTask={addTask} removeTask={removeTask} updateTask={updateTask} />}
        {tab === "Settings" && <SettingsPage user={user} />}
      </div>
    </div>
  );
}
