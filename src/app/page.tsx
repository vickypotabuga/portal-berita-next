async function getBerita() {
  try {
    const res = await fetch('https://bungko.id/api-berita.php?limit=20', { cache: 'no-store' });
    return await res.json();
  } catch { return []; }
}
function getImg(b:any){
  const raw = b.gambar || b.foto || '';
  if(!raw) return `https://picsum.photos/seed/${b.id}/800/500`;
  if(raw.startsWith('http')) return raw;
  return `https://bungko.id/${raw.replace(/^\/+/, '')}`;
}
export default async function Home(){
  const berita = await getBerita();
  return (
    <main className="min-h-screen bg-[#fafafa] text-zinc-900">
      <header className="bg-white border-b sticky top-0 z-50"><div className="max-w-6xl mx-auto px-4 h-16 flex items-center font-black text-xl">BUNGKO<span className="text-red-600">.ID</span></div></header>
      <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-6">
        {berita.map((b:any)=>(
          <a key={b.id} href={`/berita/${b.slug || b.id}`} className="bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition">
            <img src={getImg(b)} className="w-full aspect-video object-cover bg-zinc-100" alt="" />
            <div className="p-4"><span className="bg-red-600 text-white text- font-bold px-2 py-1 rounded-full">{b.kategori_nama||'BERITA'}</span><h2 className="font-bold mt-2 leading-tight line-clamp-2">{b.judul}</h2><p className="text-xs text-zinc-500 mt-2">{b.tanggal||''}</p></div>
          </a>
        ))}
      </div>
    </main>
  )
}