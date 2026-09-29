import Link from "next/link";
export const dynamic = 'force-dynamic';
const API = "https://bungko.id/api-berita.php";
async function getDetail(slug: string) {
  try {
    const res = await fetch(`${API}?slug=${encodeURIComponent(slug)}`, { cache: "no-store" });
    const data = await res.json();
    if (Array.isArray(data)) return data[0];
    return data;
  } catch { return null; }
}
export default async function DetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const b = await getDetail(slug);
  if (!b) return <div className="max-w- mx-auto p-8">Berita tidak ditemukan. <Link href="/" className="text-red-600">Kembali</Link></div>;
  const imgRaw = b.gambar || "";
  const img = imgRaw.startsWith("http")? imgRaw : `https://bungko.id/${String(imgRaw).replace(/^\/+/, "")}`;
  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <header className="border-b sticky top-0 bg-white z-50">
        <div className="max-w- mx-auto px-4 h- flex items-center justify-between">
          <Link href="/" className="font-black text-">BUNGKO<span className="text-red-600">.ID</span></Link>
          <Link href="/" className="text-xs bg-black text-white px-4 py-2 rounded-full font-bold">Beranda</Link>
        </div>
      </header>
      <article className="max-w- mx-auto px-4 py-6">
        <div className="text- font-bold text-red-600 uppercase mb-2">{b.kategori_nama}</div>
        <h1 className="text- md:text- font-black leading-[1.2]">{b.judul}</h1>
        <p className="text- text-zinc-400 mt-3">Redaksi - {b.tanggal}</p>
        <img src={img} alt="" className="w-full rounded-2xl mt-6 bg-zinc-100 aspect-video object-cover" />
        <div className="prose prose-zinc max-w-none mt-6 text- leading-[1.8]" dangerouslySetInnerHTML={{ __html: b.isi || "" }} />
      </article>
    </main>
  );
}
