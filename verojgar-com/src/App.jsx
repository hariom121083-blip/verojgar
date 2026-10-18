import React, { useEffect, useMemo, useState } from "react";
import {
  Search, Play, Upload, UserRound, MapPin, Sparkles, Menu, X,
  LogOut, Radio, BookOpen, Users, ChevronRight, Clock3, CheckCircle2,
  Video, Plus, ArrowLeft, Mail, ShieldCheck, Building2
} from "lucide-react";
import { supabase, supabaseConfigured } from "./supabaseClient";

const demoVideos = [
  { id:"d1", title:"Mobile Repairing: Charging Problem Basics", creator:"Amit Sharma", city:"Shivpuri", state:"Madhya Pradesh", field:"Mobile Repairing", duration:"12:40", views:12400, image:"https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80", video_url:"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
  { id:"d2", title:"How to Start a Small Food Business", creator:"Neha Verma", city:"Bhopal", state:"Madhya Pradesh", field:"Business", duration:"18:22", views:8300, image:"https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80", video_url:"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
  { id:"d3", title:"Basic Electrician Skills for Beginners", creator:"Rakesh Yadav", city:"Indore", state:"Madhya Pradesh", field:"Electrician", duration:"21:10", views:17400, image:"https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80", video_url:"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
  { id:"d4", title:"Computer & Excel: Start From Zero", creator:"Pooja Jain", city:"Gwalior", state:"Madhya Pradesh", field:"Computer", duration:"15:05", views:9900, image:"https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=900&q=80", video_url:"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
  { id:"d5", title:"Tailoring: Learn Your First 5 Stitches", creator:"Sangeeta Patel", city:"Shivpuri", state:"Madhya Pradesh", field:"Tailoring", duration:"14:35", views:6400, image:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80", video_url:"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
  { id:"d6", title:"Spoken English Daily Practice", creator:"Rahul Khan", city:"Delhi", state:"Delhi", field:"English", duration:"10:18", views:23100, image:"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80", video_url:"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" }
];

const fields = ["All Fields","Mobile Repairing","Computer","Electrician","Tailoring","Beauty & Makeup","Cooking","Business","English","Farming","Graphic Design"];
const cities = ["All Cities","Shivpuri","Bhopal","Gwalior","Indore","Delhi","Jaipur","Agra","Other"];

function formatViews(n=0){ return Intl.NumberFormat("en-IN",{notation:"compact",maximumFractionDigits:1}).format(n); }

function Header({onLogin,onUpload,onHome,user,onLogout,search,setSearch}) {
  const [open,setOpen]=useState(false);
  return <header className="topbar">
    <div className="top-inner">
      <button className="brand" onClick={onHome}><span className="brand-mark">V</span><span>Verojgar<span className="dot">.com</span></span></button>
      <div className="searchbox">
        <Search size={19}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="वीडियो, skill, teacher या city खोजें..." />
        <kbd>⌘ K</kbd>
      </div>
      <nav className="desktop-nav">
        <button className="ghost" onClick={onUpload}><Upload size={18}/> Upload</button>
        {user ? <div className="user-pill"><span className="avatar">{(user.email||"U")[0].toUpperCase()}</span><span className="hide-mobile">{user.email}</span><button onClick={onLogout} title="Logout"><LogOut size={17}/></button></div>
          : <button className="primary small" onClick={onLogin}><UserRound size={18}/> Login</button>}
      </nav>
      <button className="mobile-menu" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
    </div>
    {open && <div className="mobile-nav">
      <button onClick={onUpload}><Upload size={18}/> Upload / Create Channel</button>
      {!user && <button onClick={onLogin}><UserRound size={18}/> Login</button>}
      {user && <button onClick={onLogout}><LogOut size={18}/> Logout</button>}
    </div>}
  </header>
}

function Hero({onExplore,onCreate}) {
 return <section className="hero">
   <div className="hero-copy">
     <div className="eyebrow"><Sparkles size={15}/> भारत का practical learning platform</div>
     <h1>सीखो भी। सिखाओ भी।<br/><span>रोज़गार से जुड़ो।</span></h1>
     <p>Verojgar.com पर अपने शहर के लोगों से नई skills सीखें, अपना channel बनाएं और अपना हुनर दुनिया के सामने रखें।</p>
     <div className="hero-actions">
       <button className="primary" onClick={onExplore}><Play size={18}/> Explore Skills</button>
       <button className="secondary" onClick={onCreate}><Video size={18}/> Create Your Channel</button>
     </div>
     <div className="hero-stats"><span><b>10+</b> skill categories</span><span><b>City-wise</b> learning</span><span><b>Free</b> to start</span></div>
   </div>
   <div className="hero-art">
     <div className="art-card main-card"><img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=85"/><div className="play-float"><Play fill="currentColor"/></div></div>
     <div className="floating-card fc1"><span className="mini-icon"><Users size={18}/></span><div><b>Local Teachers</b><small>अपने शहर से सीखें</small></div></div>
     <div className="floating-card fc2"><span className="mini-icon orange"><MapPin size={18}/></span><div><b>City Wise</b><small>Skill + Location</small></div></div>
   </div>
 </section>
}

function FilterBar({field,setField,city,setCity}) {
 return <div className="filters">
   <div className="filter-scroll">
    {fields.map(f=><button key={f} className={field===f?"chip active":"chip"} onClick={()=>setField(f)}>{f}</button>)}
   </div>
   <label className="city-select"><MapPin size={16}/><select value={city} onChange={e=>setCity(e.target.value)}>{cities.map(c=><option key={c}>{c}</option>)}</select></label>
 </div>
}

function VideoCard({v,onOpen,onDelete,user}) {
 return <article className="video-card">
   <div onClick={()=>onOpen(v)}>
     <div className="thumb">
       <img src={v.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80"} alt={v.title}/>
       <span className="duration">{v.duration || "Video"}</span>
       <span className="thumb-play"><Play fill="currentColor" size={18}/></span>
     </div>
     <div className="video-meta">
       <div className="creator-avatar">{(v.creator||"T")[0]}</div>
       <div>
         <h3>{v.title}</h3>
         <p>{v.creator}</p>
         <small><MapPin size={12}/>{v.city || "India"} · {formatViews(v.views)} views</small>
       </div>
     </div>
   </div>
   {user && v.creator_id === user.id && (
     <button
  type="button"
  style={{
    background: "#dc2626",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    padding: "9px 14px",
    marginTop: "10px",
    cursor: "pointer",
    fontWeight: "600"
  }}
  onClick={(e)=>{e.stopPropagation();onDelete(v);}}
>
  🗑️ Delete Video
</button>
   )}
 </article>
}

function VideoGrid({videos,onOpen,user,onDelete}) {
 return <div className="video-grid">
  {videos.map(v=><VideoCard
    key={v.id}
    v={v}
    onOpen={onOpen}
    user={user}
    onDelete={onDelete}
  />)}
</div>
}

function Login({onBack,onSuccess}) {
 const [mode,setMode]=useState("login");
 const [form,setForm]=useState({name:"",city:"",email:"",state:"Madhya Pradesh",field:"Mobile Repairing"});
 const [loading,setLoading]=useState(false); const [msg,setMsg]=useState("");
 const update=k=>e=>setForm({...form,[k]:e.target.value});
 async function submit(e){
   e.preventDefault(); setLoading(true); setMsg("");
   if(!supabaseConfigured){ setMsg("Demo mode: Supabase connect करने के बाद real login चलेगा."); setLoading(false); return; }
   const {data,error}=await supabase.auth.signInWithOtp({
     email:form.email,
     options:{emailRedirectTo:window.location.origin, data:{name:form.name,city:form.city,state:form.state,field:form.field}}
   });
   if(error) setMsg(error.message);
   else setMsg("Login link आपके email पर भेज दिया गया है। Email खोलकर link पर क्लिक करें।");
   setLoading(false);
 }
 return <div className="auth-page"><button className="back-btn" onClick={onBack}><ArrowLeft size={18}/> Back</button>
  <div className="auth-layout"><div className="auth-image"><img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1100&q=85"/><div><h2>हुनर को पहचान दें।</h2><p>Learn from local experts. Build your own channel. Grow together.</p></div></div>
  <form className="auth-card" onSubmit={submit}><div className="auth-logo"><span className="brand-mark">V</span><b>Verojgar.com</b></div><h1>{mode==="login"?"Welcome back!":"Create your learning profile"}</h1><p className="muted">{mode==="login"?"Email डालें और secure login link पाएं।":"आप किस field में सीखना चाहते हैं, हमें बताएं।"}</p>
   {mode==="signup" && <><Field label="पूरा नाम" value={form.name} onChange={update("name")} placeholder="आपका नाम" icon={<UserRound size={17}/>}/><div className="two"><Field label="City" value={form.city} onChange={update("city")} placeholder="Shivpuri" icon={<MapPin size={17}/>}/><Field label="State" value={form.state} onChange={update("state")} placeholder="Madhya Pradesh"/></div><label className="field"><span>आप क्या सीखना चाहते हैं?</span><select value={form.field} onChange={update("field")}>{fields.slice(1).map(f=><option key={f}>{f}</option>)}</select></label></>}
   <Field label="Email ID" type="email" value={form.email} onChange={update("email")} placeholder="you@example.com" icon={<Mail size={17}/>}/>
   <button className="primary wide" disabled={loading}>{loading?"Please wait...":mode==="login"?"Send Login Link":"Create / Continue"}</button>
   {msg && <div className="notice"><ShieldCheck size={18}/>{msg}</div>}
   <p className="switch">{mode==="login"?"New to Verojgar?":"Already have an account?"} <button type="button" onClick={()=>setMode(mode==="login"?"signup":"login")}>{mode==="login"?"Create profile":"Login"}</button></p>
   <small className="terms">By continuing, you agree to our Terms, Privacy Policy and Community Guidelines.</small>
  </form></div></div>
}

function Field({label,type="text",value,onChange,placeholder,icon}){ return <label className="field"><span>{label}</span><div className="input-wrap">{icon}{<input required type={type} value={value} onChange={onChange} placeholder={placeholder}/>}</div></label> }

function UploadPanel({user,onBack,onUploaded}) {
 const [title,setTitle]=useState(""); const [description,setDescription]=useState(""); const [field,setField]=useState("Mobile Repairing"); const [city,setCity]=useState("Shivpuri"); const [file,setFile]=useState(null); const [thumb,setThumb]=useState(null); const [loading,setLoading]=useState(false); const [msg,setMsg]=useState("");
 async function upload(e){
   e.preventDefault(); if(!file){setMsg("पहले video file चुनें।");return;}
   if(!supabaseConfigured){setMsg("Demo mode में upload disabled है। Supabase connect करने के बाद real upload होगा.");return;}
   if(!user){setMsg("Upload करने के लिए login करें।");return;}
   setLoading(true); setMsg("");
   const ext=file.name.split(".").pop(); const path=`${user.id}/${crypto.randomUUID()}.${ext}`;
   const up=await supabase.storage.from("videos").upload(path,file,{contentType:file.type});
   if(up.error){setMsg(up.error.message);setLoading(false);return;}
   const {data:urlData}=supabase.storage.from("videos").getPublicUrl(path);
   const {data,error}=await supabase.from("videos").insert({title,description,field,city,video_url:urlData.publicUrl,creator_id:user.id}).select().single();
   if(error){setMsg(error.message)} else {setMsg("Video upload हो गया!");onUploaded?.(data);}
   setLoading(false);
 }
 return <div className="upload-page"><button className="back-btn" onClick={onBack}><ArrowLeft size={18}/> Back</button>
  <div className="upload-wrap"><div className="section-heading"><div className="eyebrow"><Upload size={15}/> Creator Studio</div><h1>अपना हुनर upload करें</h1><p>एक अच्छा title, field और city डालें ताकि सही learners तक आपका video पहुंचे।</p></div>
  <form className="upload-card" onSubmit={upload}><div className="upload-drop"><Upload size={36}/><h3>{file?file.name:"Video चुनें"}</h3><p>MP4/WebM recommended · large videos may take time</p><input type="file" accept="video/*" onChange={e=>setFile(e.target.files?.[0]||null)}/></div>
   <div className="two"><Field label="Video Title" value={title} onChange={e=>setTitle(e.target.value)} placeholder="जैसे: Mobile Repairing - Charging Pin बदलना"/><label className="field"><span>Skill / Field</span><select value={field} onChange={e=>setField(e.target.value)}>{fields.slice(1).map(f=><option key={f}>{f}</option>)}</select></label></div>
   <div className="two"><Field label="City" value={city} onChange={e=>setCity(e.target.value)} placeholder="Shivpuri"/><label className="field"><span>Thumbnail (optional)</span><input type="file" accept="image/*" onChange={e=>setThumb(e.target.files?.[0]||null)}/></label></div>
   <label className="field"><span>Description</span><textarea rows="5" value={description} onChange={e=>setDescription(e.target.value)} placeholder="इस video में learner क्या सीखेगा?"></textarea></label>
   <button className="primary" disabled={loading}><Upload size={18}/>{loading?"Uploading...":"Publish Video"}</button>{msg&&<div className="notice"><CheckCircle2 size={18}/>{msg}</div>}
  </form></div></div>
}

function Watch({video,onBack}) {
 return <div className="watch-page"><button className="back-btn" onClick={onBack}><ArrowLeft size={18}/> Back to videos</button>
  <div className="watch-grid"><div><div className="player">{video.video_url?<video src={video.video_url} controls poster={video.image}/>:<div className="player-placeholder"><Play size={56}/></div>}</div><h1 className="watch-title">{video.title}</h1><div className="watch-by"><div className="creator-avatar big">{(video.creator||"T")[0]}</div><div><b>{video.creator}</b><p>{video.city} · {video.field}</p></div><button className="secondary subscribe">Follow Teacher</button></div><div className="description"><h3>About this lesson</h3><p>{video.description || "Practical learning video on Verojgar.com."}</p></div></div>
  <aside className="watch-side"><h3>Learn by field</h3>{fields.slice(1,7).map(f=><button key={f} className="side-link"><BookOpen size={17}/>{f}<ChevronRight size={16}/></button>)}</aside></div>
 </div>
}

function LiveSection({onLogin}) {
 return <section className="live-section" id="live"><div className="section-heading row"><div><div className="eyebrow"><Radio size={15}/> LIVE LEARNING</div><h2>अपने शहर से live सीखें</h2><p>Teachers अपने शहर और skill के हिसाब से live sessions list कर सकते हैं।</p></div><button className="secondary" onClick={onLogin}>Become a Teacher</button></div>
 <div className="live-grid">{[
  ["Mobile Repairing","Shivpuri","आज · 8:00 PM","Amit Sharma"],
  ["Computer Basics","Bhopal","कल · 6:30 PM","Pooja Jain"],
  ["Tailoring","Gwalior","शनिवार · 5:00 PM","Sangeeta Patel"]
 ].map((x,i)=><div className="live-card" key={i}><div className="live-badge"><span/> LIVE</div><div className="live-icon"><Radio size={25}/></div><div><h3>{x[0]}</h3><p><MapPin size={13}/>{x[1]}</p><small><Clock3 size={13}/>{x[2]} · {x[3]}</small></div><button className="secondary small">Notify me</button></div>)}</div></section>
}

export default function App(){
 const [screen,setScreen]=useState("home"); const [search,setSearch]=useState(""); const [field,setField]=useState("All Fields"); const [city,setCity]=useState("All Cities"); const [videos,setVideos]=useState(demoVideos); const [user,setUser]=useState(null); const [selected,setSelected]=useState(null);
 useEffect(()=>{
   if(!supabaseConfigured)return;
   supabase.auth.getSession().then(({data})=>setUser(data.session?.user||null));
   const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>setUser(session?.user||null));
   return ()=>subscription.unsubscribe();
 },[]);
 useEffect(()=>{
   if(!supabaseConfigured)return;
   supabase.from("videos").select("*,profiles(name,city)").order("created_at",{ascending:false}).limit(60).then(({data})=>{
     if(data?.length)setVideos(data.map(v=>({...v,creator:v.profiles?.name||"Verojgar Teacher",views:v.views||0,image:v.thumbnail_url})));
   });
 },[]);
 const filtered=useMemo(()=>videos.filter(v=>{
   const q=search.toLowerCase();
   return (!q || `${v.title} ${v.creator} ${v.field} ${v.city}`.toLowerCase().includes(q))
     && (field==="All Fields"||v.field===field) && (city==="All Cities"||v.city===city);
 }),[videos,search,field,city]);
 async function logout(){ if(supabaseConfigured) await supabase.auth.signOut(); setUser(null); setScreen("home");}
 const goUpload=()=>setScreen("upload");
 return <div className="app">
   <Header onLogin={()=>setScreen("login")} onUpload={goUpload} onHome={()=>setScreen("home")} user={user} onLogout={logout} search={search} setSearch={setSearch}/>
   {screen==="login"&&<Login onBack={()=>setScreen("home")} onSuccess={()=>setScreen("home")}/>}
   {screen==="upload"&&<UploadPanel user={user} onBack={()=>setScreen("home")} onUploaded={v=>{setVideos([v,...videos]);setScreen("home")}}/>}
   {screen==="watch"&&selected&&<Watch video={selected} onBack={()=>setScreen("home")}/>}
   {screen==="home"&&<>
    <main>
     <Hero onExplore={()=>document.getElementById("library")?.scrollIntoView({behavior:"smooth"})} onCreate={goUpload}/>
     <div className="container" id="library"><div className="section-heading"><div className="eyebrow"><BookOpen size={15}/> SKILL LIBRARY</div><h2>आज क्या सीखना है?</h2><p>Skill, teacher और city के आधार पर practical videos खोजें।</p></div>
     <FilterBar field={field} setField={setField} city={city} setCity={setCity}/>
     {filtered.length?<VideoGrid videos={filtered} onOpen={v=>{setSelected(v);setScreen("watch")}} user={user} onDelete={async (v)=>{if(!window.confirm("क्या आप यह वीडियो डिलीट करना चाहते हैं?"))return;const {error}=await supabase.from("videos").delete().eq("id",v.id).eq("creator_id",user.id);if(error){alert("वीडियो डिलीट नहीं हुआ: "+error.message);return;}setVideos(prev=>prev.filter(item=>item.id!==v.id));alert("वीडियो डिलीट हो गया");}}/>:<div className="empty"><Search size={35}/><h3>कोई video नहीं मिला</h3><p>दूसरी skill या city चुनकर देखें।</p></div>}
     </div>
     <LiveSection onLogin={()=>setScreen("login")}/>
     <section className="creator-banner"><div><div className="eyebrow"><Sparkles size={15}/> FOR CREATORS</div><h2>आपको कोई skill आती है?</h2><p>अपना channel बनाइए और अपने शहर के लोगों को सिखाइए।</p></div><button className="primary" onClick={goUpload}><Plus size={18}/> Start Teaching</button></section>
    </main>
    <footer><div><button className="brand footer-brand" onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}><span className="brand-mark">V</span><span>Verojgar<span className="dot">.com</span></span></button><p>हर हुनर को पहचान, हर व्यक्ति को अवसर.</p></div><div className="footer-links"><a href="#library">Learn</a><a href="#live">Live</a><a href="#">About</a><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Community Guidelines</a></div><small>© 2026 Verojgar.com</small></footer>
   </>}
 </div>
}
