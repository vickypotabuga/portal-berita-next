import Link from "next/link";
export const dynamic = 'force-dynamic';
const API="https://bungko.id/api-berita.php?limit=20";
async function getData(){try{const r=await fetch(API,{cache:"no-store"});return await r.json()}catch{return[]}}
function img(g:string){if(!g) return "https://picsum.photos/seed/1/400/300";return g.startsWith("http")?g:`https://bungko.id/${g.replace(/^\/+/,"")}`}
export default async function Home(){
  const all:any[]=await getData();
  const main=all[0]||{judul:"Bungko News",gambar:"",slug:""};
  const side=all.slice(1,3);
  return(
    <main className="min-h-screen bg-white">
      <div className="bg-black text-white text- py-1"><div className="max-w- mx-auto px-4">LIVE • Bungko.id - Portal Berita Terpercaya</div></div>
      <header className="border-b sticky top-0 bg-white z-50"><div className="max-w- mx-auto px-4 h-14 flex items-center justify-between"><div className="font-black text-xl">BUNGKO<span className="text-red-600">.ID</span></div><div className="text-xs bg-black text-white px-3 py-1 rounded-full">NEXT</div></div></header>
      <div className="max-w- mx-auto px-4 mt-4">
        <div className="rounded-2xl overflow-hidden bg-zinc-900 grid md:grid-cols-[1.6fr_0.9fr]">
          <Link href={`/berita/${main.slug||main.id||""}`} className="relative min-h- block">
            <img src={img(main.gambar)} alt="" className="absolute inset-0 w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-0 p-6"><h1 className="text-white text-2xl md:text-3xl font-black">{main.judul}</h1></div>
          </Link>
          <div className="grid grid-rows-2">{side.map((s:any)=><div key={s.id} className="relative min-h-"><img src={img(s.gambar)} alt="" className="absolute inset-0 w-full h-full object-cover"/><div className="absolute inset-0 bg-black/40"></div><div className="absolute bottom-0 p-4 text-white text-sm font-bold">{s.judul}</div></div>)}</div>
        </div>
        <div className="grid md:grid-cols-3 gap-3 mt-6">{all.slice(3,12).map((b:any)=><Link key={b.id} href={`/berita/${b.slug||b.id}`} className="border rounded-xl p-3 flex gap-3"><div className="w-20 h-14 bg-zinc-100 rounded-lg overflow-hidden shrink-0"><img src={img(b.gambar)} className="w-full h-full object-cover" alt=""/></div><div className="text- font-bold line-clamp-2">{b.judul}</div></Link>)}</div>
      </div>
      <footer className="mt-10 bg-zinc-900 text-zinc-400 text-xs py-6"><div className="max-w- mx-auto px-4">© 2026 Bungko.id</div></footer>
    </main>
  )
}
