import Link from "next/link";
export const dynamic = 'force-dynamic';
const API = "https://bungko.id/api-berita.php?limit=50";

function imgUrl(g:string){
  if(!g) return "https://picsum.photos/seed/bungko/800/450";
  if(g.startsWith("http")) return g;
  return `https://bungko.id/${String(g).replace(/^\/+/,"")}`;
}
async function getData(){
  try{
    const r = await fetch(API,{cache:"no-store"});
    const j = await r.json();
    return Array.isArray(j)?j:[];
  }catch{ return [] }
}

export default async function Home(){
  const all = await getData();
  if(all.length===0) return <div className="p-10 text-center">Loading bungko.id...</div>;
  const main = all[0];
  const side = all.slice(1,3);
  const populer = all.slice(0,5);
  const terbaru = all.slice(0,6);
  const list = all.slice(3,13);

  return(
    <main className="min-h-screen bg-white text-[#0b1220]">
      <div className="bg-[#0a0f1a] text-white text-">
        <div className="max-w- mx-auto px-4 h-8 flex items-center gap-2 overflow-hidden">
          <span className="bg-red-600 px-2 py-0.5 rounded-full font-bold text- shrink-0">LIVE</span>
          <span className="truncate opacity-80">{populer.map((p:any)=>p.judul).join(" • ")}</span>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="max-w- mx-auto px-4 h- flex items-center justify-between">
          <Link href="/" className="font-black text- tracking-tight">BUNGKO<span className="text-red-600">.ID</span></Link>
          <nav className="hidden lg:flex gap-5 text- font-semibold">
            {["Berita","Ekonomi","Gaming","Teknologi","Nasional"].map(k=><Link key={k} href={`/kategori/${k.toLowerCase()}`} className="hover:text-blue-600" prefetch={false}>{k}</Link>)}
          </nav>
        </div>
      </header>

      <div className="max-w- mx-auto px-4">
        {/* HERO CLASSIC - persis index_3.php classic */}
        <section className="mt-4 rounded- overflow-hidden bg-[#0b1220] grid md:grid-cols-[1.6fr_0.9fr] min-h-">
          <Link href={`/berita/${main.slug||main.id}`} className="relative block min-h- md:min-h- group overflow-hidden">
            <img src={imgUrl(main.gambar)} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
              <div className="flex gap-2 mb-3"><span className="bg-red-600 text-white text- font-bold px-2 py-1 rounded-full">HEADLINE</span><span className="bg-white/20 text-white text- px-2 py-1 rounded-full backdrop-blur">{main.kategori_nama||"Berita"}</span></div>
              <h1 className="text-white text- md:text- font-black leading-[1.15] line-clamp-3">{main.judul}</h1>
              <p className="text-white/60 text- mt-2">Redaksi • {main.tanggal||"Baru saja"}</p>
            </div>
          </Link>
          <div className="grid grid-rows-2">
            {side.map((s:any)=>(
              <Link key={s.id} href={`/berita/${s.slug||s.id}`} className="relative block min-h- group overflow-hidden">
                <img src={imgUrl(s.gambar)} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10"></div>
                <div className="absolute bottom-0 p-4"><p className="text-blue-300 text- font-bold uppercase mb-1">{s.kategori_nama}</p><h3 className="text-white text- font-bold leading-[1.3] line-clamp-2">{s.judul}</h3></div>
              </Link>
            ))}
          </div>
        </section>

        {/* MAIN + SIDEBAR */}
        <div className="grid lg:grid-cols-[1.9fr_0.8fr] gap-6 mt-6">
          <div>
            <div className="flex items-center gap-2 mb-4"><div className="w-1 h-5 bg-blue-600 rounded-full"></div><h2 className="font-black text-">Berita Terbaru</h2></div>
            <div className="grid sm:grid-cols-2 gap-3">
              {list.map((b:any)=>(
                <Link key={b.id} href={`/berita/${b.slug||b.id}`} className="flex gap-3 p-3 border border-zinc-100 rounded-xl hover:border-zinc-200 hover:bg-zinc-50/50 group">
                  <div className="w- h- rounded-lg overflow-hidden bg-zinc-100 shrink-0"><img src={imgUrl(b.gambar)} alt="" className="w-full h-full object-cover" /></div>
                  <div className="min-w-0"><h3 className="font-bold text- leading-[1.35] line-clamp-2 group-hover:text-blue-600">{b.judul}</h3><p className="text- text-zinc-400 mt-1">{b.kategori_nama||"Berita"} • {b.tanggal||""}</p></div>
                </Link>
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="border border-zinc-200 rounded-xl p-4"><h3 className="font-black text- mb-3">?? Terpopuler</h3>{populer.map((p:any,i:number)=><Link key={p.id} href={`/berita/${p.slug||p.id}`} className="flex gap-2 py-2.5 border-b last:border-0 border-zinc-100 group"><span className="font-black text- text-zinc-200 group-hover:text-blue-600">0{i+1}</span><span className="font-semibold text- leading-[1.3] line-clamp-2 group-hover:text-blue-600">{p.judul}</span></Link>)}</div>
            <div className="border border-zinc-200 rounded-xl p-4"><h3 className="font-black text- mb-3">Berita Terbaru</h3>{terbaru.map((t:any)=><Link key={t.id} href={`/berita/${t.slug||t.id}`} className="flex gap-2 py-2 group"><div className="w- h- rounded-lg overflow-hidden bg-zinc-100 shrink-0"><img src={imgUrl(t.gambar)} alt="" className="w-full h-full object-cover" /></div><span className="text- font-medium line-clamp-2 leading-[1.3]">{t.judul}</span></Link>)}</div>
            <div className="bg-[#0a0f1a] text-white rounded-xl p-5"><h3 className="font-bold text-">?? Newsletter</h3><p className="text- text-zinc-400 mt-1">Update terbaru ke email kamu</p><div className="mt-3 flex gap-2"><input placeholder="Email kamu" className="flex-1 bg-white/10 border border-white/20 rounded-full px-3 py-2 text- outline-none" /><button className="bg-white text-black font-bold text- px-4 py-2 rounded-full">Join</button></div></div>
          </aside>
        </div>
      </div>

      <footer className="mt-12 bg-[#0a0f1a] text-zinc-400"><div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div><div className="max-w- mx-auto px-4 py-8 grid md:grid-cols-3 gap-6 text-"><div><div className="font-black text-white text-">BUNGKO<span className="text-blue-500">.ID</span></div><p className="mt-2 leading-[1.6]">Portal berita terkini dan terpercaya di Indonesia. Update 24 jam.</p></div><div><h4 className="text-white font-bold uppercase text- mb-3">Kategori</h4><div className="grid grid-cols-2 gap-2">{["Berita","Ekonomi","Gaming","Teknologi","Nasional","Daerah"].map(k=><Link key={k} href={`/kategori/${k.toLowerCase()}`} className="hover:text-white">{k}</Link>)}</div></div><div><h4 className="text-white font-bold uppercase text- mb-3">Perusahaan</h4><div className="space-y-1"><Link href="/tentang/" className="block hover:text-white">Tentang Kami</Link><Link href="/kontak/" className="block hover:text-white">Kontak</Link></div></div></div><div className="border-t border-white/10 max-w- mx-auto px-4 py-4 flex justify-between text-"><span>© 2026 Bungko News</span><Link href="/" className="text-white">? Atas</Link></div></footer>
    </main>
  )
}
