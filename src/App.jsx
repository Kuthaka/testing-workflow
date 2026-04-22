import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   EBENEX — Full Platform Website
   Pages: Landing · Login · Register · Student Dashboard · 
          Courses · Lesson · Teacher Portal · Institute ERP · 
          Community · Achievements · Profile · Documentation
═══════════════════════════════════════════════════════════════ */

// ── Google Fonts ──
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap";
document.head.appendChild(fontLink);

// ── Global Styles ──
const style = document.createElement("style");
style.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #07090f; font-family: 'DM Sans', sans-serif; color: #e2e8f0; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #0d1117; }
  ::-webkit-scrollbar-thumb { background: #1e2a3a; border-radius: 3px; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
  @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
  @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes glow { 0%,100%{box-shadow:0 0 20px #22d3ee22} 50%{box-shadow:0 0 40px #22d3ee44} }
  .fade-up { animation: fadeUp .5s ease both; }
  .hover-lift { transition: transform .2s, box-shadow .2s; }
  .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,.4); }
  input, textarea, select { outline: none; }
  button { cursor: pointer; font-family: 'DM Sans', sans-serif; }
  a { text-decoration: none; color: inherit; }
`;
document.head.appendChild(style);

// ══════════════════ DESIGN TOKENS ══════════════════
const C = {
  bg: "#07090f", bgCard: "#0d1117", bgSurface: "#111827",
  border: "rgba(255,255,255,0.07)", borderHover: "rgba(34,211,238,0.3)",
  accent: "#22d3ee", accentDim: "#22d3ee22", accentMid: "#22d3ee66",
  green: "#4ade80", greenDim: "#4ade8022",
  amber: "#fbbf24", amberDim: "#fbbf2422",
  purple: "#a78bfa", purpleDim: "#a78bfa22",
  rose: "#fb7185", roseDim: "#fb718522",
  text: "#e2e8f0", textMuted: "#64748b", textDim: "#94a3b8",
};

// ══════════════════ DUMMY DATA ══════════════════
const DUMMY = {
  user: { name: "Arjun Menon", email: "arjun@gmail.com", avatar: "AM", level: "A2", xp: 2840, streak: 23, role: "student", institute: "Berlin Language Institute" },
  teacher: { name: "Dr. Sarah Weber", email: "sarah@ebenex.com", avatar: "SW", students: 142, courses: 5, rating: 4.9 },
  institute: { name: "Berlin Language Institute", plan: "Pro", students: 487, teachers: 12, revenue: "₹2,40,000" },
  courses: [
    { id:1, title:"German A1 — Absolute Beginners", level:"A1", lessons:42, enrolled:12840, rating:4.8, progress:100, badge:"✅", color:C.green, instructor:"Dr. Sarah Weber", desc:"Start from zero. Master greetings, numbers, basic grammar, and everyday sentences." },
    { id:2, title:"German A2 — Elementary", level:"A2", lessons:56, enrolled:9320, rating:4.9, progress:64, badge:"📘", color:C.accent, instructor:"Prof. Klaus Müller", desc:"Build on A1. Shopping, directions, past tense, and conversational fluency." },
    { id:3, title:"German B1 — Intermediate", level:"B1", lessons:68, enrolled:6100, rating:4.7, progress:0, badge:"🔒", color:C.purple, instructor:"Anna Schreiber", desc:"Discuss work, travel, and current events. Prepare for B1 Goethe exam." },
    { id:4, title:"German B2 — Upper Intermediate", level:"B2", lessons:74, enrolled:3800, rating:4.8, progress:0, badge:"🔒", color:C.amber, instructor:"Dr. Sarah Weber", desc:"Near-fluent discussions, complex grammar, and advanced vocabulary." },
    { id:5, title:"German Grammar Masterclass", level:"All", lessons:30, enrolled:22000, rating:4.9, progress:40, badge:"📗", color:C.rose, instructor:"Prof. Klaus Müller", desc:"Deep-dive into German grammar — cases, verb conjugations, articles." },
    { id:6, title:"Business German", level:"B2+", lessons:28, enrolled:4200, rating:4.7, progress:0, badge:"🔒", color:C.amber, instructor:"Lena Bauer", desc:"Professional German for corporate settings, emails, and meetings." },
  ],
  lessons: [
    { id:1, title:"Greetings & Introductions", type:"Vocabulary", duration:"8 min", xp:20, done:true },
    { id:2, title:"Numbers 1–100", type:"Numbers", duration:"10 min", xp:25, done:true },
    { id:3, title:"Der/Die/Das Articles", type:"Grammar", duration:"12 min", xp:30, done:true },
    { id:4, title:"Family Members", type:"Vocabulary", duration:"9 min", xp:20, done:false, active:true },
    { id:5, title:"Present Tense Verbs", type:"Grammar", duration:"15 min", xp:35, done:false },
    { id:6, title:"Colors & Shapes", type:"Vocabulary", duration:"7 min", xp:15, done:false },
  ],
  exercise: {
    question: "Translate to German: 'My father is a doctor.'",
    hint: "Use 'mein Vater' for 'my father'",
    options: ["Mein Vater ist Arzt.", "Meine Mutter ist Ärztin.", "Mein Bruder ist Arzt.", "Dein Vater ist Arzt."],
    correct: 0,
  },
  achievements: [
    { icon:"🔥", title:"First Flame", desc:"Completed first lesson", date:"Mar 1", color:C.amber, earned:true },
    { icon:"⚡", title:"Speed Learner", desc:"5 lessons in one day", date:"Mar 5", color:C.accent, earned:true },
    { icon:"📚", title:"A1 Graduate", desc:"Completed A1 course", date:"Mar 18", color:C.green, earned:true },
    { icon:"🎯", title:"Perfect Score", desc:"100% on any exam", date:"Mar 22", color:C.purple, earned:true },
    { icon:"🔥", title:"7-Day Streak", desc:"7 consecutive days", date:"Mar 24", color:C.rose, earned:true },
    { icon:"💬", title:"Chatterbox", desc:"Sent 50 messages in community", date:"—", color:C.accent, earned:false },
    { icon:"🏆", title:"Institute Star", desc:"Top student of the month", date:"—", color:C.amber, earned:false },
    { icon:"🎓", title:"B1 Graduate", desc:"Complete B1 course", date:"—", color:C.purple, earned:false },
  ],
  messages: [
    { id:1, user:"Sofia Reyes", avatar:"SR", text:"Hallo! Can anyone help me with the dative case?", time:"2m", color:C.purple },
    { id:2, user:"Arjun Menon", avatar:"AM", text:"Sure! The dative case is used after certain prepositions like 'mit', 'nach', 'bei'...", time:"1m", color:C.accent },
    { id:3, user:"Yuki Tanaka", avatar:"YT", text:"Also remember: 'dem' for masculine/neuter, 'der' for feminine in dative!", time:"just now", color:C.green },
  ],
  students: [
    { name:"Priya Sharma", level:"A2", progress:78, streak:14, avatar:"PS" },
    { name:"Carlos Rivera", level:"A1", progress:45, streak:7, avatar:"CR" },
    { name:"Mei Lin", level:"B1", progress:92, streak:31, avatar:"ML" },
    { name:"Omar Hassan", level:"A2", progress:61, streak:9, avatar:"OH" },
    { name:"Elena Popov", level:"B2", progress:88, streak:22, avatar:"EP" },
  ],
};

// ══════════════════ SHARED UI COMPONENTS ══════════════════

const Avatar = ({ initials, size = 36, color = C.accent }) => (
  <div style={{ width:size, height:size, borderRadius:"50%", background:`${color}22`, border:`1.5px solid ${color}55`, display:"flex", alignItems:"center", justifyContent:"center", color, fontSize:size*0.35, fontWeight:700, fontFamily:"'Syne',sans-serif", flexShrink:0 }}>
    {initials}
  </div>
);

const Badge = ({ children, color = C.accent }) => (
  <span style={{ background:`${color}18`, border:`1px solid ${color}44`, color, borderRadius:20, padding:"2px 10px", fontSize:11, fontWeight:600, whiteSpace:"nowrap" }}>
    {children}
  </span>
);

const Btn = ({ children, variant="primary", onClick, style:s={}, disabled=false }) => {
  const base = { border:"none", borderRadius:10, padding:"10px 22px", fontWeight:600, fontSize:14, fontFamily:"'DM Sans',sans-serif", transition:"all .2s", cursor:disabled?"not-allowed":"pointer", opacity:disabled?0.5:1, ...s };
  const variants = {
    primary: { background:`linear-gradient(135deg, ${C.accent}, #0ea5e9)`, color:"#07090f" },
    secondary: { background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:C.text },
    ghost: { background:"transparent", color:C.textMuted },
    danger: { background:`${C.rose}22`, border:`1px solid ${C.rose}44`, color:C.rose },
    success: { background:`${C.green}22`, border:`1px solid ${C.green}44`, color:C.green },
  };
  return <button style={{ ...base, ...variants[variant] }} onClick={onClick} disabled={disabled}>{children}</button>;
};

const Input = ({ label, type="text", value, onChange, placeholder, icon }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
    {label && <label style={{ fontSize:13, color:C.textDim, fontWeight:500 }}>{label}</label>}
    <div style={{ position:"relative" }}>
      {icon && <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontSize:16, opacity:0.4 }}>{icon}</span>}
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{ width:"100%", background:C.bgSurface, border:`1px solid ${C.border}`, borderRadius:10, padding:`11px ${icon?"40px":"14px"} 11px ${icon?"40px":"14px"}`, color:C.text, fontSize:14, fontFamily:"'DM Sans',sans-serif", transition:"border .2s" }}
        onFocus={e=>e.target.style.borderColor=C.accentMid}
        onBlur={e=>e.target.style.borderColor=C.border}
      />
    </div>
  </div>
);

const ProgressBar = ({ value, color = C.accent, height = 6 }) => (
  <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:99, height, overflow:"hidden" }}>
    <div style={{ height:"100%", width:`${value}%`, background:`linear-gradient(90deg, ${color}, ${color}99)`, borderRadius:99, transition:"width .6s ease" }} />
  </div>
);

const Card = ({ children, style:s={}, onClick, hoverable=false }) => (
  <div onClick={onClick} className={hoverable?"hover-lift":""} style={{ background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:16, padding:20, transition:"border .2s, transform .2s, box-shadow .2s", cursor:onClick?"pointer":"default", ...s }}
    onMouseEnter={e=>{ if(hoverable||onClick){ e.currentTarget.style.borderColor=C.borderHover; }}}
    onMouseLeave={e=>{ if(hoverable||onClick){ e.currentTarget.style.borderColor=C.border; }}}>
    {children}
  </div>
);

const Stat = ({ label, value, icon, color = C.accent }) => (
  <Card style={{ textAlign:"center" }}>
    <div style={{ fontSize:24, marginBottom:6 }}>{icon}</div>
    <div style={{ fontSize:28, fontWeight:800, fontFamily:"'Syne',sans-serif", color, lineHeight:1 }}>{value}</div>
    <div style={{ color:C.textMuted, fontSize:12, marginTop:4 }}>{label}</div>
  </Card>
);

// ══════════════════ NAVBAR ══════════════════
function Navbar({ page, setPage, authed, setAuthed }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = authed
    ? [["dashboard","Dashboard"],["courses","Courses"],["community","Community"],["achievements","Achievements"],["docs","Docs"]]
    : [["landing","Home"],["docs","Docs"]];

  return (
    <nav style={{ position:"sticky", top:0, zIndex:100, background:"rgba(7,9,15,0.92)", backdropFilter:"blur(16px)", borderBottom:`1px solid ${C.border}`, padding:"0 24px", height:60, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
      <div style={{ display:"flex", alignItems:"center", gap:32 }}>
        <div onClick={()=>setPage(authed?"dashboard":"landing")} style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:22, letterSpacing:-1, background:`linear-gradient(135deg,#fff 40%,${C.accent})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", cursor:"pointer" }}>
          Ebenex
        </div>
        <div style={{ display:"flex", gap:4 }}>
          {navItems.map(([p,l])=>(
            <button key={p} onClick={()=>setPage(p)} style={{ background:page===p?`${C.accentDim}`:"transparent", border:page===p?`1px solid ${C.accentMid}`:"1px solid transparent", color:page===p?C.accent:C.textMuted, borderRadius:8, padding:"5px 14px", fontSize:13, fontWeight:500, transition:"all .15s" }}>
              {l}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display:"flex", gap:10, alignItems:"center" }}>
        {authed ? (
          <>
            <button onClick={()=>setPage("profile")} style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:10, padding:"5px 12px", color:C.textDim, fontSize:13, display:"flex", alignItems:"center", gap:8 }}>
              <Avatar initials={DUMMY.user.avatar} size={24} /> {DUMMY.user.name}
            </button>
            <Btn variant="ghost" onClick={()=>{ setAuthed(false); setPage("landing"); }} style={{ padding:"5px 12px", fontSize:13 }}>Sign out</Btn>
          </>
        ) : (
          <>
            <Btn variant="secondary" onClick={()=>setPage("login")} style={{ padding:"7px 18px", fontSize:13 }}>Login</Btn>
            <Btn variant="primary" onClick={()=>setPage("register")} style={{ padding:"7px 18px", fontSize:13 }}>Get Started</Btn>
          </>
        )}
      </div>
    </nav>
  );
}

// ══════════════════ PAGE: LANDING ══════════════════
function LandingPage({ setPage }) {
  const features = [
    { icon:"🤖", title:"Agentic AI Tutor", desc:"A personal AI that adapts every lesson to your pace, fixes your grammar, and coaches your pronunciation in real time.", color:C.accent },
    { icon:"🏫", title:"Institute ERP", desc:"Full B2B ERP for language institutes. Enroll students, assign teachers, schedule classes, and track progress at scale.", color:C.purple },
    { icon:"🎓", title:"CEFR Certification", desc:"Earn recognized A1–C2 certificates, verifiable on blockchain, shareable on LinkedIn with a single click.", color:C.green },
    { icon:"🌍", title:"Visa Guidance", desc:"Step-by-step guidance for German student visas, work permits, and Blue Cards — personalized to your nationality.", color:C.amber },
    { icon:"💬", title:"Community & Chat", desc:"Study circles, language exchange, real-time group chats within institutes, and a global learner community.", color:C.rose },
    { icon:"🔥", title:"Streak System", desc:"Daily streaks, XP, weekly leagues, and a gamified learning flow inspired by the best language apps.", color:C.amber },
  ];
  const stats = [["50,000+","Active Learners"],["200+","Partner Institutes"],["A1–C2","All CEFR Levels"],["98%","Completion Rate"]];

  return (
    <div style={{ minHeight:"100vh" }}>
      {/* Hero */}
      <section style={{ minHeight:"92vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"80px 24px 60px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 80% 50% at 50% 0%, rgba(34,211,238,0.07), transparent)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(34,211,238,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,0.025) 1px,transparent 1px)", backgroundSize:"60px 60px", pointerEvents:"none" }} />

        <div className="fade-up" style={{ animationDelay:".1s" }}>
          <Badge color={C.accent}>🇩🇪 German Language Platform</Badge>
        </div>
        <h1 className="fade-up" style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(44px,7vw,88px)", fontWeight:900, letterSpacing:"-3px", lineHeight:1.05, marginTop:20, marginBottom:16, maxWidth:900, animationDelay:".2s" }}>
          Learn German.<br />
          <span style={{ background:`linear-gradient(135deg,${C.accent},#818cf8)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Actually Fluent.</span>
        </h1>
        <p className="fade-up" style={{ fontSize:18, color:C.textDim, maxWidth:560, lineHeight:1.7, marginBottom:36, animationDelay:".3s" }}>
          AI-powered lessons, real-time coaching, and an ERP system for institutes — everything you need from A1 to C2 and beyond.
        </p>
        <div className="fade-up" style={{ display:"flex", gap:12, flexWrap:"wrap", justifyContent:"center", animationDelay:".4s" }}>
          <Btn variant="primary" onClick={()=>setPage("register")} style={{ padding:"13px 32px", fontSize:15, borderRadius:12 }}>Start Learning Free →</Btn>
          <Btn variant="secondary" onClick={()=>setPage("docs")} style={{ padding:"13px 28px", fontSize:15, borderRadius:12 }}>View Platform Docs</Btn>
        </div>

        {/* floating stats */}
        <div className="fade-up" style={{ display:"flex", gap:16, marginTop:60, flexWrap:"wrap", justifyContent:"center", animationDelay:".5s" }}>
          {stats.map(([v,l])=>(
            <div key={l} style={{ background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 24px", textAlign:"center" }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:22, color:C.accent }}>{v}</div>
              <div style={{ color:C.textMuted, fontSize:12, marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding:"80px 24px", maxWidth:1200, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:56 }}>
          <Badge color={C.purple}>Platform Features</Badge>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:40, letterSpacing:-1.5, marginTop:14, marginBottom:12 }}>Everything in one place</h2>
          <p style={{ color:C.textMuted, fontSize:16, maxWidth:500, margin:"0 auto" }}>From your first "Hallo" to enterprise institute management — Ebenex scales with you.</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))", gap:20 }}>
          {features.map(f=>(
            <Card key={f.title} hoverable style={{ display:"flex", gap:16 }}>
              <div style={{ fontSize:32, width:52, height:52, borderRadius:12, background:`${f.color}18`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{f.icon}</div>
              <div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:16, marginBottom:6, color:f.color }}>{f.title}</div>
                <div style={{ color:C.textMuted, fontSize:13, lineHeight:1.6 }}>{f.desc}</div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:"80px 24px", textAlign:"center" }}>
        <div style={{ maxWidth:600, margin:"0 auto", background:`linear-gradient(135deg,${C.bgCard},${C.bgSurface})`, border:`1px solid ${C.borderHover}`, borderRadius:24, padding:"52px 40px" }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🇩🇪</div>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:32, letterSpacing:-1, marginBottom:12 }}>Ready to speak German?</h2>
          <p style={{ color:C.textMuted, marginBottom:28, lineHeight:1.6 }}>Join 50,000+ learners and hundreds of institutes already on Ebenex.</p>
          <Btn variant="primary" onClick={()=>setPage("register")} style={{ padding:"13px 36px", fontSize:15, borderRadius:12 }}>Create Free Account →</Btn>
        </div>
      </section>
    </div>
  );
}

// ══════════════════ PAGE: LOGIN ══════════════════
function LoginPage({ setPage, setAuthed }) {
  const [email, setEmail] = useState("arjun@gmail.com");
  const [password, setPassword] = useState("••••••••");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setAuthed(true); setPage("dashboard"); }, 1200);
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 60% 60% at 30% 50%, rgba(34,211,238,0.05), transparent)", pointerEvents:"none" }} />
      <div className="fade-up" style={{ width:"100%", maxWidth:440 }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:32, letterSpacing:-1, background:`linear-gradient(135deg,#fff,${C.accent})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", marginBottom:8 }}>Ebenex</div>
          <div style={{ color:C.textMuted, fontSize:15 }}>Welcome back. Continue your German journey.</div>
        </div>
        <Card style={{ padding:32 }}>
          <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
            <Input label="Email address" value={email} onChange={setEmail} placeholder="you@example.com" icon="✉️" />
            <Input label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" icon="🔒" />
            <div style={{ display:"flex", justifyContent:"flex-end" }}>
              <span style={{ color:C.accent, fontSize:13, cursor:"pointer" }}>Forgot password?</span>
            </div>
            <Btn variant="primary" onClick={handleLogin} style={{ width:"100%", padding:"13px", fontSize:15, borderRadius:11 }}>
              {loading ? "Signing in…" : "Sign in →"}
            </Btn>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ flex:1, height:1, background:C.border }} />
              <span style={{ color:C.textMuted, fontSize:12 }}>or continue with</span>
              <div style={{ flex:1, height:1, background:C.border }} />
            </div>
            <div style={{ display:"flex", gap:10 }}>
              {["G Google","⧉ Microsoft","  Apple"].map(p=>(
                <button key={p} style={{ flex:1, background:C.bgSurface, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 8px", color:C.textDim, fontSize:13, transition:"border .15s" }}
                  onMouseEnter={e=>e.target.style.borderColor=C.accentMid}
                  onMouseLeave={e=>e.target.style.borderColor=C.border}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </Card>
        <p style={{ textAlign:"center", marginTop:20, color:C.textMuted, fontSize:14 }}>
          Don't have an account? <span onClick={()=>setPage("register")} style={{ color:C.accent, cursor:"pointer", fontWeight:500 }}>Create one free →</span>
        </p>
      </div>
    </div>
  );
}

// ══════════════════ PAGE: REGISTER ══════════════════
function RegisterPage({ setPage, setAuthed }) {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [name, setName] = useState("Arjun Menon");
  const [email, setEmail] = useState("arjun@gmail.com");
  const [loading, setLoading] = useState(false);

  const handleFinish = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setAuthed(true); setPage("dashboard"); }, 1400);
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 60% 60% at 70% 50%, rgba(167,139,250,0.05), transparent)", pointerEvents:"none" }} />
      <div className="fade-up" style={{ width:"100%", maxWidth:500 }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:28, letterSpacing:-1, color:"#fff", marginBottom:6 }}>Create your account</div>
          <div style={{ color:C.textMuted, fontSize:14 }}>Step {step} of 3</div>
          <div style={{ display:"flex", gap:6, justifyContent:"center", marginTop:12 }}>
            {[1,2,3].map(s=>(
              <div key={s} style={{ height:4, width:60, borderRadius:99, background:s<=step?C.accent:`${C.border}`, transition:"background .3s" }} />
            ))}
          </div>
        </div>
        <Card style={{ padding:32 }}>
          {step===1 && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:18, marginBottom:4 }}>Choose your role</div>
              {[
                { r:"student", icon:"🎓", title:"I'm a Student", desc:"Learn German at my own pace or join an institute" },
                { r:"teacher", icon:"👨‍🏫", title:"I'm a Teacher", desc:"Teach on Ebenex or join a partner institute" },
                { r:"institute", icon:"🏫", title:"I represent an Institute", desc:"Manage courses, teachers, and students at scale" },
              ].map(({r,icon,title,desc})=>(
                <div key={r} onClick={()=>setRole(r)} style={{ display:"flex", gap:14, alignItems:"center", background:role===r?`${C.accentDim}`:C.bgSurface, border:`1.5px solid ${role===r?C.accent:C.border}`, borderRadius:12, padding:"14px 16px", cursor:"pointer", transition:"all .15s" }}>
                  <div style={{ fontSize:28 }}>{icon}</div>
                  <div>
                    <div style={{ fontWeight:600, fontSize:14, color:role===r?C.accent:C.text }}>{title}</div>
                    <div style={{ color:C.textMuted, fontSize:12, marginTop:2 }}>{desc}</div>
                  </div>
                </div>
              ))}
              <Btn variant="primary" onClick={()=>role&&setStep(2)} disabled={!role} style={{ marginTop:8, padding:"12px", borderRadius:11 }}>Continue →</Btn>
            </div>
          )}
          {step===2 && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:18, marginBottom:4 }}>Your details</div>
              <Input label="Full Name" value={name} onChange={setName} placeholder="Enter your name" icon="👤" />
              <Input label="Email Address" value={email} onChange={setEmail} placeholder="you@example.com" icon="✉️" />
              <Input label="Password" type="password" value="••••••••" onChange={()=>{}} placeholder="Create a strong password" icon="🔒" />
              <Btn variant="primary" onClick={()=>setStep(3)} style={{ marginTop:4, padding:"12px", borderRadius:11 }}>Continue →</Btn>
              <Btn variant="ghost" onClick={()=>setStep(1)} style={{ fontSize:13 }}>← Back</Btn>
            </div>
          )}
          {step===3 && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:18, marginBottom:4 }}>Level Assessment</div>
              <div style={{ color:C.textMuted, fontSize:13, lineHeight:1.6 }}>Answer 3 quick questions so our AI can place you in the right course level.</div>
              <div style={{ background:C.bgSurface, borderRadius:12, padding:20 }}>
                <div style={{ fontSize:14, fontWeight:600, marginBottom:14 }}>What does "Guten Morgen" mean?</div>
                {["Good Morning","Good Evening","Goodbye","Thank you"].map((opt,i)=>(
                  <div key={opt} onClick={()=>{}} style={{ background:i===0?`${C.green}18`:C.bgCard, border:`1px solid ${i===0?C.green:C.border}`, borderRadius:9, padding:"10px 14px", marginBottom:8, cursor:"pointer", fontSize:13, color:i===0?C.green:C.text, transition:"all .15s" }}>
                    {opt}
                  </div>
                ))}
              </div>
              <Btn variant="primary" onClick={handleFinish} style={{ padding:"12px", borderRadius:11 }}>
                {loading?"Setting up your account…":"Complete Setup 🎉"}
              </Btn>
              <Btn variant="ghost" onClick={()=>setStep(2)} style={{ fontSize:13 }}>← Back</Btn>
            </div>
          )}
        </Card>
        <p style={{ textAlign:"center", marginTop:20, color:C.textMuted, fontSize:14 }}>
          Already have an account? <span onClick={()=>setPage("login")} style={{ color:C.accent, cursor:"pointer", fontWeight:500 }}>Sign in →</span>
        </p>
      </div>
    </div>
  );
}

// ══════════════════ PAGE: STUDENT DASHBOARD ══════════════════
function DashboardPage({ setPage, setActiveCourse }) {
  const days = ["M","T","W","T","F","S","S"];
  const streakDays = [true,true,true,true,true,false,true];

  return (
    <div style={{ maxWidth:1280, margin:"0 auto", padding:"32px 24px" }}>
      {/* Welcome */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:32, flexWrap:"wrap", gap:16 }}>
        <div>
          <div style={{ color:C.textMuted, fontSize:14, marginBottom:4 }}>Good morning 🌅</div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:32, letterSpacing:-1 }}>
            Guten Morgen, {DUMMY.user.name.split(" ")[0]}!
          </h1>
          <div style={{ color:C.textMuted, fontSize:14, marginTop:6 }}>You're on a <span style={{ color:C.amber, fontWeight:700 }}>{DUMMY.user.streak}-day streak</span> 🔥 Keep it up!</div>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <Btn variant="secondary" onClick={()=>setPage("courses")}>Browse Courses</Btn>
          <Btn variant="primary" onClick={()=>{ setActiveCourse(DUMMY.courses[1]); setPage("lesson"); }}>Continue Learning →</Btn>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:14, marginBottom:28 }}>
        <Stat icon="🔥" value={DUMMY.user.streak} label="Day Streak" color={C.amber} />
        <Stat icon="⚡" value={DUMMY.user.xp.toLocaleString()} label="Total XP" color={C.accent} />
        <Stat icon="🎓" value={DUMMY.user.level} label="Current Level" color={C.green} />
        <Stat icon="📚" value="2/6" label="Courses Active" color={C.purple} />
        <Stat icon="🏆" value="5" label="Achievements" color={C.rose} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:20, alignItems:"start" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
          {/* Continue course */}
          <Card style={{ background:`linear-gradient(135deg,${C.bgCard},${C.bgSurface})` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
              <div>
                <Badge color={C.accent}>In Progress</Badge>
                <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:20, marginTop:8, marginBottom:4 }}>{DUMMY.courses[1].title}</h3>
                <div style={{ color:C.textMuted, fontSize:13 }}>Next: <span style={{ color:C.text }}>Family Members</span> — 9 min</div>
              </div>
              <Btn variant="primary" onClick={()=>{ setActiveCourse(DUMMY.courses[1]); setPage("lesson"); }} style={{ flexShrink:0 }}>Continue →</Btn>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ color:C.textMuted, fontSize:12 }}>Progress</span>
              <span style={{ color:C.accent, fontSize:12, fontWeight:600 }}>{DUMMY.courses[1].progress}%</span>
            </div>
            <ProgressBar value={DUMMY.courses[1].progress} />
            <div style={{ display:"flex", gap:10, marginTop:16 }}>
              {["36 lessons done","20 remaining","64% complete"].map(t=>(
                <Badge key={t} color={C.accent}>{t}</Badge>
              ))}
            </div>
          </Card>

          {/* My Courses */}
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:18 }}>My Courses</h2>
              <span onClick={()=>setPage("courses")} style={{ color:C.accent, fontSize:13, cursor:"pointer" }}>View all →</span>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {DUMMY.courses.filter(c=>c.progress>0).map(c=>(
                <Card key={c.id} hoverable onClick={()=>{ setActiveCourse(c); setPage("lesson"); }} style={{ display:"flex", gap:14, alignItems:"center" }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:`${c.color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>
                    {c.badge}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600, fontSize:14, marginBottom:4 }}>{c.title}</div>
                    <ProgressBar value={c.progress} color={c.color} height={4} />
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ color:c.color, fontWeight:700, fontSize:14 }}>{c.progress}%</div>
                    <div style={{ color:C.textMuted, fontSize:11 }}>{c.level}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {/* Streak calendar */}
          <Card>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, marginBottom:14, display:"flex", justifyContent:"space-between" }}>
              <span>This Week</span> <span style={{ color:C.amber }}>🔥 {DUMMY.user.streak}</span>
            </div>
            <div style={{ display:"flex", gap:6, justifyContent:"center" }}>
              {days.map((d,i)=>(
                <div key={i} style={{ textAlign:"center" }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:streakDays[i]?`${C.amber}22`:`rgba(255,255,255,0.03)`, border:`1.5px solid ${streakDays[i]?C.amber:C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>
                    {streakDays[i]?"🔥":"·"}
                  </div>
                  <div style={{ color:C.textMuted, fontSize:10, marginTop:4 }}>{d}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Daily goal */}
          <Card>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, marginBottom:14 }}>Daily Goal</div>
            <div style={{ textAlign:"center", marginBottom:14 }}>
              <div style={{ fontSize:40, fontWeight:800, fontFamily:"'Syne',sans-serif", color:C.accent }}>2/3</div>
              <div style={{ color:C.textMuted, fontSize:12 }}>lessons completed today</div>
            </div>
            <ProgressBar value={66} />
            <div style={{ color:C.textMuted, fontSize:12, textAlign:"center", marginTop:10 }}>1 more lesson to hit your daily goal! 🎯</div>
          </Card>

          {/* Leaderboard */}
          <Card>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, marginBottom:14 }}>🏆 Weekly League</div>
            {[
              { name:"Mei Lin", xp:4200, pos:1, you:false },
              { name:"Elena Popov", xp:3800, pos:2, you:false },
              { name:"Arjun Menon", xp:2840, pos:3, you:true },
              { name:"Yuki Tanaka", xp:2100, pos:4, you:false },
            ].map(p=>(
              <div key={p.name} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
                <div style={{ width:24, fontWeight:700, color:p.pos<=3?C.amber:C.textMuted, fontSize:13 }}>#{p.pos}</div>
                <Avatar initials={p.name.split(" ").map(n=>n[0]).join("")} size={28} color={p.you?C.accent:C.textMuted} />
                <div style={{ flex:1, fontSize:13, fontWeight:p.you?600:400, color:p.you?C.accent:C.text }}>{p.name}</div>
                <div style={{ color:C.textMuted, fontSize:12 }}>{p.xp.toLocaleString()} XP</div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

// ══════════════════ PAGE: COURSES ══════════════════
function CoursesPage({ setPage, setActiveCourse }) {
  const [filter, setFilter] = useState("All");
  const levels = ["All","A1","A2","B1","B2","C1","C2"];

  return (
    <div style={{ maxWidth:1280, margin:"0 auto", padding:"32px 24px" }}>
      <div style={{ marginBottom:32 }}>
        <Badge color={C.purple}>Course Library</Badge>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:36, letterSpacing:-1.5, marginTop:10, marginBottom:8 }}>German Courses</h1>
        <p style={{ color:C.textMuted, fontSize:15 }}>From absolute beginner to business-level fluency — every course taught by certified instructors.</p>
      </div>

      <div style={{ display:"flex", gap:8, marginBottom:28, flexWrap:"wrap" }}>
        {levels.map(l=>(
          <button key={l} onClick={()=>setFilter(l)} style={{ background:filter===l?C.accentDim:"rgba(255,255,255,0.04)", border:`1px solid ${filter===l?C.accentMid:C.border}`, color:filter===l?C.accent:C.textMuted, borderRadius:20, padding:"6px 16px", fontSize:13, fontWeight:500, transition:"all .15s" }}>
            {l}
          </button>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))", gap:20 }}>
        {DUMMY.courses.filter(c=>filter==="All"||c.level===filter).map(c=>(
          <Card key={c.id} hoverable style={{ display:"flex", flexDirection:"column" }}>
            <div style={{ height:140, borderRadius:10, background:`linear-gradient(135deg,${c.color}22,${c.color}08)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:52, marginBottom:16, border:`1px solid ${c.color}22` }}>
              {c.badge}
            </div>
            <div style={{ display:"flex", gap:8, marginBottom:10 }}>
              <Badge color={c.color}>{c.level}</Badge>
              {c.progress===100 && <Badge color={C.green}>✅ Completed</Badge>}
              {c.progress>0 && c.progress<100 && <Badge color={C.accent}>In Progress</Badge>}
            </div>
            <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:16, marginBottom:6, lineHeight:1.3 }}>{c.title}</h3>
            <p style={{ color:C.textMuted, fontSize:13, lineHeight:1.6, marginBottom:14, flex:1 }}>{c.desc}</p>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12, borderTop:`1px solid ${C.border}`, paddingTop:12 }}>
              <span style={{ color:C.textMuted, fontSize:12 }}>👨‍🏫 {c.instructor}</span>
              <span style={{ color:C.textMuted, fontSize:12 }}>📚 {c.lessons} lessons</span>
            </div>
            {c.progress>0 && <ProgressBar value={c.progress} color={c.color} />}
            <Btn variant={c.progress>0?"primary":"secondary"} onClick={()=>{ setActiveCourse(c); setPage("lesson"); }} style={{ marginTop:14, width:"100%", borderRadius:10 }}>
              {c.progress===100?"Review →":c.progress>0?"Continue →":"Start Course →"}
            </Btn>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ══════════════════ PAGE: LESSON ══════════════════
function LessonPage({ course }) {
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [activeLesson, setActiveLesson] = useState(3);

  return (
    <div style={{ maxWidth:1280, margin:"0 auto", padding:"24px", display:"grid", gridTemplateColumns:"280px 1fr", gap:20, alignItems:"start" }}>
      {/* Sidebar */}
      <div style={{ position:"sticky", top:80 }}>
        <Card style={{ padding:16 }}>
          <div style={{ marginBottom:14 }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, marginBottom:4 }}>{course?.title || DUMMY.courses[1].title}</div>
            <ProgressBar value={course?.progress || 64} color={course?.color || C.accent} />
            <div style={{ color:C.textMuted, fontSize:11, marginTop:6 }}>{course?.progress || 64}% complete</div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
            {DUMMY.lessons.map((l,i)=>(
              <div key={l.id} onClick={()=>setActiveLesson(i)} style={{ display:"flex", gap:10, alignItems:"center", padding:"9px 10px", borderRadius:9, background:activeLesson===i?C.accentDim:"transparent", border:`1px solid ${activeLesson===i?C.accentMid:"transparent"}`, cursor:"pointer", transition:"all .15s" }}>
                <div style={{ width:22, height:22, borderRadius:"50%", background:l.done?`${C.green}22`:(l.active?`${C.accent}22`:`rgba(255,255,255,0.04)`), border:`1.5px solid ${l.done?C.green:l.active?C.accent:C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:l.done?C.green:l.active?C.accent:C.textMuted, flexShrink:0 }}>
                  {l.done?"✓":i+1}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:500, color:activeLesson===i?C.accent:C.text, lineHeight:1.3 }}>{l.title}</div>
                  <div style={{ fontSize:10, color:C.textMuted }}>{l.type} · {l.duration}</div>
                </div>
                <Badge color={C.amber}>{l.xp}xp</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Main lesson area */}
      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        <Card style={{ background:`linear-gradient(135deg,${C.bgCard},${C.bgSurface})` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
            <Badge color={C.accent}>A2 · Grammar</Badge>
            <div style={{ display:"flex", gap:8 }}>
              <Badge color={C.amber}>🔥 23 streak</Badge>
              <Badge color={C.rose}>❤️ 5 lives</Badge>
            </div>
          </div>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:24, letterSpacing:-0.5, marginTop:12, marginBottom:4 }}>
            {DUMMY.lessons[activeLesson]?.title || "Family Members"}
          </h2>
          <p style={{ color:C.textMuted, fontSize:13 }}>Learn vocabulary and sentences about family in German</p>
        </Card>

        {/* Exercise */}
        <Card>
          <div style={{ background:`${C.accentDim}`, border:`1px solid ${C.accentMid}`, borderRadius:10, padding:"10px 14px", marginBottom:20, fontSize:13, color:C.accent }}>
            💡 Hint: {DUMMY.exercise.hint}
          </div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:20, marginBottom:24, lineHeight:1.4 }}>
            {DUMMY.exercise.question}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
            {DUMMY.exercise.options.map((opt,i)=>{
              let border = C.border, bg = C.bgSurface, color = C.text;
              if(answered){
                if(i===DUMMY.exercise.correct){ border=C.green; bg=`${C.green}18`; color=C.green; }
                else if(i===selected && i!==DUMMY.exercise.correct){ border=C.rose; bg=`${C.rose}18`; color=C.rose; }
              } else if(selected===i){ border=C.accent; bg=C.accentDim; color=C.accent; }
              return (
                <div key={i} onClick={()=>{ if(!answered){ setSelected(i); } }} style={{ border:`1.5px solid ${border}`, background:bg, color, borderRadius:11, padding:"14px 18px", cursor:answered?"default":"pointer", fontSize:14, fontWeight:500, transition:"all .2s", display:"flex", gap:12, alignItems:"center" }}>
                  <div style={{ width:28, height:28, borderRadius:"50%", background:`${border}22`, border:`1.5px solid ${border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, flexShrink:0 }}>
                    {String.fromCharCode(65+i)}
                  </div>
                  {opt}
                </div>
              );
            })}
          </div>
          {!answered ? (
            <Btn variant="primary" onClick={()=>selected!==null&&setAnswered(true)} disabled={selected===null} style={{ width:"100%", padding:"13px", fontSize:15, borderRadius:11 }}>
              Check Answer
            </Btn>
          ) : (
            <div>
              <div style={{ background:selected===DUMMY.exercise.correct?`${C.green}18`:`${C.rose}18`, border:`1px solid ${selected===DUMMY.exercise.correct?C.green:C.rose}`, borderRadius:10, padding:"12px 16px", marginBottom:14, color:selected===DUMMY.exercise.correct?C.green:C.rose, fontSize:14, fontWeight:600 }}>
                {selected===DUMMY.exercise.correct?"🎉 Correct! Well done! +30 XP":"❌ Not quite. The correct answer is: Mein Vater ist Arzt."}
              </div>
              <Btn variant="primary" onClick={()=>{ setAnswered(false); setSelected(null); }} style={{ width:"100%", padding:"13px", fontSize:15, borderRadius:11 }}>
                Continue →
              </Btn>
            </div>
          )}
        </Card>

        {/* AI Tutor */}
        <Card>
          <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
            <div style={{ width:40, height:40, borderRadius:12, background:`${C.purple}22`, border:`1px solid ${C.purple}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>🤖</div>
            <div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, color:C.purple, marginBottom:6 }}>AI Tutor — Ebenex Assistant</div>
              <div style={{ color:C.textDim, fontSize:13, lineHeight:1.7 }}>
                In German, the word "Arzt" (doctor) is masculine and doesn't use an article in the predicate position. For feminine, you'd say "Ärztin". This is a key grammar rule — professions after "sein" (to be) drop the article. Example: <span style={{ color:C.accent, fontFamily:"monospace" }}>Er ist Lehrer.</span> (He is a teacher.)
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ══════════════════ PAGE: COMMUNITY ══════════════════
function CommunityPage() {
  const [msg, setMsg] = useState("");
  const [msgs, setMsgs] = useState(DUMMY.messages);
  const groups = [
    { name:"A2 Study Circle", members:234, icon:"📚", active:true },
    { name:"Grammar Warriors", members:892, icon:"⚔️", active:false },
    { name:"Berlin Prep 2025", members:67, icon:"🇩🇪", active:false },
    { name:"Language Exchange", members:1240, icon:"🌍", active:false },
  ];

  const sendMsg = () => {
    if(!msg.trim()) return;
    setMsgs(p=>[...p,{id:Date.now(),user:"Arjun Menon",avatar:"AM",text:msg,time:"just now",color:C.accent}]);
    setMsg("");
  };

  return (
    <div style={{ maxWidth:1280, margin:"0 auto", padding:"24px", display:"grid", gridTemplateColumns:"260px 1fr 260px", gap:20, alignItems:"start" }}>
      {/* Left: Groups */}
      <div style={{ position:"sticky", top:80 }}>
        <Card>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, marginBottom:14 }}>💬 Groups</div>
          {groups.map(g=>(
            <div key={g.name} style={{ display:"flex", gap:10, alignItems:"center", padding:"10px", borderRadius:10, background:g.active?C.accentDim:"transparent", border:`1px solid ${g.active?C.accentMid:"transparent"}`, marginBottom:6, cursor:"pointer" }}>
              <div style={{ fontSize:20 }}>{g.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:500, color:g.active?C.accent:C.text }}>{g.name}</div>
                <div style={{ fontSize:11, color:C.textMuted }}>{g.members} members</div>
              </div>
            </div>
          ))}
          <Btn variant="secondary" style={{ width:"100%", marginTop:8, fontSize:12 }}>+ Create Group</Btn>
        </Card>
      </div>

      {/* Center: Chat */}
      <Card style={{ display:"flex", flexDirection:"column", height:"70vh", padding:0, overflow:"hidden" }}>
        <div style={{ padding:"16px 20px", borderBottom:`1px solid ${C.border}`, display:"flex", gap:12, alignItems:"center" }}>
          <div style={{ fontSize:20 }}>📚</div>
          <div>
            <div style={{ fontWeight:700, fontSize:15 }}>A2 Study Circle</div>
            <div style={{ color:C.textMuted, fontSize:12 }}>234 members · 12 online</div>
          </div>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:20, display:"flex", flexDirection:"column", gap:16 }}>
          {msgs.map(m=>(
            <div key={m.id} style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
              <Avatar initials={m.avatar} size={34} color={m.color} />
              <div>
                <div style={{ display:"flex", gap:10, alignItems:"baseline", marginBottom:4 }}>
                  <span style={{ fontWeight:600, fontSize:13, color:m.color }}>{m.user}</span>
                  <span style={{ color:C.textMuted, fontSize:11 }}>{m.time} ago</span>
                </div>
                <div style={{ background:C.bgSurface, border:`1px solid ${C.border}`, borderRadius:12, borderTopLeftRadius:4, padding:"10px 14px", fontSize:13, lineHeight:1.6, maxWidth:480 }}>
                  {m.text}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding:"12px 16px", borderTop:`1px solid ${C.border}`, display:"flex", gap:10 }}>
          <input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()} placeholder="Type a message… (Enter to send)" style={{ flex:1, background:C.bgSurface, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", color:C.text, fontSize:13, fontFamily:"'DM Sans',sans-serif" }} />
          <Btn variant="primary" onClick={sendMsg} style={{ padding:"10px 18px", borderRadius:10 }}>Send</Btn>
        </div>
      </Card>

      {/* Right: Members online */}
      <div style={{ position:"sticky", top:80 }}>
        <Card>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, marginBottom:14 }}>🟢 Online Now</div>
          {[
            { name:"Sofia Reyes", avatar:"SR", level:"A2", color:C.purple },
            { name:"Yuki Tanaka", avatar:"YT", level:"B1", color:C.green },
            { name:"Carlos Rivera", avatar:"CR", level:"A1", color:C.rose },
            { name:"Mei Lin", avatar:"ML", level:"B2", color:C.accent },
            { name:"Omar Hassan", avatar:"OH", level:"A2", color:C.amber },
          ].map(u=>(
            <div key={u.name} style={{ display:"flex", gap:10, alignItems:"center", padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
              <div style={{ position:"relative" }}>
                <Avatar initials={u.avatar} size={32} color={u.color} />
                <div style={{ position:"absolute", bottom:0, right:0, width:9, height:9, borderRadius:"50%", background:C.green, border:"2px solid #0d1117" }} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:500 }}>{u.name}</div>
                <div style={{ fontSize:11, color:C.textMuted }}>Level {u.level}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ══════════════════ PAGE: ACHIEVEMENTS ══════════════════
function AchievementsPage() {
  return (
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"32px 24px" }}>
      <div style={{ marginBottom:32 }}>
        <Badge color={C.amber}>Achievements & Certificates</Badge>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:36, letterSpacing:-1.5, marginTop:10, marginBottom:8 }}>Your Progress</h1>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, marginBottom:32 }}>
        <Stat icon="🏆" value="5" label="Badges Earned" color={C.amber} />
        <Stat icon="📜" value="2" label="Certificates" color={C.green} />
        <Stat icon="⚡" value={DUMMY.user.xp.toLocaleString()} label="Total XP" color={C.accent} />
      </div>

      <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:20, marginBottom:16 }}>🏅 Badges</h2>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:14, marginBottom:36 }}>
        {DUMMY.achievements.map(a=>(
          <Card key={a.title} style={{ opacity:a.earned?1:0.45, textAlign:"center", filter:a.earned?"none":"grayscale(1)" }}>
            <div style={{ fontSize:44, marginBottom:10 }}>{a.icon}</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, color:a.earned?a.color:C.textMuted, marginBottom:4 }}>{a.title}</div>
            <div style={{ color:C.textMuted, fontSize:12, lineHeight:1.5, marginBottom:8 }}>{a.desc}</div>
            {a.earned
              ? <Badge color={a.color}>Earned {a.date}</Badge>
              : <Badge color={C.textMuted}>Locked</Badge>
            }
          </Card>
        ))}
      </div>

      <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:20, marginBottom:16 }}>📜 Certificates</h2>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        {[
          { title:"German A1 Certificate", issued:"March 18, 2025", issuer:"Ebenex Platform", color:C.green },
          { title:"A2 Grammar Masterclass", issued:"April 2, 2025", issuer:"Prof. Klaus Müller", color:C.accent },
        ].map(cert=>(
          <Card key={cert.title} style={{ background:`linear-gradient(135deg,${cert.color}12,${C.bgCard})`, border:`1px solid ${cert.color}33` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ fontSize:32, marginBottom:8 }}>📜</div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:17, color:cert.color, marginBottom:4 }}>{cert.title}</div>
                <div style={{ color:C.textMuted, fontSize:12, marginBottom:4 }}>Issued: {cert.issued}</div>
                <div style={{ color:C.textMuted, fontSize:12 }}>By: {cert.issuer}</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:8, marginTop:16 }}>
              <Btn variant="success" style={{ flex:1, fontSize:12, padding:"8px" }}>Download PDF</Btn>
              <Btn variant="secondary" style={{ flex:1, fontSize:12, padding:"8px" }}>Share LinkedIn</Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ══════════════════ PAGE: PROFILE ══════════════════
function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(DUMMY.user.name);
  const [bio, setBio] = useState("Passionate language learner from Kerala, India 🇮🇳. Learning German to pursue my Masters in Berlin. Currently at A2!");

  return (
    <div style={{ maxWidth:980, margin:"0 auto", padding:"32px 24px" }}>
      <div style={{ display:"grid", gridTemplateColumns:"300px 1fr", gap:24, alignItems:"start" }}>
        {/* Profile card */}
        <Card style={{ textAlign:"center" }}>
          <div style={{ width:80, height:80, borderRadius:"50%", background:`${C.accent}22`, border:`3px solid ${C.accent}55`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, fontWeight:800, fontFamily:"'Syne',sans-serif", color:C.accent, margin:"0 auto 16px" }}>
            {DUMMY.user.avatar}
          </div>
          {editing ? (
            <input value={name} onChange={e=>setName(e.target.value)} style={{ width:"100%", background:C.bgSurface, border:`1px solid ${C.accentMid}`, borderRadius:8, padding:"6px 10px", color:C.text, fontSize:16, fontFamily:"'Syne',sans-serif", fontWeight:700, textAlign:"center", marginBottom:8 }} />
          ) : (
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, marginBottom:4 }}>{name}</div>
          )}
          <div style={{ color:C.textMuted, fontSize:13, marginBottom:12 }}>{DUMMY.user.email}</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6, justifyContent:"center", marginBottom:16 }}>
            <Badge color={C.green}>Level {DUMMY.user.level}</Badge>
            <Badge color={C.accent}>{DUMMY.user.institute}</Badge>
          </div>
          <Btn variant={editing?"primary":"secondary"} onClick={()=>setEditing(!editing)} style={{ width:"100%", borderRadius:10 }}>
            {editing?"Save Changes ✓":"Edit Profile"}
          </Btn>
        </Card>

        {/* Details */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
            <Stat icon="🔥" value={DUMMY.user.streak} label="Day Streak" color={C.amber} />
            <Stat icon="⚡" value={DUMMY.user.xp.toLocaleString()} label="Total XP" color={C.accent} />
            <Stat icon="🏆" value="5" label="Badges" color={C.purple} />
          </div>

          <Card>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15 }}>About Me</div>
              {editing && <span style={{ color:C.accent, fontSize:12 }}>editing…</span>}
            </div>
            {editing ? (
              <textarea value={bio} onChange={e=>setBio(e.target.value)} rows={4} style={{ width:"100%", background:C.bgSurface, border:`1px solid ${C.accentMid}`, borderRadius:8, padding:"10px 12px", color:C.text, fontSize:13, fontFamily:"'DM Sans',sans-serif", lineHeight:1.6, resize:"vertical" }} />
            ) : (
              <p style={{ color:C.textDim, fontSize:13, lineHeight:1.7 }}>{bio}</p>
            )}
          </Card>

          <Card>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, marginBottom:14 }}>Learning Progress</div>
            {DUMMY.courses.filter(c=>c.progress>0).map(c=>(
              <div key={c.id} style={{ marginBottom:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ fontSize:13, fontWeight:500 }}>{c.title}</span>
                  <span style={{ color:c.color, fontSize:13, fontWeight:700 }}>{c.progress}%</span>
                </div>
                <ProgressBar value={c.progress} color={c.color} />
              </div>
            ))}
          </Card>

          <Card>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, marginBottom:14 }}>Account Settings</div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {[["Email","arjun@gmail.com"],["Native Language","Malayalam"],["Learning Goal","Move to Germany for Masters"],["Notifications","Email + Push enabled"]].map(([k,v])=>(
                <div key={k} style={{ display:"flex", justifyContent:"space-between", borderBottom:`1px solid ${C.border}`, paddingBottom:10 }}>
                  <span style={{ color:C.textMuted, fontSize:13 }}>{k}</span>
                  <span style={{ fontSize:13, fontWeight:500 }}>{v}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ══════════════════ PAGE: TEACHER PORTAL ══════════════════
function TeacherPage() {
  return (
    <div style={{ maxWidth:1280, margin:"0 auto", padding:"32px 24px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:28, flexWrap:"wrap", gap:16 }}>
        <div>
          <Badge color={C.purple}>Teacher Portal</Badge>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:32, letterSpacing:-1, marginTop:10 }}>Welcome, {DUMMY.teacher.name}</h1>
          <p style={{ color:C.textMuted, marginTop:6 }}>Manage your courses, students, and schedule.</p>
        </div>
        <Btn variant="primary">+ Create New Course</Btn>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:28 }}>
        <Stat icon="👩‍🎓" value={DUMMY.teacher.students} label="Total Students" color={C.accent} />
        <Stat icon="📚" value={DUMMY.teacher.courses} label="Active Courses" color={C.purple} />
        <Stat icon="⭐" value={DUMMY.teacher.rating} label="Avg Rating" color={C.amber} />
        <Stat icon="💰" value="₹42,000" label="This Month" color={C.green} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        <Card>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:16, marginBottom:16 }}>📚 My Courses</div>
          {DUMMY.courses.slice(0,3).map(c=>(
            <div key={c.id} style={{ display:"flex", gap:12, alignItems:"center", padding:"12px 0", borderBottom:`1px solid ${C.border}` }}>
              <div style={{ width:40, height:40, borderRadius:10, background:`${c.color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{c.badge}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, marginBottom:2 }}>{c.title}</div>
                <div style={{ color:C.textMuted, fontSize:11 }}>{c.enrolled.toLocaleString()} students enrolled</div>
              </div>
              <Badge color={c.color}>{c.level}</Badge>
            </div>
          ))}
        </Card>

        <Card>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:16, marginBottom:16 }}>👩‍🎓 Recent Students</div>
          {DUMMY.students.map(s=>(
            <div key={s.name} style={{ display:"flex", gap:12, alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${C.border}` }}>
              <Avatar initials={s.avatar} size={34} color={C.purple} />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600 }}>{s.name}</div>
                <div style={{ display:"flex", gap:8, marginTop:4 }}>
                  <Badge color={C.accent}>{s.level}</Badge>
                  <span style={{ color:C.amber, fontSize:11 }}>🔥 {s.streak}d</span>
                </div>
              </div>
              <div style={{ width:80 }}>
                <ProgressBar value={s.progress} color={C.purple} />
                <div style={{ color:C.textMuted, fontSize:10, marginTop:3, textAlign:"right" }}>{s.progress}%</div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ══════════════════ PAGE: INSTITUTE ERP ══════════════════
function InstitutePage() {
  const tabs = ["Overview","Students","Teachers","Classes","Analytics"];
  const [tab, setTab] = useState("Overview");

  return (
    <div style={{ maxWidth:1280, margin:"0 auto", padding:"32px 24px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24, flexWrap:"wrap", gap:16 }}>
        <div>
          <Badge color={C.rose}>ERP Dashboard</Badge>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:32, letterSpacing:-1, marginTop:10 }}>{DUMMY.institute.name}</h1>
          <div style={{ display:"flex", gap:8, marginTop:8 }}>
            <Badge color={C.purple}>Pro Plan</Badge>
            <Badge color={C.green}>✅ Active</Badge>
          </div>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <Btn variant="secondary">+ Invite Students</Btn>
          <Btn variant="primary">+ Add Teacher</Btn>
        </div>
      </div>

      <div style={{ display:"flex", gap:6, marginBottom:24 }}>
        {tabs.map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{ background:tab===t?C.accentDim:"rgba(255,255,255,0.04)", border:`1px solid ${tab===t?C.accentMid:C.border}`, color:tab===t?C.accent:C.textMuted, borderRadius:8, padding:"7px 16px", fontSize:13, fontWeight:500, transition:"all .15s" }}>{t}</button>
        ))}
      </div>

      {tab==="Overview" && (
        <>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
            <Stat icon="👩‍🎓" value={DUMMY.institute.students} label="Total Students" color={C.accent} />
            <Stat icon="👨‍🏫" value={DUMMY.institute.teachers} label="Teachers" color={C.purple} />
            <Stat icon="🏫" value="8" label="Active Classes" color={C.green} />
            <Stat icon="💰" value={DUMMY.institute.revenue} label="Revenue MTD" color={C.amber} />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
            <Card>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:16, marginBottom:16 }}>📅 Upcoming Classes</div>
              {[
                { name:"A1 Batch Morning", time:"9:00 AM Today", teacher:"Sarah Weber", students:24 },
                { name:"A2 Conversation", time:"2:00 PM Today", teacher:"Klaus Müller", students:18 },
                { name:"B1 Grammar Intensive", time:"10:00 AM Tomorrow", teacher:"Anna Schreiber", students:15 },
              ].map(cl=>(
                <div key={cl.name} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:`1px solid ${C.border}` }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600 }}>{cl.name}</div>
                    <div style={{ color:C.textMuted, fontSize:11, marginTop:2 }}>{cl.time} · {cl.teacher}</div>
                  </div>
                  <Badge color={C.accent}>{cl.students} students</Badge>
                </div>
              ))}
            </Card>
            <Card>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:16, marginBottom:16 }}>📊 Level Distribution</div>
              {[["A1","A1 Beginners",180,C.green],["A2","A2 Elementary",142,C.accent],["B1","B1 Intermediate",98,C.purple],["B2","B2 Upper",67,C.amber]].map(([l,n,c,col])=>(
                <div key={l} style={{ marginBottom:14 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                    <span style={{ fontSize:12, color:C.textDim }}>{n}</span>
                    <span style={{ fontSize:12, color:col, fontWeight:600 }}>{c} students</span>
                  </div>
                  <ProgressBar value={c/5} color={col} />
                </div>
              ))}
            </Card>
          </div>
        </>
      )}

      {tab==="Students" && (
        <Card>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:16, marginBottom:16 }}>All Students</div>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr", gap:0 }}>
            {["Student","Level","Progress","Streak","Action"].map(h=>(
              <div key={h} style={{ padding:"10px 12px", background:"rgba(255,255,255,0.04)", fontSize:11, color:C.textMuted, fontWeight:600, textTransform:"uppercase", letterSpacing:1 }}>{h}</div>
            ))}
            {DUMMY.students.map((s,i)=>(
              <>
                <div key={s.name+"n"} style={{ padding:"12px", borderBottom:`1px solid ${C.border}`, display:"flex", gap:10, alignItems:"center" }}>
                  <Avatar initials={s.avatar} size={30} color={C.accent} />
                  <span style={{ fontSize:13, fontWeight:500 }}>{s.name}</span>
                </div>
                <div key={s.name+"l"} style={{ padding:"12px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center" }}><Badge color={C.accent}>{s.level}</Badge></div>
                <div key={s.name+"p"} style={{ padding:"12px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:8 }}><ProgressBar value={s.progress} /><span style={{ fontSize:11, color:C.textMuted }}>{s.progress}%</span></div>
                <div key={s.name+"s"} style={{ padding:"12px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center" }}><span style={{ color:C.amber, fontSize:12 }}>🔥 {s.streak}d</span></div>
                <div key={s.name+"a"} style={{ padding:"12px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center" }}><Btn variant="ghost" style={{ fontSize:11, padding:"4px 10px" }}>View →</Btn></div>
              </>
            ))}
          </div>
        </Card>
      )}

      {(tab==="Teachers"||tab==="Classes"||tab==="Analytics") && (
        <Card style={{ textAlign:"center", padding:"60px 40px" }}>
          <div style={{ fontSize:48, marginBottom:16 }}>{tab==="Teachers"?"👨‍🏫":tab==="Classes"?"🏫":"📊"}</div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:20, marginBottom:8 }}>{tab} Management</div>
          <div style={{ color:C.textMuted, fontSize:14 }}>Full {tab.toLowerCase()} management interface with data coming from your ERP API.</div>
        </Card>
      )}
    </div>
  );
}

// ══════════════════ PAGE: DOCUMENTATION ══════════════════
function DocsPage() {
  const [section, setSection] = useState("overview");
  const sections = [
    ["overview","Platform Overview"],["auth","Auth Flow"],["student","Student Journey"],
    ["ai","AI Engine"],["erp","ERP System"],["teacher","Teacher Flow"],
    ["community","Community & Chat"],["architecture","Architecture"],
    ["stack","Tech Stack"],["folder","Folder Structure"],["scale","Scalability"],
    ["roadmap","Roadmap"],
  ];

  const content = {
    overview: {
      title:"Platform Overview",
      body:(
        <>
          <p>Ebenex is a full-stack, AI-powered German language learning platform combining the engagement of consumer apps like Duolingo with enterprise-grade ERP capabilities for language institutes.</p>
          <h3>Four Primary User Roles</h3>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, margin:"16px 0" }}>
            {[["🎓 Student","Self-paced German learning, AI coaching, gamification, certificates, and institute enrollment.",C.accent],["👨‍🏫 Teacher","Solo or institute-linked teaching with course creation, live classes, and student analytics.",C.purple],["🏫 Institute","B2B ERP plan to manage students, teachers, classes, exams, communities, and visa guidance.",C.rose],["⚙️ Admin","Platform-level moderation, user management, analytics, billing, and system config.",C.amber]].map(([t,d,c])=>(
              <Card key={t} style={{ borderColor:`${c}33` }}>
                <div style={{ color:c, fontWeight:700, fontSize:14, marginBottom:8 }}>{t}</div>
                <div style={{ color:C.textMuted, fontSize:13, lineHeight:1.6 }}>{d}</div>
              </Card>
            ))}
          </div>
          <h3>Core Platform Features</h3>
          <ul style={{ paddingLeft:20, display:"flex", flexDirection:"column", gap:6, marginTop:12 }}>
            {["AI-adaptive language learning engine with agentic tutoring","CEFR-aligned course structure (A1 → C2)","Gamification: streaks, XP, leagues, badges, hearts","Blockchain-verifiable certificates","Real-time chat and community groups","Multi-tenant ERP system for institutes","Visa guidance module for German-speaking countries","Integrated video for live classes","Mobile apps (React Native)"].map(f=>(
              <li key={f} style={{ color:C.textDim, fontSize:14, lineHeight:1.6 }}>
                <span style={{ color:C.accent }}>›</span> {f}
              </li>
            ))}
          </ul>
        </>
      )
    },
    auth: {
      title:"Auth & Onboarding Flow",
      body:(
        <>
          <p>Authentication is handled via a secure, role-aware system supporting multiple sign-in methods with JWT access/refresh token pairs.</p>
          <h3>Authentication Methods</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:8, margin:"12px 0" }}>
            {[["Email + Password","bcrypt hashed, rate-limited login (5 attempts/15min)"],["OAuth 2.0","Google, Apple, and Microsoft SSO via Passport.js strategies"],["Magic Link","Passwordless one-click email login with 15-minute expiry"],["Institute Invite","Token-based invite links for bulk student/teacher onboarding"],["MFA","Optional TOTP via Authenticator apps (OTPLIB)"]].map(([t,d])=>(
              <div key={t} style={{ display:"flex", gap:14, padding:"10px 14px", background:C.bgSurface, borderRadius:10, border:`1px solid ${C.border}` }}>
                <span style={{ color:C.accent, fontWeight:700, fontSize:13, minWidth:150 }}>{t}</span>
                <span style={{ color:C.textMuted, fontSize:13 }}>{d}</span>
              </div>
            ))}
          </div>
          <h3>Token Strategy</h3>
          <div style={{ background:C.bgSurface, border:`1px solid ${C.border}`, borderRadius:10, padding:"14px 16px", margin:"12px 0" }}>
            <pre style={{ fontFamily:"monospace", fontSize:12, color:C.textDim, lineHeight:1.7 }}>{`Access Token:  JWT, 15 minute expiry, signed with RS256
Refresh Token: Opaque, 30 days, stored in httpOnly cookie
Rotation:      New refresh token issued on every use
Revocation:    Redis blocklist for immediate invalidation`}</pre>
          </div>
          <h3>Student Onboarding Flow</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:10, margin:"12px 0" }}>
            {["Register (email/OAuth) → Email OTP verification","Profile setup: name, age, native language, learning goal","AI placement test (10 adaptive questions → CEFR level)","Personalized learning path generated","Dashboard activated with first recommended course"].map((s,i)=>(
              <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                <div style={{ width:26, height:26, borderRadius:"50%", background:`${C.accent}22`, border:`1.5px solid ${C.accent}`, color:C.accent, fontSize:12, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{i+1}</div>
                <div style={{ color:C.textDim, fontSize:13, lineHeight:1.6, paddingTop:3 }}>{s}</div>
              </div>
            ))}
          </div>
        </>
      )
    },
    architecture: {
      title:"System Architecture",
      body:(
        <>
          <p>Ebenex uses a <strong style={{color:C.accent}}>Modular Monolith</strong> architecture — a single deployable unit organized as independent domain modules. This gives the clarity and boundary-enforcement of microservices without the operational complexity, and can be decomposed later.</p>
          <h3>Architecture Layers</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:8, margin:"12px 0" }}>
            {[["Client","Next.js 14 (web) + React Native (mobile)","#00d4ff"],["API Gateway","NestJS REST + GraphQL + WebSocket (Socket.io)","#a78bfa"],["Auth","JWT/OAuth2 middleware, RBAC guards","#fbbf24"],["Domain Modules","Learning, ERP, Community, Visa, Payments — isolated NestJS modules","#4ade80"],["AI Layer","OpenAI API + LangChain agents for adaptive learning","#f472b6"],["Data","PostgreSQL + Prisma ORM + Redis cache + BullMQ queues","#22d3ee"],["Storage","AWS S3 for media, certificates, uploaded documents","#fb923c"]].map(([l,d,c])=>(
              <div key={l} style={{ display:"flex", gap:14, alignItems:"center", padding:"10px 14px", background:C.bgSurface, borderRadius:10, border:`1px solid ${C.border}` }}>
                <span style={{ minWidth:130, background:`${c}18`, border:`1px solid ${c}44`, color:c, borderRadius:6, padding:"2px 10px", fontSize:12, fontWeight:600, textAlign:"center" }}>{l}</span>
                <span style={{ color:C.textMuted, fontSize:13 }}>{d}</span>
              </div>
            ))}
          </div>
          <h3>Multi-tenancy Model</h3>
          <p>Each institute is a tenant with schema-level isolation in PostgreSQL. Shared platform content (courses, lessons) lives in a public schema, while institute-specific data (students, classes, grades) lives in tenant schemas. Row-level security policies enforce access boundaries at the database level.</p>
        </>
      )
    },
    stack: {
      title:"Tech Stack",
      body:(
        <>
          <p>Every technology in the Ebenex stack was chosen for three qualities: developer experience, production reliability, and horizontal scalability.</p>
          <div style={{ display:"flex", flexDirection:"column", gap:6, margin:"16px 0" }}>
            {[["NestJS","Backend","TypeScript-first API, modular, DI, WebSocket support","#fb923c"],["Next.js 14","Frontend","SSR/SSG, App Router, Server Components, excellent SEO","#00d4ff"],["PostgreSQL 16","Database","ACID, complex relational models, JSON support, multi-tenant schemas","#a78bfa"],["Prisma","ORM","Type-safe queries, schema-as-code, migrations, relation queries","#fbbf24"],["Redis 7","Cache + Pub/Sub","Session cache, rate limiting, WebSocket fanout across pods","#4ade80"],["BullMQ","Job Queue","Emails, notifications, AI jobs, cert generation — reliable async processing","#f472b6"],["AWS S3","Storage","Durable, scalable object storage for all media and documents","#fb923c"],["Stripe","Payments","Subscriptions, one-time, marketplace payouts, full webhook support","#22d3ee"],["Socket.io","Real-time","WebSocket server with Redis adapter for multi-instance deployments","#a78bfa"],["Docker + K8s","DevOps","Container orchestration, horizontal scaling, zero-downtime deploys","#fbbf24"],["LangChain + OpenAI","AI","Agentic pipelines, adaptive curriculum, pronunciation scoring","#4ade80"],["GitHub Actions","CI/CD","Automated lint, test, build, deploy on every push to main","#f472b6"]].map(([t,r,d,c])=>(
              <div key={t} style={{ display:"grid", gridTemplateColumns:"160px 120px 1fr", gap:12, padding:"10px 14px", background:C.bgSurface, borderRadius:10, border:`1px solid ${C.border}`, alignItems:"center" }}>
                <span style={{ background:`${c}18`, border:`1px solid ${c}44`, color:c, borderRadius:6, padding:"3px 10px", fontSize:12, fontWeight:700, textAlign:"center" }}>{t}</span>
                <span style={{ color:C.textMuted, fontSize:12 }}>{r}</span>
                <span style={{ color:C.textDim, fontSize:12, lineHeight:1.5 }}>{d}</span>
              </div>
            ))}
          </div>
        </>
      )
    },
    folder: {
      title:"Folder Structure",
      body:(
        <>
          <p>The project uses a <strong style={{color:C.accent}}>Turborepo monorepo</strong> structure with separate <code style={{background:C.bgSurface,padding:"2px 6px",borderRadius:4,fontSize:12}}>apps/</code> and <code style={{background:C.bgSurface,padding:"2px 6px",borderRadius:4,fontSize:12}}>packages/</code> directories. Shared types, config, and the database schema are extracted into packages to prevent duplication.</p>
          <div style={{ background:C.bgSurface, border:`1px solid ${C.border}`, borderRadius:12, padding:"16px 20px", margin:"16px 0", overflowX:"auto" }}>
            <pre style={{ fontFamily:"'Fira Code',monospace", fontSize:12, lineHeight:1.8, color:"#888" }}>{`ebenex/
├── apps/
│   ├── api/                    NestJS backend
│   │   └── src/modules/
│   │       ├── auth/
│   │       ├── users/  students/  teachers/
│   │       ├── courses/  lessons/  exercises/
│   │       ├── assessment/
│   │       ├── institutes/  classes/  schedules/
│   │       ├── payments/  subscriptions/
│   │       ├── chat/  groups/  notifications/
│   │       ├── visa/  certificates/  achievements/
│   │       ├── analytics/  ai/  storage/  admin/
│   │       └── common/       Guards, decorators, pipes
│   │
│   └── web/                    Next.js 14 frontend
│       ├── app/
│       │   ├── (auth)/         Login · Register pages
│       │   ├── (student)/      Dashboard · Courses · Profile
│       │   ├── (teacher)/      Teacher portal
│       │   ├── (institute)/    ERP admin panel
│       │   └── (admin)/        Platform admin
│       ├── components/ui/  learning/  erp/  shared/
│       └── lib/                API clients, hooks, utils
│
├── packages/
│   ├── database/               Shared Prisma schema
│   ├── types/                  Shared TypeScript DTOs
│   ├── config/                 Shared env schemas (Zod)
│   └── ui/                     Shared component library
│
├── infra/
│   ├── docker/  k8s/  terraform/
└── docs/`}</pre>
          </div>
        </>
      )
    },
    scale: {
      title:"Scalability",
      body:(
        <>
          <p>Ebenex is designed to scale from 1,000 to 10,000,000 users without fundamental architectural rewrites. The system is stateless at the API layer and uses horizontal scaling throughout.</p>
          <h3>Scaling Phases</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:10, margin:"12px 0" }}>
            {[["Phase 1: 0–10k users","Single region · Single PostgreSQL instance · Vercel deploy for Next.js · Single NestJS pod","#4ade80"],["Phase 2: 10k–100k users","Add Redis cluster · AWS CloudFront CDN · PostgreSQL read replica · K8s with HPA · BullMQ workers","#22d3ee"],["Phase 3: 100k–1M users","Multi-region deployment · DB connection pooling (PgBouncer) · Shard high-volume tables · Dedicated AI processing cluster","#a78bfa"],["Phase 4: 1M+ users","Extract Chat and AI as standalone microservices · Global edge functions · Full event-driven architecture with Kafka","#fbbf24"]].map(([p,d,c])=>(
              <div key={p} style={{ border:`1px solid ${c}33`, borderLeft:`3px solid ${c}`, borderRadius:10, padding:"14px 16px" }}>
                <div style={{ color:c, fontWeight:700, fontSize:14, marginBottom:6 }}>{p}</div>
                <div style={{ color:C.textMuted, fontSize:13, lineHeight:1.6 }}>{d}</div>
              </div>
            ))}
          </div>
          <h3>Key Scaling Decisions</h3>
          <ul style={{ paddingLeft:20, display:"flex", flexDirection:"column", gap:6, marginTop:12 }}>
            {["Stateless API pods — session state in Redis, not memory","WebSocket scaling via Redis Pub/Sub adapter (Socket.io)","AI jobs queued via BullMQ — workers scale independently from API","S3 for all binary storage — no local disk dependency","Multi-tenant DB isolation without sacrificing query performance (schema-per-tenant)","CQRS for analytics — separate read models from write models"].map(f=>(
              <li key={f} style={{ color:C.textDim, fontSize:13, lineHeight:1.7 }}><span style={{ color:C.accent }}>›</span> {f}</li>
            ))}
          </ul>
        </>
      )
    },
    roadmap: {
      title:"Product Roadmap",
      body:(
        <>
          {[["Phase 1 — MVP","Months 1–3",C.green,["Student auth + profile + onboarding","A1/A2 course content (42 lessons)","Core exercise types (translate, MCQ, fill-blank)","Streak, XP, hearts gamification","Teacher registration + admin approval","Institute registration + basic ERP","Stripe subscription billing"]],["Phase 2 — Growth","Months 4–6",C.accent,["Full A1–B2 course content","AI placement test + adaptive engine","Real-time chat + group system","Certificate generation + PDF download","Institute analytics dashboard","Visa guidance module (Germany/Austria)","React Native mobile app (iOS + Android)"]],["Phase 3 — Scale","Months 7–12",C.purple,["B2–C2 course content","AI pronunciation engine (speech-to-text)","Live class integration (video)","Blockchain certificate verification","Language exchange network","Enterprise ERP (white-label, subdomain)","Multi-language platform UI"]],["Phase 4 — Global","Year 2+",C.amber,["French, Spanish, Japanese language support","AI-generated course content pipeline","Global institute marketplace","Visa consultant booking network","Corporate B2B language training packages","Public API + SDK for third-party LMS integration"]]].map(([phase,time,color,items])=>(
            <div key={phase} style={{ marginBottom:20 }}>
              <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:10 }}>
                <span style={{ background:`${color}18`, border:`1px solid ${color}44`, color, borderRadius:8, padding:"4px 14px", fontSize:13, fontWeight:700 }}>{phase}</span>
                <span style={{ color:C.textMuted, fontSize:13 }}>{time}</span>
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8, paddingLeft:8 }}>
                {items.map(i=><span key={i} style={{ background:`${color}12`, border:`1px solid ${color}33`, color, borderRadius:20, padding:"3px 12px", fontSize:12 }}>{i}</span>)}
              </div>
            </div>
          ))}
        </>
      )
    },
  };

  const defaultContent = (title) => ({
    title,
    body: (
      <div style={{ textAlign:"center", padding:"60px 20px" }}>
        <div style={{ fontSize:48, marginBottom:16 }}>📝</div>
        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:20, marginBottom:8 }}>{title}</div>
        <div style={{ color:C.textMuted }}>Detailed documentation for this section is available in the full platform docs.</div>
      </div>
    )
  });

  const current = content[section] || defaultContent(sections.find(s=>s[0]===section)?.[1] || section);

  return (
    <div style={{ maxWidth:1280, margin:"0 auto", padding:"24px", display:"grid", gridTemplateColumns:"240px 1fr", gap:24, alignItems:"start" }}>
      {/* Sidebar */}
      <div style={{ position:"sticky", top:80 }}>
        <Card style={{ padding:12 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:13, color:C.textMuted, letterSpacing:2, textTransform:"uppercase", padding:"8px 10px", marginBottom:4 }}>Documentation</div>
          {sections.map(([id,label])=>(
            <button key={id} onClick={()=>setSection(id)} style={{ display:"block", width:"100%", textAlign:"left", background:section===id?C.accentDim:"transparent", border:`1px solid ${section===id?C.accentMid:"transparent"}`, color:section===id?C.accent:C.textMuted, borderRadius:8, padding:"8px 12px", fontSize:13, fontWeight:section===id?600:400, marginBottom:2, transition:"all .15s", cursor:"pointer" }}>
              {label}
            </button>
          ))}
        </Card>
      </div>

      {/* Content */}
      <Card style={{ padding:"32px 36px" }}>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:28, letterSpacing:-1, marginBottom:20, paddingBottom:20, borderBottom:`1px solid ${C.border}` }}>
          {current.title}
        </h1>
        <div style={{ lineHeight:1.8, color:C.textDim, fontSize:14 }}
          className="docs-content">
          <style>{`
            .docs-content p { margin-bottom: 14px; }
            .docs-content h3 { font-family: 'Syne',sans-serif; font-weight: 700; font-size: 17px; color: ${C.text}; margin: 24px 0 12px; letter-spacing: -0.5px; }
            .docs-content strong { color: ${C.text}; }
            .docs-content code { background: ${C.bgSurface}; padding: 2px 6px; border-radius: 4px; font-size: 12px; color: ${C.accent}; }
            .docs-content ul { padding-left: 0; list-style: none; }
          `}</style>
          {current.body}
        </div>
      </Card>
    </div>
  );
}

// ══════════════════ MAIN APP ROUTER ══════════════════
export default function App() {
  const [page, setPage] = useState("landing");
  const [authed, setAuthed] = useState(false);
  const [activeCourse, setActiveCourse] = useState(null);

  const renderPage = () => {
    switch(page) {
      case "landing": return <LandingPage setPage={setPage} />;
      case "login": return <LoginPage setPage={setPage} setAuthed={setAuthed} />;
      case "register": return <RegisterPage setPage={setPage} setAuthed={setAuthed} />;
      case "dashboard": return <DashboardPage setPage={setPage} setActiveCourse={setActiveCourse} />;
      case "courses": return <CoursesPage setPage={setPage} setActiveCourse={setActiveCourse} />;
      case "lesson": return <LessonPage course={activeCourse} />;
      case "community": return <CommunityPage />;
      case "achievements": return <AchievementsPage />;
      case "profile": return <ProfilePage />;
      case "teacher": return <TeacherPage />;
      case "institute": return <InstitutePage />;
      case "docs": return <DocsPage />;
      default: return <LandingPage setPage={setPage} />;
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg }}>
      <Navbar page={page} setPage={setPage} authed={authed} setAuthed={setAuthed} />
      <main key={page} className="fade-up" style={{ animationDuration:".35s" }}>
        {renderPage()}
      </main>
      {/* Footer */}
      <footer style={{ borderTop:`1px solid ${C.border}`, padding:"32px 24px", marginTop:40 }}>
        <div style={{ maxWidth:1280, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:18, letterSpacing:-0.5, background:`linear-gradient(135deg,#fff,${C.accent})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Ebenex</div>
          <div style={{ color:C.textMuted, fontSize:12 }}>© 2025 Ebenex. AI-powered German language learning.</div>
          <div style={{ display:"flex", gap:16 }}>
            {[["teacher","For Teachers"],["institute","For Institutes"],["docs","Docs"]].map(([p,l])=>(
              <span key={p} onClick={()=>setPage(p)} style={{ color:C.textMuted, fontSize:13, cursor:"pointer" }}>{l}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
