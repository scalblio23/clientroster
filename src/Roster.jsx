import { useState } from "react";
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
  { name: "Pascal",          color: "#ff8a3d", mrr: 2500, start: "1 Nov 2025",  status: "good",    adStatus: "Live",     onboarding: "Onboard Complete", priority: "Medium", phone: "0405195248",     email: "pascal.wpservices@gmail.com",      notes: "Nothing to do for now, just need to hit 15 bookings this week" },
  { name: "Jinesh",          color: "#a78bfa", mrr: 0,    start: "1 Nov 2025",  status: "neutral", adStatus: "Not Live", onboarding: "Pending",          priority: "Medium", phone: "",               email: "",                                 notes: "Assign content posting this week for Owen" },
  { name: "Imran",           color: "#34d399", mrr: 1200, start: "1 Dec 2025",  status: "good",    adStatus: "Live",     onboarding: "Onboard Complete", priority: "Medium", phone: "0405567178",     email: "imran@khanlegal.com.au",            notes: "10 bookings OR make sure all recent leads are closed" },
  { name: "Kaniq",           color: "#f0674a", mrr: 1200, start: "1 Feb 2026",  status: "at risk", adStatus: "Not Live", onboarding: "Onboard Complete", priority: "Medium", phone: "0451858710",     email: "kaniq.singh@gmail.com",             notes: "" },
  { name: "Vin",             color: "#fb923c", mrr: 0,    start: "2 Mar 2026",  status: "at risk", adStatus: "Not Live", onboarding: "Onboard Complete", priority: "Medium", phone: "0416832295",     email: "vin.neh.lal@gmail.com",             notes: "Follow up" },
  { name: "Chris",           color: "#60a5fa", mrr: 0,    start: "24 Mar 2026", status: "neutral", adStatus: "Not Live", onboarding: "Onboard Complete", priority: "Medium", phone: "0427543942",     email: "chris@adx.com.au",                  notes: "" },
  { name: "Louisa",          color: "#e879f9", mrr: 0,    start: "22 Apr 2026", status: "at risk", adStatus: "Not Live", onboarding: "Onboard Complete", priority: "Medium", phone: "0414083522",     email: "louisa@zippyfinancial.com.au",      notes: "" },
  { name: "Luke",            color: "#4ade80", mrr: 0,    start: "30 May 2026", status: "good",    adStatus: "Live",     onboarding: "Onboard Complete", priority: "Medium", phone: "0411718555",     email: "luke@goalinvest.com.au",            notes: "Look at current ad account and lead list. Once done figure out how lead quality is going, have a chat with Luke see how is feeling - nurture this relationship." },
  { name: "Ali",             color: "#fbbf24", mrr: 1200, start: "9 Jun 2026",  status: "neutral", adStatus: "Not Live", onboarding: "Pending",          priority: "Low",    phone: "0428259463",     email: "eliteglossdetailers@hotmail.com",   notes: "" },
  { name: "Dylan",           color: "#5b9bff", mrr: 1500, start: "11 Jun 2026", status: "neutral", adStatus: "Live",     onboarding: "Onboard Complete", priority: "Medium", phone: "0400132725",     email: "sandfordelectrical@outlook.com",    notes: "Solar guy. The main goal next week is to book 2 calls per day minimum." },
  { name: "Suleiman",        color: "#ff6a1f", mrr: 1000, start: "15 Jun 2026", status: "neutral", adStatus: "Live",     onboarding: "Pending",          priority: "High",   phone: "+61 432 115 549", email: "suleiman302@gmail.com",            notes: "Start calling campaign tomorrow" },
  { name: "Christian",       color: "#38bdf8", mrr: 1500, start: "17 Jun 2026", status: "good",    adStatus: "Not Live", onboarding: "Pending",          priority: "Medium", phone: "+61 414 373 016", email: "christian@fundd.com.au",           notes: "Need to assess the ads - what is going on with them and how to adjust" },
  { name: "Adrian",          color: "#f43f5e", mrr: 1170, start: "23 Jun 2026", status: "at risk", adStatus: "Not Live", onboarding: "Pending",          priority: "Medium", phone: "+61 431 414 650", email: "adrian@mojefinancial.com.au",      notes: "Need to get his ads live" },
  { name: "Elias",           color: "#a3e635", mrr: 1250, start: "23 Jun 2026", status: "good",    adStatus: "Not Live", onboarding: "Pending",          priority: "Medium", phone: "+61 478 402 965", email: "elias@settla.com.au",              notes: "Book 2-3 calls per week with this" },
  { name: "Michael Mfonyam", color: "#c084fc", mrr: 1000, start: "30 Jun 2026", status: "good",    adStatus: "Not Live", onboarding: "Pending",          priority: "Medium", phone: "+17042412097",   email: "mike_aze@yahoo.ca",                 notes: "Get his campaign live" },
  { name: "Mohammed Ahmed",  color: "#fb7185", mrr: 1500, start: "2 Jul 2026",  status: "good",    adStatus: "Not Live", onboarding: "Pending",          priority: "Medium", phone: "",               email: "",                                  notes: "Organise video shoot, go through onboarding" },
  { name: "Brendon Hollins", color: "#fdba74", mrr: 1700, start: "3 Jul 2026",  status: "good",    adStatus: "Not Live", onboarding: "Pending",          priority: "Medium", phone: "0401177729",     email: "brendon@cable-co.com.au",           notes: "Get campaign live" },
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

function StatusChip({ status }) {
  const s = STATUS[status];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500,
      color: s.color, background: s.color + "1f", border: `1px solid ${s.color}33`,
      borderRadius: 999, padding: "4px 10px",
    }}>
      <span style={{ width: 7, height: 7, borderRadius: 99, background: s.color }} />
      {s.label}
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
function Header() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{
          width: 30, height: 30, borderRadius: 9,
          background: `linear-gradient(150deg, ${C.orange}, ${C.orangeDeep})`,
          boxShadow: `0 4px 14px ${C.orange}55`,
        }} />
        <span style={{ fontSize: 19, fontWeight: 600, color: C.text }}>Roster</span>
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
  const items = ["Overview", "Clients", "Tasks"];
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

const adStatusStyle = (v) => v === "Live"
  ? { bg: "rgba(52,211,153,0.15)", bd: "rgba(52,211,153,0.3)", fg: "#34d399" }
  : { bg: "rgba(255,255,255,0.06)", bd: "rgba(255,255,255,0.12)", fg: "#9aa0a8" };

const onboardingStyle = (v) => v === "Onboard Complete"
  ? { bg: "rgba(91,155,255,0.14)", bd: "rgba(91,155,255,0.28)", fg: "#5b9bff" }
  : { bg: "rgba(255,255,255,0.06)", bd: "rgba(255,255,255,0.12)", fg: "#9aa0a8" };

const priorityStyle = (v) => ({
  High:   { bg: "rgba(240,103,74,0.14)",  bd: "rgba(240,103,74,0.28)",  fg: "#f0674a" },
  Medium: { bg: "rgba(255,138,61,0.14)",  bd: "rgba(255,138,61,0.28)",  fg: "#ff8a3d" },
  Low:    { bg: "rgba(127,138,163,0.14)", bd: "rgba(127,138,163,0.28)", fg: "#7f8aa3" },
}[v] || { bg: "rgba(255,255,255,0.06)", bd: "rgba(255,255,255,0.12)", fg: "#9aa0a8" });

function CycleBadge({ value, order, styleFor, onChange }) {
  const s = styleFor(value);
  return (
    <button onClick={() => onChange(order[(order.indexOf(value) + 1) % order.length])} style={{
      display: "inline-flex", alignItems: "center", gap: 5, cursor: "pointer",
      background: s.bg, border: `1px solid ${s.bd}`, color: s.fg,
      borderRadius: 999, padding: "4px 10px", fontSize: 12, fontWeight: 600,
      whiteSpace: "nowrap",
    }}>{value}</button>
  );
}

function ClientTable({ clients, tasks, addTask, removeTask, updateClient }) {
  const cols = ["Name", "Notes", "Days old", "Client Vibe", "Ad Status", "Onboarding", "Priority", "MRR", "Start Date", "Phone", "Email", "Tasks"];
  const grid = "150px 260px 80px 110px 110px 160px 100px 90px 120px 140px 200px 1fr";

  return (
    <div style={{ ...GLASS, borderRadius: 20, overflow: "hidden" }}>
      <div className="glass-scroll" style={{ overflowX: "auto" }}>
        <div style={{ minWidth: 1600 }}>
          {/* header */}
          <div style={{ display: "grid", gridTemplateColumns: grid, gap: 12, padding: "12px 22px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            {cols.map((h) => (
              <span key={h} style={{ fontSize: 11, letterSpacing: 1, fontWeight: 600, color: C.muted, textTransform: "uppercase" }}>{h}</span>
            ))}
          </div>
          {/* rows */}
          {clients.map((c, i) => {
            const cTasks = tasks.filter((t) => t.client === c.name);
            return (
              <div key={c.name} style={{
                display: "grid", gridTemplateColumns: grid, alignItems: "center", gap: 12,
                padding: "12px 22px", borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.05)",
              }}>
                {/* name */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                  <ClientIcon color={c.color} name={c.name} size={30} />
                  <input
                    value={c.name}
                    onChange={(e) => updateClient(c.name, { name: e.target.value })}
                    style={{ ...cellInput(), fontSize: 14, fontWeight: 600, minWidth: 0 }}
                  />
                </div>
                {/* notes */}
                <input
                  value={c.notes || ""}
                  onChange={(e) => updateClient(c.name, { notes: e.target.value })}
                  placeholder="Add note…"
                  style={{ ...cellInput({ fontSize: 12.5, color: C.muted }) }}
                />
                {/* days old */}
                {(() => { const d = daysOld(c.start); const col = daysColor(d); return (
                  <div style={{ fontSize: 14, fontWeight: 700, color: col }}>
                    {d !== null ? d : "—"}<span style={{ fontSize: 10, opacity: 0.7, marginLeft: 2 }}>d</span>
                  </div>
                ); })()}
                {/* client vibe */}
                <div>
                  <button onClick={() => { const o = ["good","neutral","at risk"]; updateClient(c.name, { status: o[(o.indexOf(c.status)+1)%o.length] }); }}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    <StatusChip status={c.status} />
                  </button>
                </div>
                {/* ad status */}
                <CycleBadge value={c.adStatus || "Not Live"} order={AD_STATUS_ORDER} styleFor={adStatusStyle} onChange={(v) => updateClient(c.name, { adStatus: v })} />
                {/* onboarding */}
                <CycleBadge value={c.onboarding || "Pending"} order={ONBOARDING_ORDER} styleFor={onboardingStyle} onChange={(v) => updateClient(c.name, { onboarding: v })} />
                {/* priority */}
                <CycleBadge value={c.priority || "Medium"} order={CLIENT_PRIORITY_ORDER} styleFor={priorityStyle} onChange={(v) => updateClient(c.name, { priority: v })} />
                {/* mrr */}
                <input
                  type="number"
                  value={c.mrr}
                  onChange={(e) => updateClient(c.name, { mrr: Number(e.target.value) })}
                  style={{ ...cellInput({ fontSize: 14, fontWeight: 700 }) }}
                />
                {/* start date */}
                <input
                  value={c.start}
                  onChange={(e) => updateClient(c.name, { start: e.target.value })}
                  style={{ ...cellInput({ fontSize: 13 }) }}
                />
                {/* phone */}
                <input
                  value={c.phone}
                  onChange={(e) => updateClient(c.name, { phone: e.target.value })}
                  style={{ ...cellInput({ fontSize: 13, color: C.muted }) }}
                />
                {/* email */}
                <input
                  value={c.email}
                  onChange={(e) => updateClient(c.name, { email: e.target.value })}
                  style={{ ...cellInput({ fontSize: 13, color: C.muted }) }}
                />
                {/* tasks */}
                <TaskPills tasks={cTasks} onAdd={(t) => addTask(c.name, t)} onRemove={(id) => removeTask(id)} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ClientsPage({ clients, tasks, addTask, removeTask, updateClient }) {
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
          <ClientTable clients={clients} tasks={tasks} addTask={addTask} removeTask={removeTask} updateClient={updateClient} />
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

function TasksPage({ clients, tasks, addTask, removeTask, updateTask }) {
  const [depsFor, setDepsFor] = useState(null);
  const [newClient, setNewClient] = useState(clients[0]?.name || "");
  const [newText, setNewText] = useState("");
  const byName = Object.fromEntries(clients.map((c) => [c.name, c]));
  const activeTask = tasks.find((t) => t.id === depsFor) || null;

  const cols = ["Task", "Client", "Priority", "Due date", "Dependencies", "Loom", ""];
  const grid = "2.1fr 1.3fr 1fr 1.4fr 1.5fr 1.5fr 0.4fr";

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
                {cols.map((h, idx) => (
                  <span key={idx} style={{ fontSize: 11, letterSpacing: 1, fontWeight: 600, color: C.muted, textTransform: "uppercase" }}>{h}</span>
                ))}
              </div>
              {tasks.map((t, i) => {
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

/* ---------- root ---------- */
export default function Roster() {
  const [tab, setTab] = useState("Overview");
  const [clients, setClients] = useState(CLIENTS);
  const updateClient = (name, patch) =>
    setClients((cs) => cs.map((c) => (c.name === name ? { ...c, ...patch } : c)));
  const [tasks, setTasks] = useState(SEED_TASKS);

  const addTask = (client, text) =>
    setTasks((ts) => [...ts, { id: uid(), client, text, priority: "Medium", due: "", deps: [], loom: "" }]);
  const removeTask = (id) =>
    setTasks((ts) => ts.filter((t) => t.id !== id).map((t) => ({ ...t, deps: t.deps.filter((d) => d !== id) })));
  const updateTask = (id, patch) =>
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, ...patch } : t)));

  return (
    <div style={{
      minHeight: "100vh", width: "100%", fontFamily: FONT, color: C.text,
      position: "relative", overflow: "hidden",
      background: `radial-gradient(1200px 640px at 8% -8%, rgba(255,138,61,0.42), transparent 56%),
                   radial-gradient(760px 520px at 30% 4%, rgba(255,90,20,0.22), transparent 50%),
                   radial-gradient(1000px 620px at 108% 112%, rgba(255,120,30,0.22), transparent 55%),
                   ${C.bg}`,
    }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "40px 28px 100px" }}>
        <Header />
        <Tabs tab={tab} setTab={setTab} />
        {tab === "Overview" && <Overview setTab={setTab} clients={clients} tasks={tasks} />}
        {tab === "Clients" && <ClientsPage clients={clients} tasks={tasks} addTask={addTask} removeTask={removeTask} updateClient={updateClient} />}
        {tab === "Tasks" && <TasksPage clients={clients} tasks={tasks} addTask={addTask} removeTask={removeTask} updateTask={updateTask} />}
      </div>
    </div>
  );
}
