import Link from "next/link";

async function getDetail(slug: string) {
  const res = await fetch(`https://bungko.id/api-berita.php?slug=${encodeURIComponent(slug)}`, { cache: 'no-store' });
  const data = await res.json();
  if (data.error) return null;
  // bersihkan style putih yang mungkin kebawa dari DB
  if (data.isi) data.isi = data.isi.replace(/style="[^"]*"/gi, '').replace(/style='[^']*'/gi, '');
  return data;
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const b = await getDetail(slug);
  if (!b) return <div className="p-10 text-black">Berita tidak ditemukan: {slug}</div>;

  const raw = b.gambar || '';
  const img =!raw? `https://picsum.photos/seed/${b.id}/1200/700` : raw.startsWith('http')? raw : `https://bungko.id/${raw.replace(/^\/+/, '')}`;

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h- flex items-center justify-between">
          <Link href="/" className="font-black text-xl text-black">BUNGKO<span className="text-red-600">.ID</span></Link>
          <Link href="/" className="bg-black text-white text-sm px-5 py-2 rounded-full font-bold">← Beranda</Link>
        </div>
      </header>

      <article className="max-w-3xl mx-auto bg-white md:mt-6 md:border md:rounded- p-6 md:p-10">
        <h1 className="text- md:text- font-black leading-[1.1] text-black">{b.judul}</h1>
        <p className="text-sm text-zinc-500 mt-3">{b.kategori_nama} • {b.tanggal}</p>
        <img src={img} alt={b.judul} className="w-full aspect-video object-cover rounded-2xl mt-6 bg-zinc-100 border" />
        <div className="berita-content mt-8 text- leading-7" dangerouslySetInnerHTML={{ __html: b.isi || b.konten || '' }} />
      </article>
    </main>
  );
}