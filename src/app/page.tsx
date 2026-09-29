import Link from "next/link";
export const dynamic = 'force-dynamic';
const API = "https://bungko.id/api-berita.php?limit=50";

async function getData(){
  try{
    const r = await fetch(API,{cache:"no-store"});
    const d = await r.json();
    return Array.isArray(d)?d:[];
  }catch{ return [] }
}

function imgUrl(g:string){
  if(!g) return "https://picsum.photos/seed/bungko/800/450";
  if(g.startsWith("http")) return g;
  return `https://bungko.id/${g.replace(/^\/+/,"")}`;
}

export default async function Home(){
  const all = await getData();
  if(all.length===0) return <div className="p-10 text-center">Loading...</div>;
  const heroMain = all[0];
  const heroSide = all.slice(1,3);
  const populer = all.slice(0,5);
  const terbaru = all.slice(0,6);
  const ekonomi = all.filter((x:any)=> (x.kategori_nama||"").toLowerCase().includes("ekonomi") || (x.kategori_slug||"").includes("ekonomi")).slice(0,4);
  const gaming = all.filter((x:any)=> (x.kategori_nama||"").toLowerCase().includes("gaming")).slice(0,4);
  const gridEkonomi = ekonomi.length? ekonomi : all.slice(3,7);
  const gridGaming = gaming.length? gaming : all.slice(7,11);

  return(
    <main className="min-h-screen bg-white text-[#0b1220] overflow-x-hidden" style={{fontFamily:"'Inter',system-ui,sans-serif"}}>
      <style>{`
       .bn-container{max-width:1280px;margin:0 auto;padding-left:clamp(14px,2vw,20px);padding-right:clamp(14px,2vw,20px);width:100%}
       .bn-hero{position:relative;border-radius:clamp(14px,2vw,26px);overflow:hidden;background:#0b1220;margin:clamp(12px,1.5vw,16px) 0 clamp(18px,2vw,22px);box-shadow:0 14px 24px -6px rgba(15,23,42,.08)}
       .bn-hero-main{position:relative;overflow:hidden;isolation:isolate;min-height:clamp(320px,50vw,520px)}
       .bn-hero-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform 12s cubic-bezier(.22,1,.36,1)}
       .bn-hero-main:hover.bn-hero-img{transform:scale(1.06)}
       .bn-hero-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,18,32,0) 0%,rgba(11,18,32,0) 40%,rgba(11,18,32,.55) 72%,rgba(11,18,32,.96) 100%);z-index:1}
       .bn-hero-content{position:absolute;bottom:0;left:0;right:0;z-index:2;padding:clamp(18px,3vw,36px) clamp(14px,2.5vw,28px)}
       .bn-live{display:inline-flex;align-items:center;gap:6px;background:#dc2626;color:#fff;font-size:10px;font-weight:800;padding:4px 10px;border-radius:999px;text-transform:uppercase;letter-spacing:.05em}
       .bn-live.dot{width:6px;height:6px;background:#fff;border-radius:999px;animation:bnPulse 1.2s infinite}
        @keyframes bnPulse{0%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(1.2)}100%{opacity:1;transform:scale(1)}}
       .bn-ticker{white-space:nowrap;animation:bnMarquee 40s linear infinite}
        @keyframes bnMarquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @media(max-width:900px){.bn-hero-grid{grid-template-columns:1fr!important}.bn-side-grid{grid-template-columns:1fr 1fr!important}}
        @media(max-width:640px){.bn-side-grid{grid-template-columns:1fr!important}.bn-main-layout{grid-template-columns:1fr!important}}
      `}</style>

      {/* HEADER PERSIS header_1.php */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-[#e5e9f0]">
        <div className="bg-[#0b1220] text-white text-"><div className="bn-container h- flex items-center justify-between gap-3 overflow-hidden"><div className="flex items-center gap-2 shrink-0"><span className="bn-live"><span className="dot"></span> LIVE</span><span className="hidden md:inline opacity-70">{new Date().toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</span></div><div className="flex-1 overflow-hidden"><div className="bn-ticker flex gap-8">{[...populer,...populer].map((p:any,i:number)=>(<span key={i} className="opacity-80">• {p.judul}</span>))}</div></div></div></div>
        <div className="bn-container h- md:h- flex items-center justify-between gap-4">
          <Link href="/" className="font-black text- tracking-tight">BUNGKO<span className="text-red-600">.ID</span></Link>
          <nav className="hidden lg:flex items-center gap-1">{["Berita","Ekonomi","Gaming","Teknologi","Nasional","Daerah"].map(k=>(<Link key={k} href={`/kategori/${k.toLowerCase()}`} className="px-3 py-2 rounded-full text- font-semibold hover:bg-[#f1f5f9]">{k}</Link>))}</nav>
          <div className="flex items-center gap-2"><Link href="/" className="hidden md:inline-flex bg-black text-white text- font-bold px-4 py-2 rounded-full">Beranda</Link></div>
        </div>
      </header>

      <div className="bn-container">
        {/* HERO CLASSIC */}
        <section className="bn-hero">
          <div className="bn-hero-grid grid" style={{gridTemplateColumns:"1.65fr.9fr"}}>
            <article className="bn-hero-main">
              <img src={imgUrl(heroMain.gambar)} alt="" className="bn-hero-img" />
              <div className="bn-hero-overlay"></div>
              <div className="bn-hero-content">
                <div className="flex items-center gap-2 mb-3"><span className="bn-live"><span className="dot"></span> Headline</span><span className="bg-white/20 backdrop-blur text-white text- px-2 py-1 rounded-full">{heroMain.kategori_nama||"Berita"}</span></div>
                <Link href={`/berita/${heroMain.slug||heroMain.id}`}><h1 className="text-white text- md:text- font-black leading-[1.15] line-clamp-3">{heroMain.judul}</h1></Link>
                <p className="hidden md:block text-white/80 text- mt-2 line-clamp-2 max-w-">{String(heroMain.isi||"").replace(/<[^>]*>/g,"").slice(0,160)}...</p>
                <div className="flex items-center gap-3 text-white/70 text- mt-3"><span>Redaksi</span><span>•</span><span>{heroMain.tanggal||"1 jam lalu"}</span></div>
              </div>
            </article>
            <div className="bn-side-grid grid grid-rows-2">
              {heroSide.map((s:any)=>(
                <article key={s.id} className="relative overflow-hidden min-h- md:min-h-0 isolate">
                  <img src={imgUrl(s.gambar)} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="bn-hero-overlay" style={{background:"linear-gradient(180deg,rgba(0,0,0,.05) 0%,rgba(0,0,0,.85) 100%)"}}></div>
                  <div className="absolute bottom-0 left-0 right-0 z-[2] p-4">
                    <div className="text-[#60a5fa] text- font-bold uppercase mb-1">{s.kategori_nama}</div>
                    <Link href={`/berita/${s.slug||s.id}`}><h3 className="text-white text- font-bold leading-[1.3] line-clamp-2">{s.judul}</h3></Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* MAIN + SIDEBAR */}
        <div className="bn-main-layout grid" style={{gridTemplateColumns:"1.9fr.9fr",gap:"clamp(16px,2vw,24px)"}}>
          <div className="min-w-0">
            {/* Kategori Ekonomi */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4"><h2 className="font-black text- flex items-center gap-2"><span className="w-1 h-5 bg-[#1d4ed8] rounded-full"></span>Ekonomi</h2><Link href="/kategori/ekonomi" className="text- font-bold text-[#1d4ed8]">Lihat Semua ?</Link></div>
              <div className="grid md:grid-cols-[1.3fr_1fr] gap-4">
                {gridEkonomi[0] && <Link href={`/berita/${gridEkonomi[0].slug||gridEkonomi[0].id}`} className="group"><div className="rounded- overflow-hidden bg-[#f1f5f9] aspect-video"><img src={imgUrl(gridEkonomi[0].gambar)} className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500" alt=""/></div><h3 className="font-bold text- leading-[1.3] mt-3 line-clamp-2 group-hover:text-[#1d4ed8]">{gridEkonomi[0].judul}</h3><p className="text- text-[#64748b] mt-1 line-clamp-2">{String(gridEkonomi[0].isi||"").replace(/<[^>]*>/g,"").slice(0,100)}...</p></Link>}
                <div className="space-y-3">{gridEkonomi.slice(1,4).map((b:any)=>(<Link key={b.id} href={`/berita/${b.slug||b.id}`} className="flex gap-3 group"><div className="w- h- rounded- overflow-hidden bg-[#f1f5f9] shrink-0"><img src={imgUrl(b.gambar)} className="w-full h-full object-cover" alt=""/></div><div className="min-w-0"><h4 className="font-bold text- leading-[1.35] line-clamp-2 group-hover:text-[#1d4ed8]">{b.judul}</h4><p className="text- text-[#94a3b8] mt-1">{b.tanggal||""}</p></div></Link>))}</div>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center justify-between mb-4"><h2 className="font-black text- flex items-center gap-2"><span className="w-1 h-5 bg-[#1d4ed8] rounded-full"></span>Gaming</h2><Link href="/kategori/gaming" className="text- font-bold text-[#1d4ed8]">Lihat Semua ?</Link></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{gridGaming.slice(0,4).map((b:any)=>(<Link key={b.id} href={`/berita/${b.slug||b.id}`} className="group"><div className="rounded- overflow-hidden bg-[#f1f5f9] aspect-[4/3]"><img src={imgUrl(b.gambar)} className="w-full h-full object-cover group-hover:scale-[1.03] transition" alt=""/></div><h4 className="font-bold text- leading-[1.3] mt-2 line-clamp-2">{b.judul}</h4></Link>))}</div>
            </section>
          </div>

          {/* SIDEBAR PERSIS sidebar.php */}
          <aside className="space-y-6">
            <div className="bg-white border border-[#e5e9f0] rounded- p-4"><h3 className="font-black text- mb-3">?? Terpopuler</h3>{populer.map((p:any,i:number)=>(<Link key={p.id} href={`/berita/${p.slug||p.id}`} className="flex gap-3 py-2.5 border-b last:border-0 border-[#f1f5f9] group"><span className="font-black text- text-[#e5e9f0] group-hover:text-[#1d4ed8]">0{i+1}</span><div className="min-w-0"><h4 className="font-bold text- leading-[1.3] line-clamp-2 group-hover:text-[#1d4ed8]">{p.judul}</h4><p className="text- text-[#94a3b8] mt-1">{p.view_count?`${p.view_count} views`:""}</p></div></Link>))}</div>
            <div className="bg-white border border-[#e5e9f0] rounded- p-4"><h3 className="font-black text- mb-3">Berita Terbaru</h3>{terbaru.map((t:any)=>(<Link key={t.id} href={`/berita/${t.slug||t.id}`} className="flex gap-3 py-2 group"><div className="w- h- rounded- overflow-hidden bg-[#f1f5f9] shrink-0"><img src={imgUrl(t.gambar)} className="w-full h-full object-cover" alt=""/></div><h4 className="font-semibold text- leading-[1.35] line-clamp-2">{t.judul}</h4></Link>))}</div>
            <div className="bg-[#0a0f1a] text-white rounded- p-5"><h3 className="font-bold text-">?? Newsletter</h3><p className="text- text-[#94a3b8] mt-1">Dapatkan update terbaru langsung ke email</p><div className="mt-3 flex gap-2"><input placeholder="Email kamu" className="flex-1 bg-white/10 border border-white/20 rounded-full px-3 py-2 text- outline-none"/><button className="bg-white text-black font-bold text- px-4 py-2 rounded-full">Join</button></div></div>
          </aside>
        </div>
      </div>

      {/* FOOTER PERSIS footer_1.php */}
      <footer className="mt-12 bg-[#0a0f1a] text-[#94a3b8] relative"><div className="h- w-full" style={{background:"linear-gradient(90deg,#3b82f6,#8b5cf6,#ec4899,#3b82f6)",backgroundSize:"200% 100%"}}></div><div className="bn-container py-10 grid md:grid-cols-[1.2fr_1fr_1fr] gap-8"><div><div className="font-black text-white text-">BUNGKO<span className="text-[#3b82f6]">.ID</span></div><p className="text- mt-3 leading-[1.6]">Portal berita terkini dan terpercaya di Indonesia. Update 24 jam.</p></div><div><h4 className="text-white font-bold text- uppercase tracking-wide mb-3">Kategori</h4><div className="grid grid-cols-2 gap-2 text-">{["Berita","Ekonomi","Gaming","Teknologi","Nasional","Daerah","Olahraga","Entertainment"].map(k=>(<Link key={k} href={`/kategori/${k.toLowerCase()}`} className="hover:text-white">{k}</Link>))}</div></div><div><h4 className="text-white font-bold text- uppercase tracking-wide mb-3">Perusahaan</h4><div className="space-y-2 text-"><Link href="/tentang/" className="block hover:text-white">Tentang Kami</Link><Link href="/kontak/" className="block hover:text-white">Kontak</Link><Link href="/kebijakan/" className="block hover:text-white">Kebijakan Privasi</Link></div></div></div><div className="bn-container border-t border-white/10 py-4 flex flex-col md:flex-row justify-between items-center gap-2 text-"><p>© {new Date().getFullYear()} Bungko News. Hak Cipta Dilindungi.</p><button onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full">? Kembali ke Atas</button></div></footer>
    </main>
  )
}
