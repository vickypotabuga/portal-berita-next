import Link from "next/link";
export const dynamic = 'force-dynamic';
const API = "https://bungko.id/api-berita.php?limit=50";
async function getBerita() {
  try {
    const res = await fetch(API, { cache: "no-store" });
    const data = await res.json();
    return Array.isArray(data)? data : [];
  } catch { return []; }
}
export default async function Home() {
  const berita = await getBerita();
  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <header className="border-b sticky top-0 bg-white/95 backdrop-blur z-50">
        <div className="max-w- mx-auto px-4 h- flex items-center justify-between">
          <Link href="/" className="font-black text- tracking-tight">BUNGKO<span className="text-red-600">.ID</span></Link>
          <div className="text- text-zinc-500 font-medium">Portal Berita Terpercaya</div>
        </div>
      </header>
      <div className="max-w- mx-auto px-4">
        {berita.map((b: any) => {
          const imgRaw = b.gambar || "";
          const img = imgRaw.startsWith("http")? imgRaw : `https://bungko.id/${String(imgRaw).replace(/^\/+/, "")}`;
          const excerpt = String(b.isi || "").replace(/<[^>]*>/g, "").slice(0, 160);
          return (
            <article key={b.id} className="flex gap-4 py-5 border-b border-zinc-100">
              <Link href={`/berita/${b.slug || b.id}`} className="shrink-0">
                <img src={img} alt="" className="w- h- md:w- md:h- object-cover rounded-xl bg-zinc-100" />
              </Link>
              <div className="min-w-0 flex-1">
                <div className="text- font-bold tracking-wide text-red-600 uppercase">{b.kategori_nama || 'Berita'}</div>
                <Link href={`/berita/${b.slug || b.id}`}>
                  <h2 className="text- md:text- font-bold leading-[1.3] mt-0.5 line-clamp-2 hover:text-red-600">{b.judul}</h2>
                </Link>
                <p className="hidden md:block text- text-zinc-600 leading-[1.5] mt-1.5 line-clamp-2">{excerpt}...</p>
                <p className="text- text-zinc-400 mt-2">Redaksi - {b.tanggal || '1 jam lalu'}</p>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
