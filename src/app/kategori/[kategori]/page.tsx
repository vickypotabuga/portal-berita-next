import Link from "next/link";
import type { Metadata } from "next";
const API = "https://bungko.id/api-berita.php";
async function getByKategori(kategori: string) {
  const res = await fetch(`${API}?kategori=${encodeURIComponent(kategori)}&limit=30`, { cache: "no-store" });
  const data = await res.json();
  return Array.isArray(data)? data : [];
}
export async function generateMetadata({ params }: { params: Promise<{ kategori: string }> }): Promise<Metadata> {
  const { kategori } = await params;
  return { title: `Berita ${decodeURIComponent(kategori)} Terbaru - BUNGKO.ID` };
}
export default async function KategoriPage({ params }: { params: Promise<{ kategori: string }> }) {
  const { kategori } = await params;
  const decoded = decodeURIComponent(kategori);
  const berita = await getByKategori(decoded);
  return (
    <main className="min-h-screen bg-[#fafafa] text-black">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h- flex items-center justify-between">
          <Link href="/" className="font-black text-xl">BUNGKO<span className="text-red-600">.ID</span></Link>
          <Link href="/" className="bg-black text-white text-xs px-4 py-2 rounded-full font-bold">Beranda</Link>
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text- font-black mb-6 capitalize">Kategori: <span className="text-red-600">{decoded}</span></h1>
        <div className="grid md:grid-cols-3 gap-5">
          {berita.map((b: any) => {
            const img = (b.gambar || "").startsWith("http")? b.gambar : `https://bungko.id/${(b.gambar || "").replace(/^\/+/, "")}`;
            return (
              <Link key={b.id} href={`/berita/${b.slug || b.id}`} className="bg-white rounded-2xl border overflow-hidden hover:shadow-lg">
                <img src={img} className="w-full aspect-video object-cover bg-zinc-100" alt="" />
                <div className="p-4"><span className="bg-red-600 text-white text- font-bold px-2 py-1 rounded-full">{b.kategori_nama}</span><h3 className="font-bold mt-2 line-clamp-2">{b.judul}</h3></div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
