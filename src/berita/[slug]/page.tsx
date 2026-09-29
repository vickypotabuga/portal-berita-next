import Link from "next/link";

async function getDetail(slug: string) {
  const res = await fetch(`https://bungko.id/api-berita.php?slug=${encodeURIComponent(slug)}`, { cache: 'no-store' });
  const data = await res.json();
  if (data.error || !data.id) return null;
  return data;
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const b = await getDetail(slug);
  if (!b) return <div className="p-10 text-black">Berita tidak ditemukan: {slug}</div>;

  const raw = b.gambar || "";
  const img = !raw ? `https://picsum.photos/seed/${b.id}/1200/700` : raw.startsWith('http') ? raw : `https://bungko.id/${raw.replace(/^\/+/, '')}`;

  return (
    <main style={{ background: '#fafafa', minHeight: '100vh' }}>
      <header style={{ background: 'white', borderBottom: '1px solid #e4e4e7', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '768px', margin: '0 auto', padding: '0 16px', height: '64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ fontWeight: 900, fontSize: '20px', color: 'black' }}>BUNGKO<span style={{ color: '#dc2626' }}>.ID</span></Link>
          <Link href="/" style={{ background: 'black', color: 'white', padding: '8px 20px', borderRadius: '999px', fontSize: '14px', fontWeight: 700 }}>← Beranda</Link>
        </div>
      </header>

      <article style={{ maxWidth: '768px', margin: '24px auto', background: 'white', borderRadius: '16px', border: '1px solid #e4e4e7', padding: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ background: '#dc2626', color: 'white', fontSize: '11px', fontWeight: 800, padding: '4px 12px', borderRadius: '999px' }}>{b.kategori_nama || 'BERITA'}</span>
          <span style={{ fontSize: '11px', color: '#71717a' }}>{b.tanggal || ''}</span>
        </div>

        <h1 style={{ fontSize: '32px', fontWeight: 900, lineHeight: '1.15', color: '#18181b' }}>{b.judul}</h1>

        <img src={img} alt="" style={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', borderRadius: '16px', marginTop: '24px', border: '1px solid #e4e4e7' }} />

        {/* FIX PUTIH - KITA PAKSA HITAM DENGAN INLINE STYLE */}
        <div
          style={{ marginTop: '32px', color: '#18181b', fontSize: '18px', lineHeight: '1.8' }}
          className="berita-content"
        >
          <style>{`
            .berita-content * { color: #18181b !important; }
            .berita-content p { margin-bottom: 16px; color: #27272a !important; font-size: 17px; line-height: 1.8; }
            .berita-content h2, .berita-content h3 { color: #000 !important; font-weight: 800; margin: 24px 0 12px; font-size: 20px; }
            .berita-content strong { color: #000 !important; }
          `}</style>
          <div dangerouslySetInnerHTML={{ __html: b.isi || b.konten || '' }} />
        </div>
      </article>
    </main>
  );
}