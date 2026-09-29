import Link from "next/link";
export const dynamic = 'force-dynamic';
const API = "https://bungko.id/api-berita.php?limit=24";

function imgUrl(g: string){
  if(!g) return "https://picsum.photos/seed/bungko/600/400";
  const s = String(g);
  if(s.startsWith("http")) return s;
  return "https://bungko.id/" + s.replace(/^\/+/, "");
}

async function getData(){
  try{
    const r = await fetch(API, {cache:"no-store"});
    const j = await r.json();
    return Array.isArray(j) ? j : [];
  }catch{ return []; }
}

export default async function Home(){
  const all: any[] = await getData();
  if(all.length === 0){
    return <div className="p-10 text-center">Loading Bungko.id...</div>
  }
  const main = all[0];
  const side = all.slice(1,3);
  const list = all.slice(3,15);

  return(
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="bg-black text-white text-xs"><div className="max-w- mx-auto px-4 h-8 flex items-center">LIVE - Bungko.id Portal Berita</div></div>
      <header className="border-b sticky top-0 bg-white z-50"><div className="max-w- mx-auto px-4 h-14 flex items-center justify-between"><div className="font-black text-xl">BUNGKO<span className="text-red-600">.ID</span></div><div className="text-xs bg-black text-white px-3 py-1 rounded-full">NEXT</div></div></header>
      <div className="max-w- mx-auto px-4 mt-4">
        <div className="rounded-2xl overflow-hidden bg-zinc-900 grid md:grid-cols-[1.6fr_0.9fr] min-h-">
          <Link href={/berita/ + (main.slug || main.id)} className="relative block min-h-">
            <img src={imgUrl(main.gambar)} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
            <div className="absolute bottom-0 p-6"><h1 className="text-white text-2xl md:text-3xl font-black leading-tight">{main.judul}</h1><p className="text-white/70 text-xs mt-2">{main.kategori_nama || "Berita"} - {main.tanggal || ""}</p></div>
          </Link>
          <div className="grid grid-rows-2">
            {side.map((s:any)=><Link key={s.id} href={/berita/ + (s.slug||s.id)} className="relative block min-h-"><img src={imgUrl(s.gambar)} alt="" className="absolute inset-0 w-full h-full object-cover" /><div className="absolute inset-0 bg-black/40"></div><div className="absolute bottom-0 p-4 text-white text-sm font-bold">{s.judul}</div></Link>)}
          </div>
        </div>
        <div className="mt-6 grid md:grid-cols-3 gap-3">
          {list.map((b:any)=><Link key={b.id} href={/berita/ + (b.slug||b.id)} className="border rounded-xl p-3 flex gap-3"><div className="w-20 h-14 bg-zinc-100 rounded-lg overflow-hidden shrink-0"><img src={imgUrl(b.gambar)} className="w-full h-full object-cover" alt=""/></div><div className="text- font-bold line-clamp-2 leading-tight">{b.judul}</div></Link>)}
        </div>
      </div>
      <footer className="mt-10 bg-zinc-900 text-zinc-400 text-xs py-6"><div className="max-w- mx-auto px-4">© 2026 Bungko.id</div></footer>
    </main>
  )
}