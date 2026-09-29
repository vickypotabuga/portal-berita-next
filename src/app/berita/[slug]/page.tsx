import Link from "next/link";
export const dynamic = 'force-dynamic';
const API = "https://bungko.id/api-berita.php";

async function getDetail(slug: string) {
  try {
    let res = await fetch(`${API}?slug=${encodeURIComponent(slug)}`, { cache: "no-store" });
    let data = await res.json();
    if (Array.isArray(data) && data[0]?.judul) return data[0];
    if (data?.judul) return data;
    res = await fetch(`${API}?id=${encodeURIComponent(slug)}`, { cache: "no-store" });
    data = await res.json();
    if (Array.isArray(data) && data[0]) return data[0];
    return data;
  } catch { return null; }
}

async function getRelated(kategori: string, excludeId: string) {
  try {
    const res = await fetch(`${API}?kategori=${encodeURIComponent(kategori)}&limit=8`, { cache: "no-store" });
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.filter((x: any) => String(x.id)!== String(excludeId)).slice(0, 4);
  } catch { return []; }
}

export default async function DetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const b = await getDetail(slug);
  if (!b) return <div className="min-h-screen flex items-center justify-center"><div className="text-center"><p className="font-bold">Berita tidak ditemukan</p><Link href="/" className="text-red-600 mt-2 inline-block font-bold">? Beranda</Link></div></div>;

  const imgRaw = b.gambar || "";
  const img = imgRaw.startsWith("http")? imgRaw : `https://bungko.id/${String(imgRaw).replace(/^\/+/, "")}`;
  const related = await getRelated(b.kategori_nama || "Berita", b.id);

  return (
    <main className="min-h-screen bg-white text-black">
      {/* HEADER PERSIS BUNGKO.ID */}
      <header className="border-b border-zinc-200">
        <div className="max-w- mx-auto px-4 h- flex items-center">
          <Link href="/" className="font-black text- tracking-tight">BUNGKO<span className="text-red-600">.ID</span></Link>
        </div>
      </header>

      <article className="max-w- mx-auto px-4 py-6">
        <div className="text-red-600 font-bold text- tracking-wide uppercase mb-3">{b.kategori_nama || "BERITA"}</div>

        <h1 className="text- md:text- font-black leading-[1.25] text-black">
          {b.judul}
        </h1>

        <div className="text- text-zinc-500 mt-3">Redaksi - {b.tanggal || ""}</div>

        {/* GAMBAR FIX - GAK KETARIK LAGI */}
        <div className="mt-6 w-full overflow-hidden rounded-xl bg-zinc-100">
          <img src={img} alt={b.judul} className="w-full h-auto object-cover" />
        </div>

        {/* ISI - FIX PROSE ANEH */}
        <div className="mt-6 text- leading-[1.8] text-zinc-800 [&_p]:mb-4 [&_h2]:text- [&_h2]:font-bold [&_h2]:mt-6 [&_img]:rounded-xl [&_img]:my-6" dangerouslySetInnerHTML={{ __html: b.isi || "" }} />

        <hr className="my-10 border-zinc-200" />

        {related.length > 0 && (
          <div>
            <h3 className="font-black text- mb-4">Berita Terkait</h3>
            <div className="space-y-4">
              {related.map((r: any) => {
                const rImgRaw = r.gambar || "";
                const rImg = rImgRaw.startsWith("http")? rImgRaw : `https://bungko.id/${String(rImgRaw).replace(/^\/+/, "")}`;
                return (
                  <Link key={r.id} href={`/berita/${r.slug || r.id}`} className="flex gap-3 group">
                    <div className="w- h- rounded-lg overflow-hidden bg-zinc-100 shrink-0">
                      <img src={rImg} alt="" className="w-full h-full object-cover group-hover:scale-105 transition" />
                    </div>
                    <h4 className="font-bold text- leading-[1.4] line-clamp-2 group-hover:text-red-600">{r.judul}</h4>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </article>
    </main>
  );
}
