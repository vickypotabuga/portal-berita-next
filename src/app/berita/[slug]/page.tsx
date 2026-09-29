import Link from "next/link";
export const dynamic = 'force-dynamic';
const API = "https://bungko.id/api-berita.php";

async function getDetail(slug: string) {
  try {
    // coba pakai slug
    let res = await fetch(`${API}?slug=${encodeURIComponent(slug)}`, { cache: "no-store" });
    let data = await res.json();
    if (Array.isArray(data) && data.length > 0) return data[0];
    if (data && data.judul) return data;
    // fallback pakai id
    res = await fetch(`${API}?id=${encodeURIComponent(slug)}`, { cache: "no-store" });
    data = await res.json();
    if (Array.isArray(data) && data.length > 0) return data[0];
    return data;
  } catch { return null; }
}

async function getRelated(kategori: string, excludeId: string) {
  try {
    const res = await fetch(`${API}?kategori=${encodeURIComponent(kategori)}&limit=6`, { cache: "no-store" });
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.filter((x: any) => String(x.id)!== String(excludeId)).slice(0, 4);
  } catch { return []; }
}

export default async function DetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const b = await getDetail(slug);

  if (!b) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-black">Berita tidak ditemukan</h1>
          <Link href="/" className="text-red-600 font-bold mt-4 inline-block">? Kembali ke Beranda</Link>
        </div>
      </main>
    );
  }

  const imgRaw = b.gambar || "";
  const img = imgRaw.startsWith("http")? imgRaw : `https://bungko.id/${String(imgRaw).replace(/^\/+/, "")}`;
  const related = await getRelated(b.kategori_nama || b.kategori || "berita", b.id);

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <header className="border-b sticky top-0 bg-white/95 backdrop-blur z-50">
        <div className="max-w- mx-auto px-4 h- flex items-center justify-between">
          <Link href="/" className="font-black text- tracking-tight">BUNGKO<span className="text-red-600">.ID</span></Link>
          <Link href="/" className="text- bg-black text-white px-4 py-2 rounded-full font-bold">Beranda</Link>
        </div>
      </header>

      <article className="max-w- mx-auto px-4 py-6">
        {/* Kategori */}
        <Link href={`/kategori/${encodeURIComponent((b.kategori_nama || 'berita').toLowerCase())}`} className="inline-block bg-red-600 text-white text- font-bold px-3 py-1 rounded-full uppercase tracking-wide">
          {b.kategori_nama || 'Berita'}
        </Link>

        {/* Judul Gede */}
        <h1 className="text- md:text- font-black leading-[1.15] tracking-tight mt-4">
          {b.judul}
        </h1>

        {/* Meta persis bungko.id */}
        <div className="flex items-center gap-2 text- text-zinc-500 mt-4">
          <span className="font-bold text-zinc-900">Redaksi</span>
          <span>•</span>
          <span>{b.tanggal || 'Baru saja'}</span>
          <span>•</span>
          <span>{b.views || ''}</span>
        </div>

        {/* Gambar */}
        <img src={img} alt={b.judul} className="w-full rounded-2xl mt-6 bg-zinc-100 aspect-[16/9] object-cover" />

        {/* Isi */}
        <div className="prose prose-zinc prose-p:leading-[1.9] prose-p:text- max-w-none mt-8" dangerouslySetInnerHTML={{ __html: b.isi || "" }} />

        {/* Divider */}
        <hr className="my-10 border-zinc-100" />

        {/* Berita Terkait */}
        {related.length > 0 && (
          <section>
            <h3 className="text- font-black mb-4">Berita Terkait</h3>
            <div className="grid gap-4">
              {related.map((r: any) => {
                const rImgRaw = r.gambar || "";
                const rImg = rImgRaw.startsWith("http")? rImgRaw : `https://bungko.id/${String(rImgRaw).replace(/^\/+/, "")}`;
                return (
                  <Link key={r.id} href={`/berita/${r.slug || r.id}`} className="flex gap-4 group">
                    <img src={rImg} alt="" className="w- h- rounded-xl object-cover bg-zinc-100 shrink-0" />
                    <h4 className="text- font-bold leading-[1.35] line-clamp-2 group-hover:text-red-600">{r.judul}</h4>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </article>

      <footer className="border-t mt-12 py-8 text-center text- text-zinc-400">
        © 2026 BUNGKO.ID - Portal Berita Terpercaya
      </footer>
    </main>
  );
}
