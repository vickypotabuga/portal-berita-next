import Link from "next/link";
export const dynamic = 'force-dynamic';
const API = "https://bungko.id/api-berita.php?limit=30";
async function getBerita(){ try{ const r=await fetch(API,{cache:"no-store"}); const d=await r.json(); return Array.isArray(d)?d:[] }catch{ return [] } }
export default async function Home(){
  const berita=await getBerita();
  return(
    <main className="min-h-screen bg-[#f8f8f8] md:bg-white">
      <header className="bg-white border-b sticky top-0 z-50"><div className="max-w- mx-auto px-4 h- flex items-center justify-between"><Link href="/" className="font-black text-">BUNGKO<span className="text-red-600">.ID</span></Link><span className="text- bg-zinc-900 text-white px-2 py-1 rounded">NEXT</span></div></header>
      <div className="max-w- mx-auto bg-white md:mt-6 md:rounded-2xl md:border md:border-zinc-100">
        {berita.map((b:any)=>{
          const imgRaw=b.gambar||""; const img=imgRaw.startsWith("http")?imgRaw:`https://bungko.id/${String(imgRaw).replace(/^\/+/,"")}`; const excerpt=String(b.isi||"").replace(/<[^>]*>/g,"").slice(0,120);
          return(
            <article key={b.id} className="flex gap-3 p-4 border-b border-zinc-100 last:border-0">
              <Link href={`/berita/${b.slug||b.id}`} className="shrink-0 w- h- md:w- md:h- rounded-xl overflow-hidden bg-zinc-100"><img src={img} alt="" className="w-full h-full object-cover"/></Link>
              <div className="min-w-0 flex-1"><div className="text- font-bold text-red-600 uppercase tracking-wide">{b.kategori_nama||"Berita"}</div><Link href={`/berita/${b.slug||b.id}`}><h2 className="text- md:text- font-bold leading-[1.35] line-clamp-2 mt-0.5 hover:text-red-600">{b.judul}</h2></Link><p className="hidden md:block text- text-zinc-500 mt-1 line-clamp-2">{excerpt}...</p><p className="text- text-zinc-400 mt-1">Redaksi • {b.tanggal||""}</p></div>
            </article>
          )
        })}
      </div>
    </main>
  )
}
