import Link from "next/link";
export const dynamic = 'force-dynamic';
const API = "https://bungko.id/api-berita.php";
async function getDetail(slug:string){ try{ let r=await fetch(`${API}?slug=${encodeURIComponent(slug)}`,{cache:"no-store"}); let d=await r.json(); if(Array.isArray(d)&&d[0]?.judul) return d[0]; if(d?.judul) return d; r=await fetch(`${API}?id=${encodeURIComponent(slug)}`,{cache:"no-store"}); d=await r.json(); if(Array.isArray(d)&&d[0]) return d[0]; return d; }catch{ return null } }
async function getRelated(k:string,ex:string){ try{ const r=await fetch(`${API}?kategori=${encodeURIComponent(k)}&limit=6`,{cache:"no-store"}); const d=await r.json(); return Array.isArray(d)?d.filter((x:any)=>String(x.id)!==String(ex)).slice(0,4):[] }catch{ return [] } }
export default async function Page({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params; const b=await getDetail(slug);
  if(!b) return <div className="p-10 text-center"><Link href="/" className="font-bold text-red-600">? Kembali</Link></div>;
  const imgRaw=b.gambar||""; const img=imgRaw.startsWith("http")?imgRaw:`https://bungko.id/${String(imgRaw).replace(/^\/+/,"")}`; const related=await getRelated(b.kategori_nama||"Berita",b.id);
  return(
    <main className="min-h-screen bg-[#f8f8f8] md:bg-white">
      <header className="bg-white border-b sticky top-0 z-50"><div className="max-w- mx-auto px-4 h- flex items-center"><Link href="/" className="font-black text-">BUNGKO<span className="text-red-600">.ID</span></Link></div></header>
      <article className="max-w- mx-auto bg-white md:mt-6 md:rounded-2xl md:border md:border-zinc-100 overflow-hidden">
        <div className="p-4 md:p-6">
          <div className="inline-block bg-red-600 text-white text- font-bold px-2.5 py-1 rounded-full uppercase">{b.kategori_nama||"Berita"}</div>
          <h1 className="text- md:text- font-black leading-[1.25] mt-3">{b.judul}</h1>
          <div className="text- text-zinc-500 mt-3">Redaksi • {b.tanggal||""}</div>
        </div>
        <div className="w-full bg-zinc-100"><img src={img} alt="" className="w-full h-auto max-w-full object-contain md:object-cover" /></div>
        <div className="p-4 md:p-6 text- md:text- leading-[1.8] text-zinc-800 [&_p]:mb-4 [&_h2]:text- [&_h2]:font-bold [&_h2]:mt-6 [&_img]:w-full [&_img]:h-auto [&_img]:rounded-xl [&_img]:my-4" dangerouslySetInnerHTML={{__html:b.isi||""}} />
        {related.length>0&&<><hr className="mx-4 md:mx-6 border-zinc-100"/><div className="p-4 md:p-6"><h3 className="font-black text- mb-4">Berita Terkait</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{related.map((r:any)=>{ const ri=r.gambar||""; const rimg=ri.startsWith("http")?ri:`https://bungko.id/${String(ri).replace(/^\/+/,"")}`; return <Link key={r.id} href={`/berita/${r.slug||r.id}`} className="flex gap-3 group"><div className="w- h- rounded-lg overflow-hidden bg-zinc-100 shrink-0"><img src={rimg} alt="" className="w-full h-full object-cover"/></div><h4 className="text- font-bold leading-[1.4] line-clamp-2 group-hover:text-red-600">{r.judul}</h4></Link> })}</div></div></>}
      </article>
    </main>
  )
}
