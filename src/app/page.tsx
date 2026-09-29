import Link from "next/link";
export const dynamic = 'force-dynamic';
const API = "https://bungko.id/api-berita.php?limit=40";
function imgUrl(g:string){ if(!g) return "https://picsum.photos/seed/bungko/600/400"; return g.startsWith("http")?g:`https://bungko.id/${String(g).replace(/^\/+/,"")}`; }
async function getData(){ try{ const r=await fetch(API,{cache:"no-store"}); const j=await r.json(); return Array.isArray(j)?j:[] }catch{ return [] } }

export default async function Home(){
  const all = await getData();
  const main = all[0] || {judul:"Bungko News", gambar:"", kategori_nama:"Berita", tanggal:"", isi:""};
  const side = all.slice(1,3);
  const populer = all.slice(0,5);
  const terbaru = all.slice(0,6);
  const list = all.slice(3,12);

  return(
    <main className="min-h-screen bg-white text-[#0b1220]" style={{fontFamily:"Inter,system-ui,sans-serif"}}>
      {/* HEADER */}
      <div className="bg-[#0a0f1a] text-white text-"><div className="max-w- mx-auto px-4 h-8 flex items-center gap-2"><span className="bg-red-600 px-2 py-0.5 rounded-full font-bold text-">LIVE</span><span className="truncate opacity-80">{populer.map((p:any)=>p.judul).join(" • ")}</span></div></div>
      <header className="sticky top-0 z-50 bg-white border-b"><div className="max-w- mx-auto px-4 h- flex items-center justify-between"><Link href="/" className="font-black text-">BUNGKO<span className="text-red-600">.ID</span></Link><nav className="hidden md:flex gap-4 text- font-semibold">{["Berita","Ekonomi","Gaming","Teknologi"].map(k=><Link key={k} href={`/kategori/${k.toLowerCase()}`} className="hover:text-blue-600">{k}</Link>)}</nav></div></header>

      <div className="max-w- mx-auto px-4">
        {/* HERO CLASSIC */}
        <section className="mt-4 rounded- overflow-hidden bg-[#0b1220] grid md:grid-cols-[1.6fr_.9fr] min-h- md:min-h-">
          <Link href={`/berita/${main.slug||main.id}`} className="relative block overflow-hidden group min-h-">
            <img src={imgUrl(main.gambar)} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition duration-700"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8"><span className="bg-red-600 text-white text- font-bold px-2 py-1 rounded-full uppercase">{main.kategori_nama||"Headline"}</span><h1 className="text-white text- md:text- font-black leading-[1.15] mt-3 line-clamp-3">{main.judul}</h1><p className="text-white/70 text- mt-2">{main.tanggal||""}</p></div>
          </Link>
          <div className="grid grid-rows-2">
            {side.map((s:any)=><Link key={s.id} href={`/berita/${s.slug||s.id}`} className="relative block overflow-hidden min-h- group"><img src={imgUrl(s.gambar)} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition"/><div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10"></div><div className="absolute bottom-0 p-4"><p className="text-blue-300 text- font-bold uppercase">{s.kategori_nama}</p><h3 className="text-white text- font-bold leading-[1.3] line-clamp-2">{s.judul}</h3></div></Link>)}
          </div>
        </section>

        {/* MAIN + SIDEBAR */}
        <div className="grid lg:grid-cols-[1.9fr_.8fr] gap-6 mt-6">
          <div>
            <div className="flex items-center gap-2 mb-4"><div className="w-1 h-5 bg-blue-600 rounded-full"></div><h2 className="font-black text-">Berita Terbaru</h2></div>
            <div className="grid md:grid-cols-2 gap-4">
              {list.map((b:any)=><Link key={b.id} href={`/berita/${b.slug||b.id}`} className="flex gap-3 p-3 border border-zinc-100 rounded-xl hover:border-zinc-200 group"><div className="w- h- rounded-lg overflow-hidden bg-zinc-100 shrink-0"><img src={imgUrl(b.gambar)} className="w-full h-full object-cover" alt=""/></div><div className="min-w-0"><h3 className="font-bold text- leading-[1.35] line-clamp-2 group-hover:text-blue-600">{b.judul}</h3><p className="text- text-zinc-400 mt-1">{b.kategori_nama} • {b.tanggal||""}</p></div></Link>)}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="border rounded-xl p-4"><h3 className="font-black text- mb-3">?? Terpopuler</h3>{populer.map((p:any,i:number)=><Link key={p.id} href={`/berita/${p.slug||p.id}`} className="flex gap-2 py-2 border-b last:border-0"><span className="font-black text-zinc-200">0{i+1}</span><span className="font-semibold text- leading-[1.3] line-clamp-2">{p.judul}</span></Link>)}</div>
            <div className="border rounded-xl p-4"><h3 className="font-black text- mb-3">Berita Terbaru</h3>{terbaru.map((t:any)=><Link key={t.id} href={`/berita/${t.slug||t.id}`} className="flex gap-2 py-2"><div className="w-16 h-12 rounded bg-zinc-100 overflow-hidden shrink-0"><img src={imgUrl(t.gambar)} className="w-full h-full object-cover" alt=""/></div><span className="text- font-medium line-clamp-2">{t.judul}</span></Link>)}</div>
          </aside>
        </div>
      </div>

      <footer className="mt-10 bg-[#0a0f1a] text-zinc-400"><div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div><div className="max-w- mx-auto px-4 py-8 text- flex justify-between"><span>© {new Date().getFullYear()} Bungko.id</span><Link href="/" className="text-white">Kembali ke atas ?</Link></div></footer>
    </main>
  )
}
